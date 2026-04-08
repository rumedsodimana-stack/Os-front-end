#!/usr/bin/env python3
"""Fix HumanResources.tsx: replace StatCard/SectionCard grids with KpiStrip and remove dark: classes."""
import re

path = "/Users/rumedsodimana/Desktop/singularity-app/src/pages/HumanResources.tsx"
with open(path) as f:
    content = f.read()

# ── 1. Fix merged import line ─────────────────────────────────────────────────
content = content.replace(
    'import { motion, AnimatePresence } from "motion/react";import { KpiStrip, LegendBar, SectionSearch, SectionHeader } from "../components/shared";',
    'import { motion, AnimatePresence } from "motion/react";\nimport { KpiStrip, LegendBar, SectionSearch, SectionHeader } from "../components/shared";'
)

# ── 2. Replace StatCard grids → KpiStrip ──────────────────────────────────────
# Find <div className="grid..."><StatCard.../></div> blocks
stat_grid_pattern = re.compile(
    r'<div className="grid[^"]*gap-\d+[^"]*">\s*(?:<StatCard\s[^>]*/>\s*)+</div>',
    re.DOTALL
)

def parse_stat_cards(block):
    """Extract StatCard props and build KpiStrip items."""
    items = []
    for m in re.finditer(
        r'<StatCard\s+title="([^"]+)"\s+value=\{?([^}\n]+?)\}?\s+sub="[^"]*"\s+icon=\{[^}]+\}\s+gradient="[^"]*from-(\w+)-\d+[^"]*"\s*/>',
        block, re.DOTALL
    ):
        title, val, color = m.group(1), m.group(2).strip(), m.group(3)
        color_class = {
            "indigo": "bg-indigo-500", "emerald": "bg-emerald-500",
            "amber": "bg-amber-500", "rose": "bg-rose-500", "red": "bg-red-500",
            "blue": "bg-blue-500", "violet": "bg-violet-500", "slate": "bg-slate-500",
        }.get(color, f"bg-{color}-500")
        # Clean value: remove outer quotes if string literal
        if val.startswith('"') and val.endswith('"'):
            val = f'"{val[1:-1]}"'
        items.append(f'{{color:"{color_class}",value:{val},label:"{title}"}}')
    return items

def replace_stat_grid(m):
    block = m.group(0)
    items = parse_stat_cards(block)
    if not items:
        return block
    return '<KpiStrip items={[' + ','.join(items) + ']} />'

content = stat_grid_pattern.sub(replace_stat_grid, content)

# ── 3. Replace SectionCard mini-stat grids → KpiStrip ─────────────────────────
# Pattern at line ~859: 3x SectionCard with icon + label + bold value
old_attendance_strip = '''\
      <div className="grid grid-cols-3 gap-4">
        <SectionCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 dark:bg-emerald-900/40">
              <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Present Today</p>
              <p className="text-2xl font-bold text-foreground">{todayStats.present}</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-2.5 dark:bg-amber-900/40">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Late Today</p>
              <p className="text-2xl font-bold text-foreground">{todayStats.late}</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-2.5 dark:bg-red-900/40">
              <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Absent Today</p>
              <p className="text-2xl font-bold text-foreground">{todayStats.absent}</p>
            </div>
          </div>
        </SectionCard>
      </div>'''

new_attendance_strip = '      <KpiStrip items={[{color:"bg-emerald-500",value:todayStats.present,label:"Present Today"},{color:"bg-amber-500",value:todayStats.late,label:"Late Today"},{color:"bg-red-500",value:todayStats.absent,label:"Absent Today"}]} />'

if old_attendance_strip in content:
    content = content.replace(old_attendance_strip, new_attendance_strip)
    print("  Replaced attendance SectionCard strip")

# Pattern at line ~1243: 4x SectionCard leave overview
old_leave_strip = '''\
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SectionCard className="p-4">
          <p className="text-xs text-muted-foreground">Pending Requests</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
        </SectionCard>
        <SectionCard className="p-4">
          <p className="text-xs text-muted-foreground">Avg Annual Leave Days</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{annualAvgDays}d</p>
        </SectionCard>
        <SectionCard className="p-4">
          <p className="text-xs text-muted-foreground">Approved This Cycle</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{approvedCount}</p>
        </SectionCard>
        <SectionCard className="p-4">
          <p className="text-xs text-muted-foreground">Total Days Approved</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalDaysTaken}</p>
        </SectionCard>
      </div>'''

new_leave_strip = '      <KpiStrip items={[{color:"bg-amber-500",value:pendingCount,label:"Pending Requests"},{color:"bg-blue-500",value:annualAvgDays+"d",label:"Avg Annual Leave"},{color:"bg-emerald-500",value:approvedCount,label:"Approved This Cycle"},{color:"bg-violet-500",value:totalDaysTaken,label:"Total Days Approved"}]} />'

if old_leave_strip in content:
    content = content.replace(old_leave_strip, new_leave_strip)
    print("  Replaced leave SectionCard strip")

# ── 4. Remove dark: class violations ──────────────────────────────────────────
content = re.sub(r'\s+dark:[^\s"\']+', '', content)

# ── 5. Fix teal violations (if any remain) ────────────────────────────────────
content = re.sub(r'from-teal-\d+', 'from-violet-500', content)
content = re.sub(r'to-teal-\d+', 'to-violet-600', content)
content = re.sub(r'(?<!["\w])bg-teal-\d+', 'bg-violet-100', content)
content = re.sub(r'text-teal-\d+', 'text-violet-600', content)
content = re.sub(r'border-teal-\d+', 'border-violet-200', content)

with open(path, "w") as f:
    f.write(content)
print("DONE HumanResources.tsx")
