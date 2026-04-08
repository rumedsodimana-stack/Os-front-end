#!/usr/bin/env python3
"""Fix Engineering.tsx: replace multiline StatCard grids (with icon={<JSX/>} props) → KpiStrip."""
import re

path = "/Users/rumedsodimana/Desktop/singularity-app/src/pages/Engineering.tsx"
with open(path) as f:
    content = f.read()

COLOR_MAP = {
    "indigo": "bg-indigo-500", "emerald": "bg-emerald-500", "amber": "bg-amber-500",
    "rose": "bg-rose-500", "red": "bg-red-500", "blue": "bg-blue-500",
    "violet": "bg-violet-500", "slate": "bg-slate-500", "orange": "bg-orange-500",
    "teal": "bg-violet-500", "gray": "bg-slate-500",
}

def dot_color(gradient_str):
    m = re.search(r'from-(\w+)-\d+', gradient_str)
    return COLOR_MAP.get(m.group(1), "bg-slate-500") if m else "bg-slate-500"

# Strategy: find StatCard elements where closing /> is on its own line
# Pattern: <StatCard\n[props\n...]\n        />
# The icon prop's /> is NOT on its own line, so we match \n\s+/> as the terminator

stat_card_pattern = re.compile(
    r'<StatCard\n((?:[ \t]+[^\n]+\n)+?)[ \t]+/>',
    re.MULTILINE
)

def parse_eng_card(props_block):
    label_m = re.search(r'(?:label|title)="([^"]+)"', props_block)
    val_m   = re.search(r'value=\{([^}]+)\}', props_block)
    grad_m  = re.search(r'gradient="([^"]+)"', props_block)
    if not (label_m and val_m and grad_m):
        return None
    label = label_m.group(1)
    value = val_m.group(1).strip()
    color = dot_color(grad_m.group(1))
    return f'{{color:"{color}",value:{value},label:"{label}"}}'

# Find grid divs wrapping only StatCards (via multi-line stat_card pattern)
# We'll replace each grid block containing only StatCards

# Step 1: find all StatCard elements and their positions
cards_in_content = []
for m in stat_card_pattern.finditer(content):
    item = parse_eng_card(m.group(1))
    cards_in_content.append((m.start(), m.end(), item))

if not cards_in_content:
    print("No multiline StatCards found")
    exit()

print(f"Found {len(cards_in_content)} multiline StatCard elements")

# Step 2: Now find the grid div wrappers
# Use a different approach: find grid divs, then check if their content is only StatCards

grid_pattern = re.compile(
    r'(<div className="grid[^"]*gap-\d+[^"]*">\n)'
    r'((?:(?:[ \t]+<StatCard\n(?:[ \t]+[^\n]+\n)+?[ \t]+/>\n)+))'
    r'([ \t]+</div>)',
    re.MULTILINE
)

def replace_eng_grid(m):
    grid_content = m.group(2)
    # Parse each StatCard in this block
    items = []
    for cm in stat_card_pattern.finditer(grid_content):
        item = parse_eng_card(cm.group(1))
        if item:
            items.append(item)
    if not items:
        return m.group(0)
    # Find the indentation of the grid div
    indent = re.match(r'[ \t]*', m.group(0).split('\n')[0])
    ind = indent.group(0) if indent else "      "
    # Actually derive from surrounding context - use the indent of </div>
    close_indent = re.match(r'([ \t]+)</div>', m.group(3))
    ind = close_indent.group(1) if close_indent else "      "
    return f'{ind}<KpiStrip items={{[{",".join(items)}]}} />\n'

new_content = grid_pattern.sub(replace_eng_grid, content)
grids_replaced = content.count('<StatCard') - new_content.count('<StatCard')
print(f"StatCards removed: {grids_replaced}")

with open(path, "w") as f:
    f.write(new_content)
print("DONE Engineering.tsx")
