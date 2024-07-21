# async def submit_results(job_uid: str):
#     logger.info(f"starting job result submit {job_uid} ....")
#     job = await job_models.Job.get(uid=job_uid)
#     if not job:
#         return
#
#     if not job.status == job_states.PENDING:
#         return
#
#     await job.change_status(new_status=job_states.RUNNING)
#
#     user = await user_models.User.get(uid=job.creator_uid)
#
#     try:
#         await utils.results_submitter(job.data, user)
#         await job.change_status(new_status=job_states.FINISHED)
#         await report_notifier.notify(f"Your results were successfully submitted", user)
#     except Exception as e:
#         await job.change_status(new_status=job_states.FAILED)
#         await report_notifier.notify(
#             f"Failed to submit results in job with uid: {job.uid} with error: {str(e)}",
#             user,
#         )
#
#
# async def verify_results(job_uid: str):
#     logger.info(f"starting job result verification {job_uid} ....")
#     job = await job_models.Job.get(uid=job_uid)
#     if not job:
#         return
#
#     if not job.status == job_states.PENDING:
#         return
#
#     await job.change_status(new_status=job_states.RUNNING)
#
#     user = await user_models.User.get(uid=job.creator_uid)
#
#     try:
#         user = user
#         await utils.verify_from_result_uids(job.data, user)
#         await job.change_status(new_status=job_states.FINISHED)
#         await report_notifier.notify(f"Your results were successfully verified", user)
#     except Exception as e:
#         logger.debug(f"Exception ....... {e}")
#         await job.change_status(new_status=job_states.FAILED)
#         await report_notifier.notify(
#             f"Failed to verify results in job with uid: {job.uid} with error: {str(e)}",
#             user,
#         )
