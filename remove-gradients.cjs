const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let totalChanged = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace common linear gradients
  content = content.replace(/'linear-gradient\(135deg, #3B5BFF, #00C2A8\)'/g, "'#3B5BFF'");
  content = content.replace(/'linear-gradient\(135deg, #00C2A8 0%, #3B5BFF 100%\)'/g, "'#3B5BFF'");
  content = content.replace(/'linear-gradient\(135deg, #3B5BFF 0%, #00C2A8 100%\)'/g, "'#3B5BFF'");
  content = content.replace(/'linear-gradient\(90deg, #3B5BFF, #00C2A8\)'/g, "'#3B5BFF'");
  content = content.replace(/'linear-gradient\(90deg, #3B5BFF, #F59E0B\)'/g, "'#3B5BFF'"); // AdminDashboard progress bar
  content = content.replace(/'linear-gradient\(135deg, rgba\(59, 91, 255, 0.18\), rgba\(0, 194, 168, 0.18\)\)'/g, "'rgba(59, 91, 255, 0.1)'");
  content = content.replace(/'linear-gradient\(135deg, rgba\(59,91,255,0.08\), rgba\(0,194,168,0.06\)\)'/g, "'rgba(59, 91, 255, 0.05)'");
  
  // Replace gradient-text class with pure blue text
  content = content.replace(/className="gradient-text"/g, 'className="text-[#3B5BFF]"');
  content = content.replace(/className="[^"]*gradient-text[^"]*"/g, match => match.replace('gradient-text', 'text-[#3B5BFF]'));

  // Replace bg-gradient-to-* classes
  content = content.replace(/bg-gradient-to-[a-z]+ from-\[#[A-F0-9]+\] (via-\[#[A-F0-9]+\] )?to-\[#[A-F0-9]+\]/g, 'bg-[#3B5BFF]');

  // Kiosk screen specifics
  content = content.replace(/'linear-gradient\(135deg, transparent, #2F80FF, #00D9C0, transparent\)'/g, "'#3B5BFF'");
  content = content.replace(/'radial-gradient\(ellipse, #2F80FF, transparent\)'/g, "'#3B5BFF'");
  content = content.replace(/'linear-gradient\(135deg, #2F80FF, #00D9C0\)'/g, "'#3B5BFF'");
  content = content.replace(/'linear-gradient\(135deg, #00D9C0, #2F80FF\)'/g, "'#3B5BFF'");
  content = content.replace(/'linear-gradient\(135deg, rgba\(34,197,94,0.12\), rgba\(0,217,192,0.08\)\)'/g, "'rgba(34,197,94,0.15)'");
  content = content.replace(/'linear-gradient\(135deg, rgba\(47,128,255,0.12\), rgba\(0,217,192,0.08\)\)'/g, "'rgba(59,91,255,0.15)'");

  // Hero screen radial gradients
  content = content.replace(/radial-gradient\(ellipse 900px 600px at 20% 35%, rgba\(59, 91, 255, 0.07\) 0%, transparent 65%\),/g, "");
  content = content.replace(/radial-gradient\(ellipse 700px 500px at 80% 65%, rgba\(0, 194, 168, 0.06\) 0%, transparent 65%\)/g, "");
  content = content.replace(/'radial-gradient\(circle, rgba\(59,91,255,0.15\) 0%, rgba\(0,194,168,0.1\) 60%, transparent 80%\)'/g, "'#EEF1FF'");
  content = content.replace(/'radial-gradient\(circle, rgba\(59, 91, 255, 0.06\) 0%, rgba\(0, 194, 168, 0.03\) 60%, transparent 80%\)'/g, "'#EEF1FF'");

  // User/Admin Dashboard specific 
  content = content.replace(/'radial-gradient\(circle, rgba\(0,194,168,0.12\) 0%, transparent 70%\)'/g, "'#EEF1FF'");
  content = content.replace(/'radial-gradient\(circle, rgba\(59,91,255,0.15\) 0%, transparent 70%\)'/g, "'#EEF1FF'");

  // Remove box-shadows that include gradient glow
  content = content.replace(/boxShadow: '0 2px 8px rgba\(59,91,255,0.3\)'/g, "boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)'");
  content = content.replace(/boxShadow: '0 2px 6px rgba\(59, 91, 255, 0.25\)'/g, "boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)'");

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + path.relative(path.join(__dirname, 'src'), file));
    totalChanged++;
  }
});

console.log('Total files updated: ' + totalChanged);
