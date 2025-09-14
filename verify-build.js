#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Munir Demo Chat App Build...\n');

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ directory not found. Run "npm run build:web" first.');
  process.exit(1);
}

console.log('✅ dist/ directory exists');

// Check essential files
const essentialFiles = [
  'index.html',
  'favicon.ico',
  'metadata.json'
];

const missingFiles = [];
essentialFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`❌ ${file} - Missing`);
    missingFiles.push(file);
  }
});

// Check _expo directory
const expoPath = path.join(distPath, '_expo');
if (fs.existsSync(expoPath)) {
  console.log('✅ _expo/ directory exists');
  
  // Check for JS bundle
  const staticJsPath = path.join(expoPath, 'static', 'js', 'web');
  if (fs.existsSync(staticJsPath)) {
    const jsFiles = fs.readdirSync(staticJsPath).filter(f => f.endsWith('.js'));
    if (jsFiles.length > 0) {
      const mainBundle = jsFiles[0];
      const bundlePath = path.join(staticJsPath, mainBundle);
      const bundleStats = fs.statSync(bundlePath);
      console.log(`✅ Main bundle: ${mainBundle} (${(bundleStats.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  }
} else {
  console.log('❌ _expo/ directory missing');
  missingFiles.push('_expo/');
}

// Check assets directory
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const assetFiles = fs.readdirSync(assetsPath);
  console.log(`✅ assets/ directory exists (${assetFiles.length} files)`);
} else {
  console.log('⚠️  assets/ directory not found (may be normal)');
}

// Verify index.html content
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const checks = [
    { name: 'Title contains "Munir Demo"', test: () => indexContent.includes('Munir Demo') },
    { name: 'Root div exists', test: () => indexContent.includes('<div id="root">') },
    { name: 'JavaScript bundle referenced', test: () => indexContent.includes('/_expo/static/js/web/') },
    { name: 'Meta charset set', test: () => indexContent.includes('charset="utf-8"') },
    { name: 'Viewport meta tag', test: () => indexContent.includes('name="viewport"') }
  ];
  
  console.log('\n📄 index.html validation:');
  checks.forEach(check => {
    const result = check.test();
    console.log(`${result ? '✅' : '❌'} ${check.name}`);
  });
}

// Summary
console.log('\n📊 Build Summary:');
if (missingFiles.length === 0) {
  console.log('🎉 All essential files present! Build is ready for deployment.');
  console.log('\n🚀 Deployment options:');
  console.log('  • Web: Upload dist/ folder to any static hosting service');
  console.log('  • Vercel: Run "vercel --prod" in the project directory');
  console.log('  • Netlify: Drag & drop dist/ folder to Netlify');
  console.log('  • Local test: Run "npx serve dist --single"');
} else {
  console.log(`❌ ${missingFiles.length} essential file(s) missing: ${missingFiles.join(', ')}`);
  console.log('Please run "npm run build:web" to generate a complete build.');
  process.exit(1);
}

console.log('\n✨ Munir Demo Chat App build verification complete!');