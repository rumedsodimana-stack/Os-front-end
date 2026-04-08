#!/usr/bin/env python3
"""
Fix Engineering.tsx:
1. Fix malformed KpiStrip lines (broken template literals)
2. Convert remaining StatCard grids (string values not caught before)
"""
import re

path = "/Users/rumedsodimana/Desktop/singularity-app/src/pages/Engineering.tsx"
with open(path) as f:
    content = f.read()

# ── Fix 1: Malformed template literal values ──────────────────────────────────
# Pattern: value:`$${(expr).toFixed(0),label:"X" -- missing }k` closing
# Fix line 1761 (assets)
content = content.replace(
    '{color:"bg-emerald-500",value:`$${(totalCapex / 1000).toFixed(0),label:"Total CAPEX Value"}',
    '{color:"bg-emerald-500",value:`$${(totalCapex / 1000).toFixed(0)}k`,label:"Total CAPEX Value"}'
)
# Fix line 2058 (capex/budget) — three broken items
content = content.replace(
    '{color:"bg-emerald-500",value:`$${(approved / 1000).toFixed(0),label:"Total Approved Budget"}',
    '{color:"bg-emerald-500",value:`$${(approved / 1000).toFixed(0)}k`,label:"Total Approved Budget"}'
)
content = content.replace(
    '{color:"bg-blue-500",value:`$${(inProgress / 1000).toFixed(0),label:"Spent / In Progress"}',
    '{color:"bg-blue-500",value:`$${(inProgress / 1000).toFixed(0)}k`,label:"Spent / In Progress"}'
)
content = content.replace(
    '{color:"bg-amber-500",value:`$${(pending / 1000).toFixed(0),label:"Pending Approval"}',
    '{color:"bg-amber-500",value:`$${(pending / 1000).toFixed(0)}k`,label:"Pending Approval"}'
)

# ── Fix 2: StatCard grids with string values (value="...") ────────────────────
COLOR_MAP = {
    "indigo": "bg-indigo-500", "emerald": "bg-emerald-500", "amber": "bg-amber-500",
    "rose": "bg-rose-500", "red": "bg-red-500", "blue": "bg-blue-500",
    "violet": "bg-violet-500", "slate": "bg-slate-500", "orange": "bg-orange-500",
    "teal": "bg-violet-500", "gray": "bg-slate-500", "cyan": "bg-blue-500",
}

def dot_color(gradient_str):
    m = re.search(r'from-(\w+)-\d+', gradient_str)
    return COLOR_MAP.get(m.group(1), "bg-slate-500") if m else "bg-slate-500"

stat_card_pattern = re.compile(
    r'<StatCard\n((?:[ \t]+[^\n]+\n)+?)[ \t]+/>',
    re.MULTILINE
)

def parse_card(props_block):
    label_m = re.search(r'(?:label|title)="([^"]+)"', props_block)
    # value can be {expr} or "string"
    val_m = re.search(r'value=(?:\{([^}]+)\}|"([^"]+)")', props_block)
    grad_m = re.search(r'gradient="([^"]+)"', props_block)
    if not (label_m and val_m and grad_m):
        return None
    label = label_m.group(1)
    value = val_m.group(1).strip() if val_m.group(1) else f'"{val_m.group(2)}"'
    color = dot_color(grad_m.group(1))
    return f'{{color:"{color}",value:{value},label:"{label}"}}'

grid_pattern = re.compile(
    r'(<div className="grid[^"]*gap-\d+[^"]*">\n)'
    r'((?:(?:[ \t]+<StatCard\n(?:[ \t]+[^\n]+\n)+?[ \t]+/>\n)+))'
    r'([ \t]+</div>)',
    re.MULTILINE
)

def replace_grid(m):
    grid_content = m.group(2)
    items = []
    for cm in stat_card_pattern.finditer(grid_content):
        item = parse_card(cm.group(1))
        if item:
            items.append(item)
    if not items:
        return m.group(0)
    close_m = re.match(r'([ \t]+)</div>', m.group(3))
    ind = close_m.group(1) if close_m else "      "
    return f'{ind}<KpiStrip items={{[{",".join(items)}]}} />\n'

new_content = grid_pattern.sub(replace_grid, content)
remaining = new_content.count('<StatCard')
print(f"StatCards remaining: {remaining}")

with open(path, "w") as f:
    f.write(new_content)
print("DONE Engineering.tsx")
