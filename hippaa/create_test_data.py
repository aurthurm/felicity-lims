#!/usr/bin/env python3
"""
Test Data Creation Script for HIPAA Migration

Creates test data for client validation and migration testing.
Generates realistic but synthetic patient and analysis data.
"""

import asyncio
import argparse
import sys
import uuid
import random
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from felicity.database.session import async_session


class TestDataGenerator:
    """Generates test data for HIPAA migration validation."""
    
    def __init__(self, client_id: str):
        self.client_id = client_id
        self.generated_patients = []
        self.generated_results = []
    
    def generate_patient_data(self, count: int) -> List[Dict]:
        """Generate synthetic patient data."""
        
        first_names = [
            "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
            "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
            "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Daniel", "Lisa",
            "Matthew", "Betty", "Anthony", "Helen", "Mark", "Sandra", "Donald", "Donna"
        ]
        
        last_names = [
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
            "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
            "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
            "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young"
        ]
        
        patients = []
        
        for i in range(count):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            
            # Generate date of birth (18-80 years old)
            today = datetime.now()
            min_age = today - timedelta(days=80*365)
            max_age = today - timedelta(days=18*365)
            birth_date = min_age + timedelta(
                days=random.randint(0, (max_age - min_age).days)
            )
            
            # Generate contact info
            email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@example.com"
            phone_mobile = f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
            phone_home = f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}" if random.random() > 0.3 else None
            
            patient = {
                "uid": str(uuid.uuid4()),
                "first_name": first_name,
                "middle_name": random.choice(["A", "B", "C", "D", "E", ""]) if random.random() > 0.5 else None,
                "last_name": last_name,
                "email": email,
                "phone_mobile": phone_mobile,
                "phone_home": phone_home,
                "date_of_birth": birth_date,
                "gender": random.choice(["M", "F", "O"]),
                "client_id": self.client_id,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "created_by_uid": "test_user",
                "updated_by_uid": "test_user"
            }
            
            patients.append(patient)
        
        self.generated_patients = patients
        return patients
    
    def generate_analysis_results(self, patient_uids: List[str], results_per_patient: int = 3) -> List[Dict]:
        """Generate synthetic analysis results."""
        
        test_types = [
            "Complete Blood Count", "Basic Metabolic Panel", "Lipid Panel", 
            "Liver Function Test", "Thyroid Function", "Urinalysis",
            "Hemoglobin A1C", "Vitamin D", "PSA", "Glucose"
        ]
        
        result_values = [
            "Normal", "Abnormal", "High", "Low", "Positive", "Negative",
            "Within normal limits", "Slightly elevated", "Decreased",
            "Glucose: 95 mg/dL", "Cholesterol: 180 mg/dL", "Hemoglobin: 14.5 g/dL",
            "White cell count: 7,200/μL", "Creatinine: 1.0 mg/dL",
            "Blood pressure: 120/80 mmHg", "Temperature: 98.6°F"
        ]
        
        results = []
        
        for patient_uid in patient_uids:
            num_results = random.randint(1, results_per_patient)
            
            for i in range(num_results):
                test_type = random.choice(test_types)
                result_value = random.choice(result_values)
                
                # Add some clinical context
                clinical_notes = [
                    "Patient reports feeling well",
                    "Routine annual screening",
                    "Follow-up for previous abnormal result",
                    "Pre-operative assessment",
                    "Monitoring chronic condition",
                    "Patient symptoms: fatigue, headache",
                    "Requested by primary care physician"
                ]
                
                result = {
                    "uid": str(uuid.uuid4()),
                    "sample_uid": str(uuid.uuid4()),  # Fake sample reference
                    "analysis_uid": str(uuid.uuid4()),  # Fake analysis reference
                    "result": result_value,
                    "analyst_uid": "test_analyst",
                    "instrument_uid": "test_instrument",
                    "method_uid": "test_method",
                    "status": "approved",
                    "reportable": True,
                    "created_at": datetime.now() - timedelta(days=random.randint(1, 365)),
                    "updated_at": datetime.now(),
                    "created_by_uid": "test_user",
                    "updated_by_uid": "test_user"
                }
                
                results.append(result)
        
        self.generated_results = results
        return results
    
    def generate_patient_identifications(self, patient_uids: List[str]) -> List[Dict]:
        """Generate patient identification records."""
        
        identification_types = ["SSN", "Driver License", "Passport", "Medical Record Number"]
        
        identifications = []
        
        for patient_uid in patient_uids:
            # Each patient gets 1-2 identification records
            num_ids = random.randint(1, 2)
            
            for i in range(num_ids):
                id_type = random.choice(identification_types)
                
                # Generate appropriate ID value based on type
                if id_type == "SSN":
                    value = f"{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}"
                elif id_type == "Driver License":
                    value = f"DL{random.randint(100000, 999999)}"
                elif id_type == "Passport":
                    value = f"P{random.randint(1000000, 9999999)}"
                else:  # Medical Record Number
                    value = f"MRN{random.randint(100000, 999999)}"
                
                identification = {
                    "uid": str(uuid.uuid4()),
                    "patient_uid": patient_uid,
                    "value": value,
                    "coding_uid": str(uuid.uuid4()),  # Fake coding reference
                    "created_at": datetime.now(),
                    "updated_at": datetime.now(),
                    "created_by_uid": "test_user",
                    "updated_by_uid": "test_user"
                }
                
                identifications.append(identification)
        
        return identifications
    
    def generate_clinical_data(self, count: int) -> List[Dict]:
        """Generate clinical data records."""
        
        symptoms = [
            "Patient reports fatigue and weakness",
            "Complains of headaches and dizziness",
            "Experiencing chest pain and shortness of breath",
            "Nausea and vomiting for 2 days",
            "Joint pain and stiffness in the morning",
            "Persistent cough with clear sputum",
            "Difficulty sleeping and anxiety"
        ]
        
        clinical_indications = [
            "Routine health screening",
            "Suspected diabetes mellitus",
            "Evaluation of chest pain",
            "Hypertension monitoring",
            "Pre-operative assessment",
            "Follow-up for abnormal lab results",
            "Investigation of fatigue"
        ]
        
        vital_signs = [
            "BP: 120/80, HR: 72, Temp: 98.6°F, RR: 16",
            "BP: 140/90, HR: 88, Temp: 99.1°F, RR: 18",
            "BP: 110/70, HR: 65, Temp: 97.8°F, RR: 14",
            "BP: 130/85, HR: 78, Temp: 98.4°F, RR: 16"
        ]
        
        treatments = [
            "Continue current medications",
            "Start antihypertensive therapy",
            "Recommend lifestyle modifications",
            "Schedule follow-up in 3 months",
            "Refer to cardiologist",
            "Increase medication dosage",
            "Add dietary supplements"
        ]
        
        clinical_records = []
        
        for i in range(count):
            record = {
                "uid": str(uuid.uuid4()),
                "patient_uid": random.choice([p["uid"] for p in self.generated_patients]) if self.generated_patients else str(uuid.uuid4()),
                "symptoms_raw": random.choice(symptoms),
                "clinical_indication": random.choice(clinical_indications),
                "vitals": random.choice(vital_signs),
                "treatment_notes": random.choice(treatments),
                "other_context": "Generated test data for HIPAA migration validation",
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "created_by_uid": "test_user",
                "updated_by_uid": "test_user"
            }
            
            clinical_records.append(record)
        
        return clinical_records
    
    async def insert_test_data(self, patients: List[Dict], results: List[Dict], 
                              identifications: List[Dict], clinical_data: List[Dict]):
        """Insert generated test data into database."""
        
        print(f"Inserting test data into database...")
        
        try:
            async with async_session() as session:
                
                # Insert patients
                print(f"  Inserting {len(patients)} patients...")
                for patient in patients:
                    patient_query = """
                        INSERT INTO patient (
                            uid, first_name, middle_name, last_name, email, 
                            phone_mobile, phone_home, date_of_birth, gender,
                            client_id, created_at, updated_at, created_by_uid, updated_by_uid
                        ) VALUES (
                            :uid, :first_name, :middle_name, :last_name, :email,
                            :phone_mobile, :phone_home, :date_of_birth, :gender,
                            :client_id, :created_at, :updated_at, :created_by_uid, :updated_by_uid
                        )
                    """
                    await session.execute(patient_query, patient)
                
                # Insert patient identifications
                print(f"  Inserting {len(identifications)} patient identifications...")
                for identification in identifications:
                    id_query = """
                        INSERT INTO patient_identification (
                            uid, patient_uid, value, coding_uid,
                            created_at, updated_at, created_by_uid, updated_by_uid
                        ) VALUES (
                            :uid, :patient_uid, :value, :coding_uid,
                            :created_at, :updated_at, :created_by_uid, :updated_by_uid
                        )
                    """
                    await session.execute(id_query, identification)
                
                # Insert analysis results
                print(f"  Inserting {len(results)} analysis results...")
                for result in results:
                    result_query = """
                        INSERT INTO analysis_result (
                            uid, sample_uid, analysis_uid, result, analyst_uid,
                            instrument_uid, method_uid, status, reportable,
                            created_at, updated_at, created_by_uid, updated_by_uid
                        ) VALUES (
                            :uid, :sample_uid, :analysis_uid, :result, :analyst_uid,
                            :instrument_uid, :method_uid, :status, :reportable,
                            :created_at, :updated_at, :created_by_uid, :updated_by_uid
                        )
                    """
                    await session.execute(result_query, result)
                
                # Insert clinical data
                print(f"  Inserting {len(clinical_data)} clinical data records...")
                for clinical in clinical_data:
                    clinical_query = """
                        INSERT INTO clinical_data (
                            uid, patient_uid, symptoms_raw, clinical_indication, vitals,
                            treatment_notes, other_context,
                            created_at, updated_at, created_by_uid, updated_by_uid
                        ) VALUES (
                            :uid, :patient_uid, :symptoms_raw, :clinical_indication, :vitals,
                            :treatment_notes, :other_context,
                            :created_at, :updated_at, :created_by_uid, :updated_by_uid
                        )
                    """
                    await session.execute(clinical_query, clinical)
                
                await session.commit()
                print(f"  ✅ All test data inserted successfully")
        
        except Exception as e:
            print(f"  ❌ Error inserting test data: {e}")
            raise
    
    async def create_complete_test_dataset(self, test_patients: int, test_results: int):
        """Create a complete test dataset."""
        
        print(f"Creating test dataset for client: {self.client_id}")
        print(f"Patients: {test_patients}, Results: {test_results}")
        print("=" * 50)
        
        # Generate all test data
        patients = self.generate_patient_data(test_patients)
        patient_uids = [p["uid"] for p in patients]
        
        results = self.generate_analysis_results(patient_uids, test_results // test_patients)
        identifications = self.generate_patient_identifications(patient_uids)
        clinical_data = self.generate_clinical_data(test_patients // 2)  # Half the patients get clinical data
        
        # Insert into database
        await self.insert_test_data(patients, results, identifications, clinical_data)
        
        # Generate summary
        print(f"\n" + "=" * 50)
        print("TEST DATA CREATION SUMMARY")
        print("=" * 50)
        print(f"Client ID: {self.client_id}")
        print(f"Patients created: {len(patients)}")
        print(f"Patient identifications created: {len(identifications)}")
        print(f"Analysis results created: {len(results)}")
        print(f"Clinical data records created: {len(clinical_data)}")
        
        # Print sample data for validation
        print(f"\nSample patient data:")
        for i, patient in enumerate(patients[:3]):
            print(f"  {i+1}. {patient['first_name']} {patient['last_name']} - {patient['email']}")
        
        print(f"\nSample analysis results:")
        for i, result in enumerate(results[:3]):
            print(f"  {i+1}. {result['result']}")
        
        print(f"\n✅ Test data creation completed successfully!")


async def main():
    """Main entry point for test data creation."""
    
    parser = argparse.ArgumentParser(description='Create test data for HIPAA migration validation')
    parser.add_argument('--client-id', type=str, required=True, help='Client identifier')
    parser.add_argument('--test-patients', type=int, default=10, help='Number of test patients to create')
    parser.add_argument('--test-results', type=int, default=50, help='Number of test results to create')
    
    args = parser.parse_args()
    
    try:
        generator = TestDataGenerator(args.client_id)
        await generator.create_complete_test_dataset(args.test_patients, args.test_results)
        return True
        
    except Exception as e:
        print(f"❌ Test data creation failed: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)