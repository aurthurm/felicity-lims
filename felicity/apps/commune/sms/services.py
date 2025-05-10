from felicity.apps.analysis.entities.analysis import AnalysisSpecification, Sample
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.setup.caches import get_laboratory
import logging

from felicity.apps.abstract.service import BaseService
from felicity.apps.commune.sms.entities import SmsMessage, SmsTemplate
from felicity.apps.commune.sms.enum import SmsAudience, SmsStatus, SmsTrigger
from felicity.apps.commune.sms.repository import SmsMessageRepository, SmsTemplateRepository
from felicity.apps.commune.sms.schemas import SmsMessageCreate, SmsMessageUpdate, SmsTemplateCreate, SmsTemplateUpdate
from felicity.utils.helpers import extract_template_variables
from felicity.apps.analysis.services.analysis import AnalysisSpecificationService, SampleService


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



class SmsTemplateService(BaseService[SmsTemplate, SmsTemplateCreate, SmsTemplateUpdate]):
    def __init__(self):
        super().__init__(SmsTemplateRepository())


class SmsMessageService(BaseService[SmsMessage, SmsMessageCreate, SmsMessageUpdate]):
    def __init__(self):
        self.sms_template_service = SmsTemplateService()
        super().__init__(SmsMessageRepository())

    async def create_sms_for_sample(self, uid: str) -> None:
        """Create SMS messages for a sample based on results and templates with triggers"""
        sample = await SampleService().get(
            uid=uid, 
            related= [
                'analysis_request.patient.identifications',
                'analysis_request.client',
                'analysis_request.client_contact',
                'analysis_results.analysis'
            ]
        )
        
        if not sample or not sample.analysis_request:
            return
        
        # Process each result
        for result in sample.analysis_results:
            if not result.reportable:
                continue
                
            # Find templates for this analysis with triggers
            templates = await self.sms_template_service.get_all(
                target_type= "analysis",
                target_uid=result.analysis_uid,
                is_active=True,
                specification_trigger__ne=None
            )
            
            for template in templates:
                # Check if this result should trigger the SMS based on the specification
                if await self._should_trigger_sms(sample, result, template.specification_trigger):
                    await self._create_sms_for_template(sample, result, template)

    async def _create_sms_for_template(self, sample, result, template):
        """Create an SMS based on the template audience"""
        try:
            # Build base metadata for the template
            laboratory = await get_laboratory()
            metadata = {**laboratory.sms_metadata}
            
            # Add sample metadata
            if hasattr(sample, 'sms_metadata'):
                metadata.update(sample.sms_metadata)
                
            # Add result metadata
            if hasattr(result, 'sms_metadata'):
                metadata.update(result.sms_metadata)
                
            patient = sample.analysis_request.patient
            # Add patient metadata
            if hasattr(patient, 'sms_metadata'):
                metadata.update(patient.sms_metadata)

            client_contact = sample.analysis_request.client_contact
            if hasattr(client_contact, 'sms_metadata'):
                metadata.update(client_contact.sms_metadata)
            
            # Render the SMS template
            message = await self.render_sms(template.template, metadata)
            
            # Check who should receive the SMS based on audience
            if template.audience == SmsAudience.PATIENT:
                # Send to patient
                if not patient or not patient.phone_mobile or not patient.consent_sms:
                    # Skip if patient doesn't have a phone or hasn't consented
                    return
                    
                # Create the SMS
                sms = SmsMessageCreate(
                    template_uid=template.uid,
                    recipient=patient.phone_mobile,
                    message=message,
                    status=SmsStatus.SCHEDULED,
                    target_type="result",
                    target_uid=result.uid,
                )
                
            elif template.audience == SmsAudience.CLIENT:
                # Send to client contact
                if not client_contact or not client_contact.phone_mobile or not client_contact.consent_sms:
                    # Skip if client contact doesn't have a phone or hasn't consented
                    return
                
                # Create the SMS
                sms = SmsMessageCreate(
                    template_uid=template.uid,
                    recipient=client_contact.phone_mobile,
                    message=message,
                    status=SmsStatus.SCHEDULED,
                    target_type="result",
                    target_uid=result.uid,
                )
            
            await self.create(sms)
                
        except Exception as e:
            # Log the error
            print(f"Error creating SMS for result {result.uid} with template {template.uid}: {str(e)}")


    async def render_sms(self, template: str, metadata: dict) -> str:
        """
        Render an SMS template with data from model instances.
        """
        try:
            variables = extract_template_variables(template)     
            
            # Create a context dictionary for rendering
            context = {}
            
            missing_vars = []
            for var in variables:
                if var in metadata:
                    # Check if the variable is in the metadata
                    context[var] = metadata[var]
                else:
                    missing_vars.append(var)
            
            if missing_vars:
                raise ValueError(f"SMS Variables not found in metadata: {', '.join(missing_vars)}")
            
            # Render the template with the context
            rendered_text = template
            for var, value in context.items():
                placeholder = "{" + var + "}"
                # Convert value to string and handle None values
                str_value = "" if value is None else str(value)
                rendered_text = rendered_text.replace(placeholder, str_value)
            
            return rendered_text
            
        except Exception as e:
            raise ValueError(f"Error rendering SMS template: {str(e)}")


    async def _should_trigger_sms(self, sample: Sample, result: AnalysisResult, trigger_type: SmsTrigger) -> bool:
        """
        Determine if this result should trigger an SMS based on the trigger type
        and the result value compared to specifications.
        """
        # Check against trigger type
        if trigger_type == SmsTrigger.ANY_RESULT:
            return True
        
        # Get specification for this result
        spec = await self._get_specification_for_result(sample, result)
        if not spec:
            return False

        try:
            value = float(result.result)
        except Exception as e:
            value = result.result
        
        # For numeric results
        if isinstance(value, float):
            if trigger_type == SmsTrigger.NORMAL:
                return (spec.min is None or value >= spec.min) and (spec.max is None or value <= spec.max)
            elif trigger_type == SmsTrigger.BELOW_NORMAL:
                return (spec.min is not None and value < spec.min and 
                       (spec.min_warn is None or value > spec.min_warn))
            elif trigger_type == SmsTrigger.ABOVE_NORMAL:
                return (spec.max is not None and value > spec.max and 
                       (spec.max_warn is None or value < spec.max_warn))
            elif trigger_type == SmsTrigger.BELOW_WARNING:
                return spec.min_warn is not None and value <= spec.min_warn
            elif trigger_type == SmsTrigger.ABOVE_WARNING:
                return spec.max_warn is not None and value >= spec.max_warn
            elif trigger_type == SmsTrigger.ANY_ABNORMAL:
                return ((spec.min is not None and value < spec.min) or 
                        (spec.max is not None and value > spec.max))
            elif trigger_type == SmsTrigger.ANY_WARNING:
                return ((spec.min_warn is not None and value <= spec.min_warn) or 
                        (spec.max_warn is not None and value >= spec.max_warn))
        
        # For textual results
        elif isinstance(value, str):
            if trigger_type == SmsTrigger.TEXTUAL_NORMAL:
                return spec.normal_value and value == spec.normal_value
            elif trigger_type == SmsTrigger.TEXTUAL_WARNING:
                if not spec.warn_values:
                    return False
                warn_values = [v.strip() for v in spec.warn_values.split(',')]
                return value in warn_values
            elif trigger_type == SmsTrigger.ANY_ABNORMAL:
                return spec.normal_value and value != spec.normal_value
            elif trigger_type == SmsTrigger.ANY_WARNING:
                if not spec.warn_values:
                    return False
                warn_values = [v.strip() for v in spec.warn_values.split(',')]
                return value in warn_values
        return False

    async def _get_specification_for_result(self, sample: Sample, result: AnalysisResult) -> AnalysisSpecification | None:
        """Get the appropriate specification for this result"""
        # Query specifications for this analysis
        specs = await AnalysisSpecificationService().get_all(analysis_uid=result.analysis_uid)
        
        if not specs:
            return None
            
        # Get result context (method, patient info)
        method_uid = result.method_uid if hasattr(result, 'method_uid') else None
        
        # Try to get patient info (for gender/age specific specs)
        patient = None
        patient_gender = None
        patient_age = None
        
        if (hasattr(sample, 'analysis_request') and 
            sample.analysis_request and 
            hasattr(sample.analysis_request, 'patient') and
            sample.analysis_request.patient):
            
            patient = sample.analysis_request.patient
            patient_gender = patient.gender if hasattr(patient, 'gender') else None
            patient_age = patient.age if hasattr(patient, 'age') else None
    
        # Find the most specific matching specification
        matching_specs = []
        for spec in specs:
            # Check method match if specified
            if spec.method_uid and method_uid and spec.method_uid != method_uid:
                continue
                
            # Check gender match if specified
            if spec.gender and patient_gender and spec.gender != patient_gender:
                continue
                
            # Check age range if specified
            if spec.age_min is not None and patient_age is not None and patient_age < spec.age_min:
                continue
                
            if spec.age_max is not None and patient_age is not None and patient_age > spec.age_max:
                continue
                
            matching_specs.append(spec)
            
        if not matching_specs:
            return None
            
        # Sort by specificity (more criteria = more specific)
        def specificity_score(spec):
            score = 0
            if spec.method_uid:
                score += 1
            if spec.gender:
                score += 1
            if spec.age_min is not None:
                score += 1
            if spec.age_max is not None:
                score += 1
            return score
        
        matching_specs.sort(key=specificity_score, reverse=True)
        return matching_specs[0]


"""supported sms variables
{lab_name}, {lab_email}, {lab_phone}, 
{sample_id}, {client_sample_id}, {date_collected},
{patient_name}, {patient_id}, {patient_name}, {gender}, {client_patient_id}, {age}, identifiers names
{analysis_keyword}, {analysis_name}, 
{result}, {unit}, 
{client_id}, {client_name}, 
"""