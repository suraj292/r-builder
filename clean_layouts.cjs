const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(fullPath));
        } else { 
            if(fullPath.endsWith('.tsx')) results.push(fullPath);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src/pages'));
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    // Remove <nav id="navbar" ...> ... </nav>
    // To match multiline up to closing nav:
    content = content.replace(/<nav\s+id="navbar"[\s\S]*?<\/nav>/gi, '');
    
    // Some might just be <nav class="...">
    // Let's remove any <nav ... </nav> since our pages shouldn't have their own main navs.
    content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');

    // Remove <footer ... > ... </footer>
    content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

    fs.writeFileSync(f, content);
});
console.log('Cleaned layout elements from pages');
