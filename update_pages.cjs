const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Concierge.tsx',
  'src/pages/Connect.tsx',
  'src/pages/Engineering.tsx',
  'src/pages/EventsAndBanquets.tsx',
  'src/pages/Executive.tsx',
  'src/pages/FinanceAndAccounting.tsx',
  'src/pages/FoodAndBeverage.tsx',
  'src/pages/FrontDesk.tsx',
  'src/pages/GuestRelations.tsx',
  'src/pages/Housekeeping.tsx',
  'src/pages/MarketingAndPR.tsx',
  'src/pages/Purchasing.tsx',
  'src/pages/SalesAndRevenue.tsx',
  'src/pages/SpaAndWellness.tsx'
];

const genericViewCode = `
function GenericView({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">{title}</h3>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>No {title.toLowerCase()} records found.</p>
        </div>
      </div>
    </div>
  );
}
`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the default block
  const defaultBlockRegex = /default:\s*return \(\s*<div className="flex flex-col items-center justify-center h-\[60vh\] text-center">[\s\S]*?<\/div>\s*\);/g;
  content = content.replace(defaultBlockRegex, 'default:\n        return <GenericView title={activeSubmenu} />;');

  // Add GenericView if it doesn't exist
  if (!content.includes('function GenericView')) {
    content += '\n' + genericViewCode;
  }

  // Add Plus to lucide-react imports if it doesn't exist
  const lucideImportRegex = /import\s+{([^}]+)}\s+from\s+["']lucide-react["'];/;
  const match = content.match(lucideImportRegex);
  if (match) {
    const imports = match[1];
    if (!imports.includes('Plus')) {
      const newImports = imports + ', Plus';
      content = content.replace(lucideImportRegex, `import {${newImports}} from "lucide-react";`);
    }
  } else {
    // If no lucide-react import, add it
    const importStatement = `import { Plus } from "lucide-react";\n`;
    content = importStatement + content;
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
