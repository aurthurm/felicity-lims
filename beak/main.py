# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2024-2026 Beak Insights and Contributors
#
# SPDX-License-Identifier: MPL-2.0

from beak.lims import factory

description = """
Beak LIMS API helps you do awesome stuff. 🚀

You will be able to:
...
"""

app_configs = {"title": "Beak LIMS", "description": description}

beak = factory(app_configs)
