const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const doneFiles = ['FrontDesk.tsx', 'Housekeeping.tsx', 'SalesAndRevenue.tsx', 'FoodAndBeverage.tsx', 'Readme.tsx', 'Configuration.tsx'];

for (const file of files) {
  if (doneFiles.includes(file)) continue;

  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if Settings is already added
  if (content.includes('case "Settings":')) continue;

  // Extract module name from file name (e.g., HumanResources.tsx -> HumanResources)
  const moduleName = file.replace('.tsx', '');
  const settingsComponentName = `${moduleName}Settings`;

  // Add the case to the switch statement
  // We look for `default:` and insert the case right before it
  content = content.replace(
    /(\s+)default:/,
    `$1case "Settings":\n$1  return <${settingsComponentName} />;\n$1default:`
  );

  // Add the Settings component before GenericView
  const settingsComponentCode = `
function ${settingsComponentName}() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">${moduleName.replace(/([A-Z])/g, ' $1').trim()} Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for ${moduleName} will be available here.</p>
          </div>
        </div>
        <div className="p-6 border-t border-border bg-secondary/30 flex justify-end">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

`;

  // Find where GenericView is defined and insert before it
  if (content.includes('function GenericView')) {
    content = content.replace('function GenericView', settingsComponentCode + 'function GenericView');
  } else {
    // If GenericView is not in the file, just append to the end
    content += '\n' + settingsComponentCode;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
