const { execSync } = require('child_process')

console.log('🚀 Setting up database connection...')

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Push schema to database
  console.log('🗄️  Pushing schema to database...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  
  // Test connection
  console.log('✅ Database setup complete!')
  console.log('🌐 You can test the connection by visiting: http://localhost:3000/api/test-db')
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message)
  console.log('\n🔧 Troubleshooting steps:')
  console.log('1. Check your DATABASE_URL in env.local')
  console.log('2. Make sure your Supabase project is active')
  console.log('3. Verify your database password is correct')
  console.log('4. Check if your IP is allowed in Supabase settings')
}
