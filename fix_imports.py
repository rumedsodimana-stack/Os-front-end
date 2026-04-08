#!/usr/bin/env python3
"""
Fix two issues from refactor_shared.py:
1. Shared import was injected mid-block (inside a multi-line lucide import)
2. CRM.tsx has a malformed KpiStrip
"""
import re, os

SRC = "/Users/rumedsodimana/Desktop/singularity-app/src/pages"
SHARED_IMPORT = 'import { KpiStrip, LegendBar, SectionSearch, SectionHeader } from "../components/shared";'

FILES = [
    "Finance.tsx", "Security.tsx", "Events.tsx", "Procurement.tsx",
    "Comms.tsx", "FoodAndBeverage.tsx", "Guests.tsx", "Engineering.tsx",
    "CRM.tsx", "Insights.tsx", "Portfolio.tsx", "MultiProperty.tsx",
]

def fix_import_injection(content):
    """
    If shared import was inserted mid-block, move it to after the last 'from "..."' import.
    Pattern to find: shared import on its own line inside a multi-line import block.
    """
    # Remove the misplaced import line wherever it appears NOT at the start of a line
    # (i.e. between "import {" and "  IconName,")
    misplaced = re.compile(
        r'^(import \{[^\n]*\n)(' + re.escape(SHARED_IMPORT) + r'\n)',
        re.MULTILINE
    )
    if misplaced.search(content):
        # Remove the misplaced line
        content = misplaced.sub(r'\1', content)
        # Now re-inject after the last complete import (line ending with from "...";)
        last_import_end = -1
        for m in re.finditer(r'^(?:import\s+\{[^}]+\}\s+from\s+"[^"]+";|import\s+[^{][^\n]+from\s+"[^"]+";|import\s+"[^"]+")', content, re.MULTILINE):
            last_import_end = m.end()
        if last_import_end >= 0:
            content = content[:last_import_end] + "\n" + SHARED_IMPORT + content[last_import_end:]
    return content

fixed = []
for fname in FILES:
    path = os.path.join(SRC, fname)
    if not os.path.exists(path):
        print(f"  SKIP {fname}")
        continue
    with open(path, "r") as f:
        original = f.read()
    content = fix_import_injection(original)
    if content != original:
        with open(path, "w") as f:
            f.write(content)
        print(f"  FIXED {fname}")
        fixed.append(fname)
    else:
        print(f"  OK    {fname}")

print(f"\nFixed: {len(fixed)}")
