const { execSync } = require('child_process');

try {
  console.log('🔨 Testing TypeScript build...');
  execSync('npx tsc -b', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ TypeScript compilation successful!');
  
  console.log('🔨 Testing Vite build...');
  execSync('npx vite build', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Vite build successful!');
  
  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}