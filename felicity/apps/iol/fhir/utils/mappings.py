# #
# def map_bundle_resource_to_shipment(shipment_uid: int) -> BundleResource | None:
#     shipment: Shipment = await Shipment.get(uid=shipment_uid)
#     shipped_samples: ShippedSample = await ShippedSample.get_all(shipment_uid=shipment.uid)
#     samples: list[Sample] = list(map(lambda ss: ss.sample, shipped_samples))

#     async def get_service_entry(sample: Sample):
#         _, analytes = await sample.get_referred_analyses()
#         tests_meta = [{"system": "felicity/analysis", "code": analyte.analysis.keyword, "display": analyte.analysis.name} for analyte in analytes]
#         return {
#             "resource": ServiceRequestResource(**{
#                 "resourceType": "ServiceRequest",
#                 "code": {
#                     "coding": tests_meta
#                 }
#             }),
#             "request": {
#                 "method": "POST",
#                 "url": "ServiceRequest"
#             }
#         }

#     service_entries = await asyncio.gather(*(get_service_entry(sample) for sample in samples))

#     bundle_vars = {
#         "resourceType": "Bundle",
#         "identifier": Identifier(**{
#             "use": "official",
#             "system": "felicity/shipment/uid",
#             "value": shipment.shipment_id
#         }),
#         "type": "batch",
#         "timestamp": shipment.created_at,
#         "total": len(samples),
#         "entry": service_entries,
#         "extension": [
#             {
#                 "valueString": "shipment"
#             }
#         ]
#     }
#     return BundleResource(**bundle_vars)
