#!/usr/bin/env python3
"""
Final pass: convert all remaining StatCard grids → KpiStrip,
strip dark: classes, fix teal/gray violations.
"""
import re, os

BASE = "/Users/rumedsodimana/Desktop/singularity-app/src/pages"

COLOR_MAP = {
    "indigo": "bg-indigo-500", "emerald": "bg-emerald-500", "amber": "bg-amber-500",
    "rose": "bg-rose-500", "red": "bg-red-500", "blue": "bg-blue-500",
    "violet": "bg-violet-500", "slate": "bg-slate-500", "orange": "bg-orange-500",
    "pink": "bg-pink-500", "purple": "bg-purple-500", "sky": "bg-sky-500",
    "green": "bg-green-500", "gray": "bg-slate-500", "teal": "bg-violet-500",
}

def dot_color(gradient_str):
    m = re.search(r'from-(\w+)-\d+', gradient_str)
    return COLOR_MAP.get(m.group(1), "bg-slate-500") if m else "bg-slate-500"

def replace_statcard_grids(content):
    """
    Finds:
      <div className="grid ...">
        <StatCard ... title/label="X" value={Y} ... gradient="...from-Z..." />
        ...
      </div>
    Replaces with: <KpiStrip items={[...]} />
    Handles both single-line and multi-line StatCard elements.
    """
    # Match a grid div wrapping only StatCard elements
    pattern = re.compile(
        r'(<div className="grid[^"]*gap-\d+[^"]*">\s*)'
        r'((?:<StatCard\b[\s\S]*?/>\s*)+)'
        r'(</div>)',
        re.DOTALL
    )

    def parse_one_card(card_str):
        # Get title or label
        name_m = re.search(r'(?:title|label)="([^"]+)"', card_str)
        if not name_m:
            return None
        label = name_m.group(1)

        # Get value — handles {expr}, "string", template literals
        val_m = re.search(r'\bvalue=(?:\{(`[^`]+`|[^}]+)\}|"([^"]+)")', card_str)
        if not val_m:
            return None
        if val_m.group(1):
            value = val_m.group(1).strip()
        else:
            value = f'"{val_m.group(2)}"'

        # Get gradient
        grad_m = re.search(r'gradient="([^"]+)"', card_str)
        if not grad_m:
            return None
        color = dot_color(grad_m.group(1))

        return f'{{color:"{color}",value:{value},label:"{label}"}}'

    def replace_grid(m):
        cards_str = m.group(2)
        # Split into individual StatCard elements
        cards = re.findall(r'<StatCard\b[\s\S]*?/>', cards_str)
        items = [parse_one_card(c) for c in cards]
        items = [i for i in items if i]
        if not items:
            return m.group(0)  # leave unchanged
        return f'<KpiStrip items={{[{",".join(items)}]}} />'

    return pattern.sub(replace_grid, content)

def strip_dark_classes(content):
    """Remove all dark: Tailwind utilities."""
    return re.sub(r'\s+dark:[^\s"\'>\)]+', '', content)

def fix_teal(content):
    """Replace teal-xxx with violet equivalents."""
    content = re.sub(r'from-teal-\d+', 'from-violet-500', content)
    content = re.sub(r'to-teal-\d+', 'to-violet-600', content)
    content = re.sub(r'bg-teal-(\d+)', lambda m: 'bg-violet-100' if int(m.group(1)) <= 200 else 'bg-violet-500', content)
    content = re.sub(r'text-teal-\d+', 'text-violet-600', content)
    content = re.sub(r'border-teal-\d+', 'border-violet-200', content)
    return content

def fix_gray(content):
    """Replace gray-xxx with slate or semantic tokens."""
    # In gradient contexts: gray → slate
    content = re.sub(r'from-gray-(\d+)', lambda m: f'from-slate-{m.group(1)}', content)
    content = re.sub(r'to-gray-(\d+)',   lambda m: f'to-slate-{m.group(1)}', content)
    # bg-gray-NNN
    content = re.sub(r'bg-gray-(50|100)', 'bg-muted', content)
    content = re.sub(r'bg-gray-(200|300)', 'bg-secondary', content)
    content = re.sub(r'bg-gray-(\d+)', lambda m: 'bg-muted' if int(m.group(1)) < 500 else 'bg-muted-foreground', content)
    # text-gray-NNN
    content = re.sub(r'text-gray-(400|500|600)', 'text-muted-foreground', content)
    content = re.sub(r'text-gray-(700|800|900)', 'text-foreground', content)
    content = re.sub(r'text-gray-(50|100|200|300)', 'text-muted-foreground', content)
    # border-gray-NNN
    content = re.sub(r'border-gray-\d+', 'border-border', content)
    # divide-gray-NNN
    content = re.sub(r'divide-gray-\d+', 'divide-border', content)
    # ring-gray-NNN
    content = re.sub(r'ring-gray-\d+', 'ring-border', content)
    return content

# ── Target files ──────────────────────────────────────────────────────────────
TARGETS = {
    "HumanResources.tsx": ["statcard", "dark", "teal", "gray"],
    "Housekeeping.tsx":   ["statcard", "dark", "teal", "gray"],
    "Engineering.tsx":    ["statcard", "dark", "teal", "gray"],
    "Events.tsx":         ["dark", "teal", "gray"],
    "Executive.tsx":      ["dark", "teal", "gray"],
    "Team.tsx":           ["dark", "teal", "gray"],
    "CRM.tsx":            ["dark", "gray"],
    "Comms.tsx":          ["dark", "gray"],
    "Finance.tsx":        ["dark", "gray"],
    "FoodAndBeverage.tsx":["dark", "gray"],
    "MultiProperty.tsx":  ["dark", "gray"],
    "Portfolio.tsx":      ["dark", "gray"],
    "Procurement.tsx":    ["dark", "gray"],
    "SalesRevenue.tsx":   ["dark", "gray"],
    "Security.tsx":       ["dark", "teal", "gray"],
    "Guests.tsx":         ["dark", "gray"],
    "Insights.tsx":       ["dark", "gray"],
    "Settings.tsx":       ["dark", "gray"],
    "FrontDesk.tsx":      ["dark", "gray"],
}

changed = []
for fname, ops in TARGETS.items():
    path = os.path.join(BASE, fname)
    if not os.path.exists(path):
        continue
    with open(path) as f:
        original = f.read()
    content = original
    if "statcard" in ops:
        content = replace_statcard_grids(content)
    if "dark" in ops:
        content = strip_dark_classes(content)
    if "teal" in ops:
        content = fix_teal(content)
    if "gray" in ops:
        content = fix_gray(content)
    if content != original:
        with open(path, "w") as f:
            f.write(content)
        print(f"  DONE  {fname}")
        changed.append(fname)
    else:
        print(f"  --    {fname}")

print(f"\nUpdated {len(changed)} files")
