#!/usr/bin/env python3
"""
Refactor all department pages to use shared components:
  - KpiStrip  (replaces gradient StatCard grids)
  - LegendBar  (replaces inline legend bars)
  - SectionSearch  (replaces raw <input> search fields)
  - SectionHeader  (replaces h1/h2 bold section titles)

Run from the project root:  python3 refactor_shared.py
"""
import re, os

SRC = os.path.join(os.path.dirname(__file__), "src", "pages")
SHARED_IMPORT = 'import { KpiStrip, LegendBar, SectionSearch, SectionHeader } from "../components/shared";'

COLOR_MAP = {
    "emerald": "bg-emerald-500", "blue": "bg-blue-500", "violet": "bg-violet-500",
    "amber": "bg-amber-500",     "red": "bg-red-500",   "rose": "bg-rose-500",
    "indigo": "bg-indigo-500",   "purple": "bg-purple-500", "pink": "bg-pink-500",
    "orange": "bg-orange-500",   "slate": "bg-slate-500", "green": "bg-green-500",
    "teal": "bg-teal-500",       "sky": "bg-sky-500",   "yellow": "bg-yellow-500",
}

def gradient_to_dot(gradient_str):
    m = re.search(r'from-(\w+)-\d+', gradient_str)
    if m:
        return COLOR_MAP.get(m.group(1), f"bg-{m.group(1)}-500")
    return "bg-slate-500"


def add_shared_import(content, filename):
    """Inject shared import after the last existing import line."""
    if "from \"../components/shared\"" in content:
        return content  # already present
    # Find insertion point: last import line
    lines = content.split("\n")
    last_import = -1
    for i, line in enumerate(lines):
        if line.startswith("import ") or line.startswith("import{"):
            last_import = i
    if last_import >= 0:
        lines.insert(last_import + 1, SHARED_IMPORT)
        return "\n".join(lines)
    return content


def replace_section_headers(content):
    """
    Replace <h1 className="text-2xl font-bold ...">TITLE</h1>
    and     <h2 className="text-xl/2xl font-bold ...">TITLE</h2>
    with    <SectionHeader title="TITLE" />

    Keeps surrounding context intact. Does NOT touch h3 or smaller headers.
    """
    # Simple one-line h1/h2 replacements
    content = re.sub(
        r'<h[12]\s+className="[^"]*font-bold[^"]*text-foreground[^"]*">([^<]+)</h[12]>',
        lambda m: f'<SectionHeader title="{m.group(1).strip()}" />',
        content
    )
    # Also handle h2 with just font-semibold
    content = re.sub(
        r'<h2\s+className="[^"]*font-semibold[^"]*text-foreground[^"]*">([^<]+)</h2>',
        lambda m: f'<SectionHeader title="{m.group(1).strip()}" />',
        content
    )
    return content


def replace_search_inputs(content):
    """
    Replace raw search <input ... placeholder="..." className="w-full pl-9 ...">
    with <SectionSearch value={X} onChange={setX} placeholder="..." />
    """
    # Pattern: <input value={X} onChange={e => setX(e.target.value)} placeholder="Y" className="w-full pl-9..."/>
    def _replace(m):
        full = m.group(0)
        val_m = re.search(r'value=\{([^}]+)\}', full)
        ph_m = re.search(r'placeholder="([^"]+)"', full)
        chg_m = re.search(r'onChange=\{e => set(\w+)\(e\.target\.value\)\}', full)
        if not (val_m and ph_m and chg_m):
            return full  # leave unchanged if we can't parse
        val = val_m.group(1)
        ph = ph_m.group(1)
        setter = f"set{chg_m.group(1)}"
        return f'<SectionSearch value={{{val}}} onChange={{{setter}}} placeholder="{ph}" />'

    content = re.sub(
        r'<input[^>]*placeholder="[^"]+"[^>]*className="w-full pl-9[^"]*"[^/]*/?>',
        _replace,
        content,
        flags=re.DOTALL
    )
    return content


def replace_kpi_grid_blocks(content):
    """
    Replace patterns like:
        <div className="grid grid-cols-... gap-...">
          {[
            { label: "X", value: Y, icon: Z, color/gradient: "from-X-400 to-X-500", sub?: "..." },
            ...
          ].map(c => (
            <div ... className={`bg-gradient-to-r ${c.color/c.gradient} rounded-2xl ...`}>
              ...
            </div>
          ))}
        </div>

    with:
        <KpiStrip items={[{color:"bg-X-500",value:Y,label:"X"}, ...]} />
    """
    # We look for the array literal that comes right after the grid div opening
    # Pattern: grid opening tag → inline array → .map → gradient div
    pattern = re.compile(
        r'<div className="grid[^"]+gap-\d+[^"]*">\s*'
        r'\{\s*\[([^\]]*)\]\s*\.map\([^)]*\s*=>\s*\(\s*'
        r'<div[^>]*className=\{[^}]*gradient-to-[^}]*\}[^>]*>.*?'
        r'</div>\s*\)\s*\)\s*\}\s*</div>',
        re.DOTALL
    )

    def _build_kpi_strip(items_str):
        # Parse each item object {label:"X", value:Y, color:"from-X-400..."} 
        items = []
        for item_m in re.finditer(
            r'\{[^{}]*label:\s*"([^"]+)"[^{}]*value:\s*([^,}]+)[^{}]*(?:color|gradient):\s*"([^"]+)"[^{}]*\}',
            items_str, re.DOTALL
        ):
            label = item_m.group(1)
            value = item_m.group(2).strip()
            grad  = item_m.group(3)
            dot_color = gradient_to_dot(grad)
            items.append(f'{{color:"{dot_color}",value:{value},label:"{label}"}}')
        if not items:
            return None
        return '<KpiStrip items={[' + ','.join(items) + ']} />'

    def _replace_block(m):
        items_str = m.group(1)
        result = _build_kpi_strip(items_str)
        return result if result else m.group(0)

    content = pattern.sub(_replace_block, content)
    return content


FILES = [
    "Finance.tsx",
    "Security.tsx",
    "Events.tsx",
    "Procurement.tsx",
    "Comms.tsx",
    "FoodAndBeverage.tsx",
    "Guests.tsx",
    "Engineering.tsx",
    "CRM.tsx",
    "Executive.tsx",
    "Insights.tsx",
    "Portfolio.tsx",
    "MultiProperty.tsx",
]

changed = []
skipped = []

for fname in FILES:
    path = os.path.join(SRC, fname)
    if not os.path.exists(path):
        print(f"  SKIP  {fname} — file not found")
        skipped.append(fname)
        continue

    with open(path, "r", encoding="utf-8") as f:
        original = f.read()

    content = original
    content = add_shared_import(content, fname)
    content = replace_section_headers(content)
    content = replace_search_inputs(content)
    content = replace_kpi_grid_blocks(content)

    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  DONE  {fname}")
        changed.append(fname)
    else:
        print(f"  UNCHANGED  {fname}")

print(f"\nSummary: {len(changed)} changed, {len(skipped)} skipped")
