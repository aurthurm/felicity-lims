from felicity.apps.abstract.events import init_entity_tracker_events
from felicity.apps.user.events import init_user_events


def observe_events():
    init_user_events()
    init_entity_tracker_events()
