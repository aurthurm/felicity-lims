# """ Process Flow Schematic
# *********************************************************************************
#
# AnalysisRequest
#     Sampe 1
#         Profile: U+Es
#     Sample 2
#         Profile: FBS
#     Sample 3
#         Anaysis: MP's
#
# 1. Create an AnalysisRequest
# 2. Choose Sampe Types: from sample types auto create samples
# 3. For each sample attach profile or selected analysis individually
# 4. Publish samples and not analyses
# 5. Close the request once all samples are  published
#
# *********************************************************************************
# """
#
#
# class XX:
#     async def sample_all(
#         self,
#         info,
#         page_size: int | None = None,
#         after_cursor: str | None = None,
#         before_cursor: str | None = None,
#         text: str | None = None,
#         status: str | None = None,
#         client_uid: str | None = None,
#         sort_by: list[str] | None = None,
#     ) -> r_types.SampleCursorPage:
#         filters = []
#
#         _or_text_ = {}
#         if has_value_or_is_truthy(text):
#             arg_list = [
#                 "sample_id__ilike",
#                 "analysis_request___patient___first_name__ilike",
#                 "analysis_request___patient___last_name__ilike",
#                 "analysis_request___patient___client_patient_id__ilike",
#                 "analysis_request___client_request_id__ilike",
#             ]
#             for _arg in arg_list:
#                 _or_text_[_arg] = f"%{text}%"
#
#             text_filters = {sa.or_: _or_text_}
#             filters.append(text_filters)
#
#         if client_uid:
#             filters.append({"analysis_request___client_uid__exact": client_uid})
#
#         if status:
#             filters.append({"status__exact": status})
#
#         # Exclude QC Sample else front-end will throw ?????
#         # filters.append({'internal_use__ne': True})
#         filters.append({"analysis_request__ne": None})
#
#         page = await a_models.Sample.paginate_with_cursors(
#             page_size=page_size,
#             after_cursor=after_cursor,
#             before_cursor=before_cursor,
#             filters=filters,
#             sort_by=sort_by,
#         )
#
#         total_count: int = page.total_count
#         edges: List[r_types.SampleEdge[r_types.SamplesWithResults]] = page.edges
#         items: List[r_types.SamplesWithResults] = page.items
#         page_info: PageInfo = page.page_info
#
#         return r_types.SampleCursorPage(
#             total_count=total_count, edges=edges, items=items, page_info=page_info
#         )
#
#     async def samples_for_shipment_assign(
#         self,
#         info,
#         page_size: int | None = None,
#         after_cursor: str | None = None,
#         before_cursor: str | None = None,
#         text: str | None = None,
#         sort_by: list[str] | None = None,
#         analysis_uid: str | None = None,
#         sample_type_uid: str | None = None,
#     ) -> r_types.SampleCursorPage:
#
#         filters = []
#         _or_text_ = {}
#         if has_value_or_is_truthy(text):
#             arg_list = ["sample___sample_id__ilike"]
#             for _arg in arg_list:
#                 _or_text_[_arg] = f"%{text}%"
#
#             text_filters = {sa.or_: _or_text_}
#             filters.append(text_filters)
#
#         if analysis_uid:
#             # filters.append({"analysis_uid": analysis_uid})
#             pass
#
#         if sample_type_uid:
#             filters.append({"sample_type_uid": sample_type_uid})
#
#         filters.append(
#             {
#                 "status__in": [
#                     analysis_conf.states.sample.RECEIVED,
#                     analysis_conf.states.sample.PAIRED,
#                 ]
#             }
#         )
#
#         if not sort_by:
#             sort_by = ["-priority", "uid"]
#
#         page = await a_models.Sample.paginate_with_cursors(
#             page_size=page_size,
#             after_cursor=after_cursor,
#             before_cursor=before_cursor,
#             filters=filters,
#             sort_by=sort_by,
#             get_related="analyses",
#         )
#
#         total_count: int = page.total_count
#         edges: List[r_types.SampleEdge[a_types.SampleType]] = page.edges
#         items: List[r_types.SampleType] = page.items
#         page_info: PageInfo = page.page_info
#
#         return r_types.SampleCursorPage(
#             total_count=total_count, edges=edges, items=items, page_info=page_info
#         )
#
#     # awaiting deprecation since sample_all can now achieve this
#
#     async def sample_search(
#         self, info, status: str, text: str, client_uid: str
#     ) -> List[a_types.SampleType]:
#         return await sample_search(status, text, client_uid)
#
#     # awaiting deprecation since sample_all can now achieve this
#
#     async def sample_count(self, info, status: str, text: str, client_uid: str) -> int:
#         combined = await sample_search(status, text, client_uid)
#         return len(combined)
#
#     async def sample_by_uid(self, info, uid: str) -> a_types.SampleType:
#         return await a_models.Sample.get(uid=uid)
#
#     async def sample_by_parent_id(
#         self, info, parent_id: str, text: str | None = None
#     ) -> List[a_types.SampleType]:
#         """Retrieve associated invalidated parent - children relationship by mptt parent_id"""
#         samples: list[a_models.Sample] = await a_models.Sample.get_all(
#             parent_id=parent_id
#         )
#
#         if text == "repeat":  # created by invalidation hence they contain "_R0"
#             return list(filter(lambda x: "_R0" in x.sample_id, samples))
#
#         return samples
#
#     async def samples_by_uids(
#         self, info, sample_uids: list[str] = []
#     ) -> List[r_types.SamplesWithResults]:
#         """Samples for publishing/ report printing"""
#         return await a_models.Sample.get_all(uid__in=sample_uids)
#
#     async def samples_by_storage_container_uid(
#         self, info, uid: str
#     ) -> List[a_types.SampleType]:
#         """Retrieve stored samples for a given container uid"""
#         return await a_models.Sample.get_all(storage_container_uid=uid)
#
#     async def profile_all(self, info) -> List[a_types.ProfileType]:
#         return await a_models.Profile.all()
#
#     async def profile_by_uid(self, info, uid: str) -> a_types.ProfileType:
#         return await a_models.Profile.get(uid=uid)
#
#     async def profile_mappings_by_profile(
#         self, info, profile_uid: str
#     ) -> list[a_types.ProfileMappingType]:
#         return await a_models.ProfileCoding.get_all(profile_uid=profile_uid)
#
#     async def analysis_category_all(self, info) -> List[a_types.AnalysisCategoryType]:
#         return await a_models.AnalysisCategory.all()
#
#     async def analysis_category_by_uid(
#         self, info, uid: str
#     ) -> a_types.AnalysisCategoryType:
#         return await a_models.AnalysisCategory.get(uid=uid)
#
#     async def analysis_all(
#         self,
#         info,
#         page_size: int | None = None,
#         after_cursor: str | None = None,
#         before_cursor: str | None = None,
#         text: str | None = None,
#         sort_by: list[str] | None = None,
#         qc_only: bool | None = False,
#     ) -> a_types.AnalysisCursorPage:
#
#         filters = []
#         _or_text_ = {}
#         if has_value_or_is_truthy(text):
#             arg_list = ["name__ilike", "description__ilike", "keyword__ilike"]
#             for _arg in arg_list:
#                 _or_text_[_arg] = f"%{text}%"
#
#             text_filters = {sa.or_: _or_text_}
#             filters.append(text_filters)
#
#         if qc_only:
#             filters.append({"category___name__exact": "Quality Control"})
#
#         page = await a_models.Analysis.paginate_with_cursors(
#             page_size=page_size,
#             after_cursor=after_cursor,
#             before_cursor=before_cursor,
#             filters=filters,
#             sort_by=sort_by,
#             get_related="profiles",
#         )
#
#         total_count: int = page.total_count
#         edges: List[a_types.AnalysisEdge[a_types.AnalysisType]] = page.edges
#         items: List[a_types.AnalysisType] = page.items
#         page_info: PageInfo = page.page_info
#
#         return a_types.AnalysisCursorPage(
#             total_count=total_count, edges=edges, items=items, page_info=page_info
#         )
#
#     async def analysis_by_uid(self, info, uid: str) -> a_types.AnalysisType:
#         return await a_models.Analysis.get(uid=uid)
#
#     async def analysis_mappings_by_analysis(
#         self, info, analysis_uid: str
#     ) -> list[a_types.AnalysisMappingType]:
#         return await a_models.AnalysisCoding.get_all(analysis_uid=analysis_uid)
#
#     async def analysis_without_profile(self, info) -> List[a_types.AnalysisType]:
#         async with async_session_factory() as session:
#             result = await session.execute(sa.text("select * from analysis_profile"))
#
#         a_uids = list(set([ids[0] for ids in result.all()]))
#         return await a_models.Analysis.get_all(uid__notin=a_uids)
#
#     async def analysis_request_all(
#         self,
#         info,
#         page_size: int | None = None,
#         after_cursor: str | None = None,
#         before_cursor: str | None = None,
#         text: str | None = None,
#         sort_by: list[str] | None = None,
#     ) -> a_types.AnalysisRequestCursorPage:
#         filters = []
#
#         _or_text_ = {}
#         if has_value_or_is_truthy(text):
#             arg_list = [
#                 "client_request_id__ilike",
#                 "patient___first_name__ilike",
#                 "patient___last_name__ilike",
#                 "patient___client_patient_id__ilike",
#             ]
#             for _arg in arg_list:
#                 _or_text_[_arg] = f"%{text}%"
#
#             text_filters = {sa.or_: _or_text_}
#             filters.append(text_filters)
#
#         filters.append({"internal_use__ne": True})
#
#         page = await a_models.AnalysisRequest.paginate_with_cursors(
#             page_size=page_size,
#             after_cursor=after_cursor,
#             before_cursor=before_cursor,
#             filters=filters,
#             sort_by=sort_by,
#         )
#
#         total_count: int = page.total_count
#         edges: List[
#             a_types.AnalysisRequestEdge[a_types.AnalysisRequestWithSamples]
#         ] = page.edges
#         items: List[a_types.AnalysisRequestType] = page.items
#         page_info: PageInfo = page.page_info
#
#         return a_types.AnalysisRequestCursorPage(
#             total_count=total_count, edges=edges, items=items, page_info=page_info
#         )
#
#     async def analysis_request_by_uid(
#         self, info, uid: str
#     ) -> a_types.AnalysisRequestWithSamples:
#         return await a_models.AnalysisRequest.get(uid=uid)
#
#     async def analysis_requests_by_patient_uid(
#         self, info, uid: str
#     ) -> List[a_types.AnalysisRequestWithSamples]:
#         return await a_models.AnalysisRequest.get_all(patient_uid__exact=uid)
#
#     async def analysis_requests_by_client_uid(
#         self, info, uid: str
#     ) -> List[a_types.AnalysisRequestWithSamples]:
#         return await a_models.AnalysisRequest.get_all(client_uid__exact=uid)
#
#     async def analysis_result_by_uid(
#         self, info, uid: str
#     ) -> r_types.AnalysisResultType:
#         return await r_models.AnalysisResult.get(uid=uid)
#
#     async def analysis_result_by_sample_uid(
#         self, info, uid: str
#     ) -> List[r_types.AnalysisResultType]:
#         return await r_models.AnalysisResult.get_all(sample_uid__exact=uid)
#
#     async def analysis_results_for_ws_assign(
#         self,
#         info,
#         page_size: int | None = None,
#         after_cursor: str | None = None,
#         before_cursor: str | None = None,
#         text: str | None = None,
#         sort_by: list[str] | None = None,
#         analysis_uid: str | None = None,
#         sample_type_uid: str | None = None,
#     ) -> r_types.AnalysisResultCursorPage:
#
#         filters = [{"assigned": False}]
#         _or_text_ = {}
#         if has_value_or_is_truthy(text):
#             arg_list = ["sample___sample_id__ilike"]
#             for _arg in arg_list:
#                 _or_text_[_arg] = f"%{text}%"
#
#             text_filters = {sa.or_: _or_text_}
#             filters.append(text_filters)
#
#         if analysis_uid:
#             filters.append({"analysis_uid": analysis_uid})
#
#         if sample_type_uid:
#             filters.append({"sample___sample_type_uid": sample_type_uid})
#
#         filters.append({"sample___status": analysis_conf.states.sample.RECEIVED})
#         filters.append({"status": analysis_conf.states.result.PENDING})
#
#         if not sort_by:
#             sort_by = ["-sample___priority", "sample___uid"]
#
#         page = await r_models.AnalysisResult.paginate_with_cursors(
#             page_size=page_size,
#             after_cursor=after_cursor,
#             before_cursor=before_cursor,
#             filters=filters,
#             sort_by=sort_by,
#             get_related="sample",
#         )
#
#         total_count: int = page.total_count
#         edges: List[r_types.AnalysisResultEdge[r_types.AnalysisType]] = page.edges
#         items: List[r_types.AnalysisResultType] = page.items
#         page_info: PageInfo = page.page_info
#
#         return r_types.AnalysisResultCursorPage(
#             total_count=total_count, edges=edges, items=items, page_info=page_info
#         )
#
#     async def analysis_interim_all(self, info) -> List[a_types.AnalysisInterimType]:
#         return await a_models.AnalysisInterim.all()
#
#     async def analysis_interim_by_uid(
#         self, info, uid: str
#     ) -> a_types.AnalysisInterimType:
#         return await a_models.AnalysisInterim.get(uid=uid)
#
#     async def analysis_correction_factor_all(
#         self, info
#     ) -> List[a_types.AnalysisCorrectionFactorType]:
#         return await a_models.AnalysisCorrectionFactor.all()
#
#     async def analysis_correction_factor_by_uid(
#         self, info, uid: str
#     ) -> a_types.AnalysisCorrectionFactorType:
#         return await a_models.AnalysisCorrectionFactor.get(uid=uid)
#
#     async def analysis_uncertainty_all(
#         self, info
#     ) -> List[a_types.AnalysisUncertaintyType]:
#         return await a_models.AnalysisUncertainty.all()
#
#     async def analysis_uncertainty_by_uid(
#         self, info, uid: str
#     ) -> a_types.AnalysisUncertaintyType:
#         return await a_models.AnalysisUncertainty.get(uid=uid)
#
#     async def analysis_detection_limit_all(
#         self, info
#     ) -> List[a_types.AnalysisDetectionLimitType]:
#         return await a_models.AnalysisDetectionLimit.all()
#
#     async def analysis_detection_limit_by_uid(
#         self, info, uid: str
#     ) -> a_types.AnalysisDetectionLimitType:
#         return await a_models.AnalysisUncertainty.get(uid=uid)
#
#     async def analysis_specification_all(
#         self, info
#     ) -> List[a_types.AnalysisSpecificationType]:
#         return await a_models.AnalysisSpecification.all()
#
#     async def analysis_specification_uid(
#         self, info, uid: str
#     ) -> a_types.AnalysisSpecificationType:
#         return await a_models.AnalysisSpecification.get(uid=uid)
#
#     async def qc_set_all(
#         self,
#         info,
#         page_size: int | None = None,
#         after_cursor: str | None = None,
#         before_cursor: str | None = None,
#         text: str | None = None,
#         sort_by: list[str] | None = None,
#     ) -> r_types.QCSetCursorPage:
#
#         filters = []
#
#         _or_text_ = {}
#         if has_value_or_is_truthy(text):
#             arg_list = ["name__ilike", "description__ilike", "keyword__ilike"]
#             for _arg in arg_list:
#                 _or_text_[_arg] = f"%{text}%"
#
#             text_filters = {sa.or_: _or_text_}
#             filters.append(text_filters)
#
#         # filters.append({'internal_use__ne': True})
#
#         page = await a_models.QCSet.paginate_with_cursors(
#             page_size=page_size,
#             after_cursor=after_cursor,
#             before_cursor=before_cursor,
#             filters=filters,
#             sort_by=sort_by,
#         )
#
#         total_count: int = page.total_count
#         edges: List[r_types.QCSetEdge[r_types.QCSetWithSamples]] = page.edges
#         items: List[r_types.QCSetWithSamples] = page.items
#         page_info: PageInfo = page.page_info
#
#         return r_types.QCSetCursorPage(
#             total_count=total_count, edges=edges, items=items, page_info=page_info
#         )
