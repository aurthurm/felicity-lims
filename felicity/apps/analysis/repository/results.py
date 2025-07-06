from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.analysis.entities.results import AnalysisResult, ResultMutation
from felicity.utils.encryption import encrypt_phi, decrypt_phi


class ResultMutationRepository(BaseRepository[ResultMutation]):
    def __init__(self) -> None:
        super().__init__(ResultMutation)


class AnalysisResultRepository(BaseRepository[AnalysisResult]):
    def __init__(self) -> None:
        super().__init__(AnalysisResult)
    
    async def search_by_encrypted_result(
        self,
        result_value: str,
        analysis_uid: Optional[str] = None,
        sample_uid: Optional[str] = None,
        session: Optional[AsyncSession] = None
    ) -> List[AnalysisResult]:
        """
        HIPAA-compliant search for analysis results using encrypted result values.
        
        Since encrypted fields cannot be directly searched in the database,
        this method retrieves matching results based on non-encrypted criteria
        and then filters by decrypted result values in application memory.
        
        Args:
            result_value: Result value to search for
            analysis_uid: Optional analysis UID to filter by
            sample_uid: Optional sample UID to filter by
            session: Optional database session
            
        Returns:
            List of matching analysis results
        """
        # Build filter criteria for non-encrypted fields
        filter_kwargs = {}
        if analysis_uid:
            filter_kwargs["analysis_uid"] = analysis_uid
        if sample_uid:
            filter_kwargs["sample_uid"] = sample_uid
        
        # Get results based on non-encrypted criteria
        if filter_kwargs:
            candidate_results = await self.get_all(session=session, **filter_kwargs)
        else:
            # If no non-encrypted filters, this would be expensive for large datasets
            # Consider implementing result pagination or additional filtering
            candidate_results = await self.get_all(session=session)
        
        matching_results = []
        
        for result in candidate_results:
            if result.result and result_value.lower() in result.result.lower():
                matching_results.append(result)
        
        return matching_results
    
    async def find_by_exact_encrypted_result(
        self,
        result_value: str,
        analysis_uid: Optional[str] = None,
        sample_uid: Optional[str] = None,
        session: Optional[AsyncSession] = None
    ) -> Optional[AnalysisResult]:
        """
        Find analysis result by exact match on encrypted result value.
        
        Args:
            result_value: Exact result value to match
            analysis_uid: Optional analysis UID to filter by
            sample_uid: Optional sample UID to filter by
            session: Optional database session
            
        Returns:
            Matching analysis result or None
        """
        # Encrypt the search value
        encrypted_value = encrypt_phi(result_value)
        if not encrypted_value:
            return None
        
        # Build search criteria
        filter_kwargs = {"result": encrypted_value}
        if analysis_uid:
            filter_kwargs["analysis_uid"] = analysis_uid
        if sample_uid:
            filter_kwargs["sample_uid"] = sample_uid
        
        return await self.get(session=session, **filter_kwargs)
