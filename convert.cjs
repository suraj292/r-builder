const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'legacy');
const destDir = path.join(__dirname, 'src/pages');

// Mapping HTML files to output paths
const fileMap = {
  'index.html': 'marketing/Home.tsx',
  'about_us.html': 'marketing/About.tsx',
  'ats_checker.html': 'marketing/AtsChecker.tsx',
  'contact_us.html': 'marketing/Contact.tsx',
  'faq.html': 'marketing/Faq.tsx',
  'price.html': 'marketing/Pricing.tsx',
  'blog_listing.html': 'blog/BlogListing.tsx',
  'blog_detail.html': 'blog/BlogDetail.tsx',
  'checkout.html': 'user/Checkout.tsx',
  'my-resume.html': 'user/MyResumes.tsx',
  'user_profile.html': 'user/Profile.tsx',
  'login_signup.html': 'auth/LoginSignup.tsx',
  'privacy.html': 'legal/Privacy.tsx',
  'terms.html': 'legal/Terms.tsx',
  'refund-policy.html': 'legal/RefundPolicy.tsx',
  'shipping-policy.html': 'legal/ShippingPolicy.tsx'
};

function convertHtmlToJsx(html) {
  let jsx = html;
  
  // Extract body content if present
  const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    jsx = bodyMatch[1];
  }
  
  // Replace class with className
  jsx = jsx.replace(/class=/g, 'className=');
  
  // Replace for with htmlFor
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Replace HTML comments with JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, (match, p1) => `{/* ${p1} */}`);
  
  // Close unclosed tags
  const tagsToClose = ['img', 'input', 'hr', 'br', 'meta', 'link'];
  tagsToClose.forEach(tag => {
    const regex = new RegExp(`(<${tag}\\b[^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(regex, '$1 />');
  });

  // Handle inline styles (basic conversion, assumes simple style="width: 42%")
  // It's safer to remove or replace specific ones if complex. Let's try to fix progress bars in index.
  jsx = jsx.replace(/style="([^"]*)"/g, (match, styles) => {
      // Split by semicolon, clean, and convert to camelCase
      let styleObj = {};
      styles.split(';').forEach(s => {
          if (!s.trim()) return;
          let [key, val] = s.split(':');
          if (key && val) {
              key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              // Keep CSS variables as is in string key
              if (key.startsWith('--')) {
                 styleObj[`'${key}'`] = `'${val.trim()}'`;
              } else {
                 styleObj[key] = `'${val.trim()}'`;
              }
          }
      });
      // Build object string
      let styleStr = Object.entries(styleObj).map(([k, v]) => `${k}: ${v}`).join(', ');
      return `style={{ ${styleStr} }}`;
  });
  
  return jsx;
}

for (const [htmlFile, jsxPath] of Object.entries(fileMap)) {
  const fullHtmlPath = path.join(srcDir, htmlFile);
  const fullJsxPath = path.join(destDir, jsxPath);
  
  if (fs.existsSync(fullHtmlPath)) {
    const htmlContent = fs.readFileSync(fullHtmlPath, 'utf8');
    const jsxContent = convertHtmlToJsx(htmlContent);
    
    // Create the component wrapper
    const componentName = path.basename(jsxPath, '.tsx');
    const componentTemplate = `import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
    
    fs.mkdirSync(path.dirname(fullJsxPath), { recursive: true });
    fs.writeFileSync(fullJsxPath, componentTemplate);
    console.log(`Converted ${htmlFile} to ${jsxPath}`);
  }
}
