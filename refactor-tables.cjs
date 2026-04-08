const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Standardize <table>
  content = content.replace(/<table className="[^"]*">/g, '<table className="w-full text-sm text-left border-collapse">');
  
  // 2. Standardize <thead>
  content = content.replace(/<thead(?: className="[^"]*")?>/g, '<thead className="bg-secondary/50 text-muted-foreground border-b border-border">');
  
  // 3. Standardize <tbody>
  content = content.replace(/<tbody(?: className="[^"]*")?>/g, '<tbody className="divide-y divide-border/50">');
  
  // 4. Standardize <tr> inside <thead>
  // We want to remove classes from <tr> inside <thead> if they exist, because we moved them to <thead>
  // This is a bit tricky with regex, so we'll just replace specific known bad patterns
  content = content.replace(/<tr className="border-b border-border bg-secondary\/30">/g, '<tr>');
  content = content.replace(/<tr className="border-b border-border bg-secondary\/10">/g, '<tr>');
  
  // 5. Standardize <tr> inside <tbody>
  // We want them to be <tr className="hover:bg-secondary/30 transition-colors group">
  // We'll replace all <tr className="..."> that look like tbody rows.
  content = content.replace(/<tr className="hover:bg-secondary\/[0-9]+ transition-colors[^"]*">/g, '<tr className="hover:bg-secondary/30 transition-colors group">');
  content = content.replace(/<tr className="border-b border-border hover:bg-secondary\/[0-9]+ transition-colors[^"]*">/g, '<tr className="hover:bg-secondary/30 transition-colors group">');
  
  // 6. Standardize <th>
  content = content.replace(/<th className="p-4 font-medium[^"]*">/g, '<th className="px-4 py-3 font-medium">');
  content = content.replace(/<th className="p-4 font-medium text-muted-foreground">/g, '<th className="px-4 py-3 font-medium">');
  content = content.replace(/<th className="px-4 py-2 font-medium">/g, '<th className="px-4 py-3 font-medium">');
  content = content.replace(/<th className="px-4 py-3 font-medium text-muted-foreground">/g, '<th className="px-4 py-3 font-medium">');
  content = content.replace(/<th className="px-4 py-3 font-medium text-muted-foreground text-right">/g, '<th className="px-4 py-3 font-medium text-right">');
  content = content.replace(/<th className="p-4 font-medium text-muted-foreground text-right">/g, '<th className="px-4 py-3 font-medium text-right">');
  
  // 7. Standardize <td>
  content = content.replace(/<td className="p-4">/g, '<td className="px-4 py-3">');
  content = content.replace(/<td className="px-4 py-2">/g, '<td className="px-4 py-3">');
  content = content.replace(/<td className="p-4 text-right[^"]*">/g, '<td className="px-4 py-3 text-right">');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    processFile(path.join(pagesDir, file));
  }
});
