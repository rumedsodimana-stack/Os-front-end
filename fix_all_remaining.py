#!/usr/bin/env python3
"""
Final sweep — fix every remaining old-style element across all pages.
"""
import re, os

BASE = "/Users/rumedsodimana/Desktop/singularity-app/src"
PAGES = BASE + "/pages"
SHARED_IMPORT = 'import { KpiStrip, LegendBar, SectionSearch, SectionHeader } from "../components/shared";'

COLOR_MAP = {
    "emerald": "bg-emerald-500", "blue": "bg-blue-500", "violet": "bg-violet-500",
    "amber": "bg-amber-500", "red": "bg-red-500", "rose": "bg-rose-500",
    "indigo": "bg-indigo-500", "purple": "bg-purple-500", "pink": "bg-pink-500",
    "orange": "bg-orange-500", "slate": "bg-slate-500", "green": "bg-green-500",
    "sky": "bg-sky-500", "yellow": "bg-yellow-500", "teal": "bg-violet-500",
}

def gradient_to_dot(gradient_str):
    m = re.search(r'from-(\w+)-\d+', gradient_str)
    if m:
        return COLOR_MAP.get(m.group(1), f"bg-{m.group(1)}-500")
    return "bg-slate-500"

def ensure_shared_import(content):
    if 'from "../components/shared"' in content:
        return content
    # Find end of last complete import statement
    last_end = 0
    for m in re.finditer(
        r'(?:import\s+(?:\{[^}]+\}|\w+)\s+from\s+"[^"]+";|import\s+"[^"]+";\n)',
        content, re.DOTALL
    ):
        last_end = m.end()
    if last_end > 0:
        return content[:last_end] + SHARED_IMPORT + "\n" + content[last_end:]
    return content

def replace_h2_headers(content):
    """Replace <h2 className="...font-bold...">TITLE</h2> with <SectionHeader title="TITLE" />"""
    # One-liner h2 with font-bold
    content = re.sub(
        r'<h2\s+className="[^"]*font-bold[^"]*"[^>]*>([^<]+)</h2>',
        lambda m: f'<SectionHeader title="{m.group(1).strip()}" />',
        content
    )
    # h2 with dynamic title expression {expr}
    content = re.sub(
        r'<h2\s+className="[^"]*font-bold[^"]*"[^>]*>\{([^}]+)\}</h2>',
        lambda m: f'<SectionHeader title={{{m.group(1).strip()}}} />',
        content
    )
    # h1 with font-bold (standalone section titles)
    content = re.sub(
        r'<h1\s+className="[^"]*font-bold[^"]*"[^>]*>([^<]+)</h1>',
        lambda m: f'<SectionHeader title="{m.group(1).strip()}" />',
        content
    )
    # h1 with dynamic expression
    content = re.sub(
        r'<h1\s+className="[^"]*font-bold[^"]*"[^>]*>\{([^}]+)\}</h1>',
        lambda m: f'<SectionHeader title={{{m.group(1).strip()}}} />',
        content
    )
    return content

def replace_kpi_grids(content):
    """Replace gradient StatCard grids with KpiStrip."""
    pattern = re.compile(
        r'<div className="grid[^"]+gap-\d+[^"]*">\s*'
        r'\{\s*\[([^\]]*)\]\s*\.map\([^)]*\s*=>\s*\(\s*'
        r'<div[^>]*className=\{[^}]*gradient-to-[^}]*\}[^>]*>.*?'
        r'</div>\s*\)\s*\)\s*\}\s*</div>',
        re.DOTALL
    )

    def _build(items_str):
        items = []
        for m in re.finditer(
            r'\{[^{}]*label:\s*"([^"]+)"[^{}]*value:\s*([^,}]+)[^{}]*(?:color|gradient):\s*"([^"]+)"[^{}]*\}',
            items_str, re.DOTALL
        ):
            label, value, grad = m.group(1), m.group(2).strip(), m.group(3)
            items.append(f'{{color:"{gradient_to_dot(grad)}",value:{value},label:"{label}"}}')
        if not items:
            return None
        return '<KpiStrip items={[' + ','.join(items) + ']} />'

    def _replace(m):
        result = _build(m.group(1))
        return result if result else m.group(0)

    return pattern.sub(_replace, content)

def fix_teal_violations(content):
    """Replace teal colors with violet (design system: no teal)."""
    content = re.sub(r'from-teal-\d+', 'from-violet-500', content)
    content = re.sub(r'to-teal-\d+', 'to-violet-600', content)
    content = re.sub(r'bg-teal-\d+', lambda m: 'bg-violet-500' if '500' in m.group() or '400' in m.group() else 'bg-violet-100', content)
    content = re.sub(r'text-teal-\d+', 'text-violet-600', content)
    content = re.sub(r'border-teal-\d+', 'border-violet-200', content)
    return content

# ── Process files ─────────────────────────────────────────────────────────────

targets = {
    "HumanResources.tsx": ["import", "h2", "kpi", "teal"],
    "Team.tsx":           ["h2"],
    "SalesRevenue.tsx":   ["h2"],
    "FrontDesk.tsx":      ["h2"],
    "Housekeeping.tsx":   ["h2", "teal"],
    "Settings.tsx":       ["import", "h2"],
}

changed = []
for fname, ops in targets.items():
    path = os.path.join(PAGES, fname)
    if not os.path.exists(path):
        print(f"  SKIP  {fname}")
        continue
    with open(path) as f:
        original = f.read()
    content = original
    if "import" in ops:
        content = ensure_shared_import(content)
    if "h2" in ops:
        content = replace_h2_headers(content)
    if "kpi" in ops:
        content = replace_kpi_grids(content)
    if "teal" in ops:
        content = fix_teal_violations(content)
    if content != original:
        with open(path, "w") as f:
            f.write(content)
        print(f"  DONE  {fname}")
        changed.append(fname)
    else:
        print(f"  UNCHANGED  {fname}")

print(f"\nDone: {len(changed)} files updated")
