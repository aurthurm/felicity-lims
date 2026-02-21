from __future__ import annotations

from beak.modules.clinical.api.rest import fhir_v4
from beak.modules.core.api.rest import jobs, reports, setup
from beak.modules.platform.api.rest import platform
from beak.modules.contracts import GraphQLContrib, ModuleKind, ModuleManifest
from beak.modules.registry import ModuleRegistry


def build_default_registry() -> ModuleRegistry:
    registry = ModuleRegistry()
    registry.register(_core_manifest())
    registry.register(_clinical_manifest())
    registry.register(_pharma_manifest())
    registry.register(_environment_manifest())
    registry.register(_industrial_manifest())
    registry.register(_veterinary_manifest())
    registry.register(_food_safety_manifest())
    registry.register(_forensic_manifest())
    registry.register(_research_manifest())
    registry.register(_public_health_manifest())
    return registry


def _core_manifest() -> ModuleManifest:
    from beak.modules.core.api.gql.analysis.mutations import AnalysisMutations
    from beak.modules.core.api.gql.analysis.query import AnalysisQuery
    from beak.modules.core.api.gql.analysis.types import analysis_types
    from beak.modules.core.api.gql.analytics import analytics_types
    from beak.modules.core.api.gql.analytics.query import AnalyticsQuery
    from beak.modules.core.api.gql.audit import AuditLogQuery, audit_types
    from beak.modules.core.api.gql.billing import billing_types
    from beak.modules.core.api.gql.billing.mutations import BillingMutations
    from beak.modules.core.api.gql.billing.query import BillingQuery
    from beak.modules.core.api.gql.client import client_types
    from beak.modules.core.api.gql.client.mutations import ClientMutations
    from beak.modules.core.api.gql.client.query import ClientQuery
    from beak.modules.core.api.gql.commune import commune_types
    from beak.modules.core.api.gql.commune.mutations import CommuneMutations
    from beak.modules.core.api.gql.commune.query import CommuneQuery
    from beak.modules.core.api.gql.document import document_types
    from beak.modules.core.api.gql.document.mutations import DocumentMutations
    from beak.modules.core.api.gql.document.query import DocumentQuery
    from beak.modules.core.api.gql.grind import grind_types
    from beak.modules.core.api.gql.grind.mutation import GrindMutations
    from beak.modules.core.api.gql.grind.query import GrindQuery
    from beak.modules.core.api.gql.impress import impress_types
    from beak.modules.core.api.gql.impress.query import ReportImpressQuery
    from beak.modules.core.api.gql.instrument import instrument_types
    from beak.modules.core.api.gql.instrument.mutations import InstrumentMutations
    from beak.modules.core.api.gql.instrument.query import InstrumentQuery
    from beak.modules.core.api.gql.inventory import inventory_types
    from beak.modules.core.api.gql.inventory.mutations import InventoryMutations
    from beak.modules.core.api.gql.inventory.query import InventoryQuery
    from beak.modules.core.api.gql.messaging import messaging_types
    from beak.modules.core.api.gql.messaging.mutations import MessageMutations
    from beak.modules.core.api.gql.messaging.query import MessageQuery
    from beak.modules.core.api.gql.noticeboard import noticeboard_types
    from beak.modules.core.api.gql.noticeboard.mutations import NoticeMutations
    from beak.modules.core.api.gql.noticeboard.query import NoticeQuery
    from beak.modules.core.api.gql.notification import notification_types
    from beak.modules.core.api.gql.notification.query import StreamNotificationQuery
    from beak.modules.core.api.gql.notification.subscription import StreamSubscription
    from beak.modules.platform.api.gql import PlatformMutations
    from beak.modules.core.api.gql.reflex import reflex_types
    from beak.modules.core.api.gql.reflex.mutations import ReflexRuleMutations
    from beak.modules.core.api.gql.reflex.query import ReflexRuleQuery
    from beak.modules.core.api.gql.setup.mutations import SetupMutations
    from beak.modules.core.api.gql.setup.query import SetupQuery
    from beak.modules.core.api.gql.setup.types import setup_types
    from beak.modules.core.api.gql.shipment import shipment_types
    from beak.modules.core.api.gql.shipment.mutations import ShipmentMutations
    from beak.modules.core.api.gql.shipment.query import ShipmentQuery
    from beak.modules.core.api.gql.storage import storage_types
    from beak.modules.core.api.gql.storage.mutations import StorageMutations
    from beak.modules.core.api.gql.storage.query import StorageQuery
    from beak.modules.shared.api.gql.types import generic_types
    from beak.modules.core.api.gql.user import user_types
    from beak.modules.core.api.gql.user.mutations import UserMutations
    from beak.modules.core.api.gql.user.query import UserQuery
    from beak.modules.core.api.gql.worksheet import worksheet_types
    from beak.modules.core.api.gql.worksheet.mutations import WorkSheetMutations
    from beak.modules.core.api.gql.worksheet.query import WorkSheetQuery
    from beak.modules.core.abstract.events import init_entity_tracker_events
    from beak.modules.core.analysis.events import init_analysis_events
    from beak.modules.core.auditlog.events import init_auditlog_listener_events
    from beak.modules.core.identity.events import init_user_events

    def register_events() -> None:
        init_user_events()
        init_auditlog_listener_events()
        init_entity_tracker_events()
        init_analysis_events()

    gql = GraphQLContrib(
        types=tuple(
            generic_types
            + analysis_types
            + analytics_types
            + audit_types
            + client_types
            + impress_types
            + instrument_types
            + inventory_types
            + messaging_types
            + noticeboard_types
            + notification_types
            + reflex_types
            + setup_types
            + shipment_types
            + storage_types
            + user_types
            + worksheet_types
            + billing_types
            + grind_types
            + document_types
            + commune_types
        ),
        query_mixins=(
            SetupQuery,
            AuditLogQuery,
            UserQuery,
            ClientQuery,
            AnalysisQuery,
            WorkSheetQuery,
            MessageQuery,
            NoticeQuery,
            StreamNotificationQuery,
            AnalyticsQuery,
            ReflexRuleQuery,
            StorageQuery,
            InventoryQuery,
            ReportImpressQuery,
            InstrumentQuery,
            ShipmentQuery,
            BillingQuery,
            GrindQuery,
            DocumentQuery,
            CommuneQuery,
        ),
        mutation_mixins=(
            UserMutations,
            PlatformMutations,
            SetupMutations,
            ClientMutations,
            AnalysisMutations,
            WorkSheetMutations,
            MessageMutations,
            NoticeMutations,
            ReflexRuleMutations,
            StorageMutations,
            InventoryMutations,
            InstrumentMutations,
            ShipmentMutations,
            BillingMutations,
            GrindMutations,
            DocumentMutations,
            CommuneMutations,
        ),
        subscription_mixins=(StreamSubscription,),
    )

    return ModuleManifest(
        module_id="core",
        kind=ModuleKind.CORE,
        graphql=gql,
        rest_routers=(
            reports,
            setup,
            jobs,
            platform,
        ),
        register_events=register_events,
    )


def _clinical_manifest() -> ModuleManifest:
    from beak.modules.clinical.api.gql.iol import iol_types, IOLMutations
    from beak.modules.clinical.api.gql.multiplex.microbiology import microbiology_types
    from beak.modules.clinical.api.gql.multiplex.microbiology.mutations import (
        MicrobiologyMutations,
    )
    from beak.modules.clinical.api.gql.multiplex.microbiology.query import (
        MicrobiologyQuery,
    )
    from beak.modules.clinical.api.gql.patient import patient_types
    from beak.modules.clinical.api.gql.patient.mutations import PatientMutations
    from beak.modules.clinical.api.gql.patient.query import PatientQuery
    from beak.modules.clinical.patient.services import (
        register_clinical_analysis_request_provider,
    )

    gql = GraphQLContrib(
        types=tuple(patient_types + microbiology_types + iol_types),
        query_mixins=(PatientQuery, MicrobiologyQuery),
        mutation_mixins=(PatientMutations, MicrobiologyMutations, IOLMutations),
    )

    def register_events() -> None:
        register_clinical_analysis_request_provider()

    return ModuleManifest(
        module_id="clinical",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
        graphql=gql,
        rest_routers=(fhir_v4,),
        register_events=register_events,
    )


def _pharma_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="pharma",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )


def _environment_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="environment",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )


def _industrial_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="industrial",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )


def _veterinary_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="veterinary",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )


def _food_safety_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="food_safety",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )


def _forensic_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="forensic",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )


def _research_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="research",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )


def _public_health_manifest() -> ModuleManifest:
    return ModuleManifest(
        module_id="public_health",
        kind=ModuleKind.INDUSTRY,
        dependencies=("core",),
    )
