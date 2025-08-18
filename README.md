# LED Quote Builder

A professional web-based quoting and bill of materials tool for LED digital display installations. Built with Next.js, React, TypeScript, Tailwind CSS, and Prisma ORM.

## Features

- **Step-by-Step Quote Builder**: Guided process for creating LED display quotes
- **Display Calculator**: Calculate LED tile requirements, power needs, and costs
- **Power Calculator**: Determine power requirements and recommend equipment
- **Product Management**: Comprehensive product database with specifications
- **Quote Management**: Build quotes with markups, fees, and running totals
- **Export Functionality**: Generate customer-facing quotes and internal BOMs
- **Dark Theme UI**: Modern interface inspired by professional design tools

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (ready for implementation)
- **UI Components**: Custom component library with Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd led-quote-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deployment to Vercel with Supabase

1. **Set up Supabase Database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your database connection string from Settings → Database
   - Copy the URI connection string

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard:
     - `DATABASE_URL`: Your Supabase connection string
     - `NEXTAUTH_SECRET`: A random secret key
     - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://your-app.vercel.app`)

3. **Deploy and Setup Database**
   - Vercel will automatically run `npm run build` which includes Prisma generation
   - After deployment, run database setup:
     ```bash
     # Connect to your Vercel deployment
     vercel env pull .env.local
     
     # Push schema and seed data
     npm run db:push
     npm run db:seed
     ```

4. **Verify Deployment**
   - Check your Vercel deployment URL
   - Verify database connection in Supabase dashboard

### Troubleshooting Vercel Deployment

#### Build Errors
- **TypeScript Errors**: Ensure all dependencies are installed and Prisma client is generated
- **Prisma Errors**: Check that `DATABASE_URL` is correctly set in Vercel environment variables
- **Module Resolution**: Verify all imports use correct paths

#### Database Connection Issues
- **Connection Refused**: Check Supabase project status and connection string
- **Authentication Failed**: Verify database password in connection string
- **Schema Issues**: Run `npm run db:push` after deployment to ensure schema is up to date

#### Common Solutions
```bash
# Regenerate Prisma client
npm run db:generate

# Reset database schema
npm run db:push --force-reset

# Check Prisma status
npx prisma db pull
```

## Project Structure

```
led-quote-builder/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── quote-builder/    # Quote builder specific components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Core Components

### Quote Builder Steps

1. **Customer Information**: Enter customer and project details
2. **Display Calculator**: Calculate LED display requirements
3. **Power Calculator**: Determine power needs
4. **Product Selection**: Add products to the quote
5. **Quote Summary**: Review and export the final quote

### Key Components

- `DisplayCalculator`: Calculates LED tile requirements and costs
- `PowerCalculator`: Determines power requirements and recommendations
- `ProductSelector`: Browse and select products from the database
- `QuoteSummary`: Displays running totals and export options
- `CustomerInfo`: Manages customer and project information

## Database Schema

The application uses a comprehensive Prisma schema with:

- **Products**: LED tiles, processors, power equipment, etc.
- **Specialized Specs**: Detailed specifications for different product types
- **Quotes**: Quote management with items and pricing
- **Users**: User management and authentication
- **Packages**: Product bundles and packages

## API Routes

The application includes API routes for:

- Product CRUD operations
- Quote management
- User authentication
- Export functionality

## Customization

### Adding New Product Categories

1. Update the `ProductCategory` enum in `prisma/schema.prisma`
2. Add corresponding spec model if needed
3. Update the product selector component
4. Add calculation logic if required

### Adding New Calculators

1. Create a new calculator component in `components/quote-builder/`
2. Add the step to the main quote builder
3. Update the sidebar steps configuration
4. Implement calculation logic and results display

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] User authentication and role-based access
- [ ] Advanced calculation modules
- [ ] PDF export functionality
- [ ] Customer portal
- [ ] Integration with accounting systems
- [ ] Mobile responsive design improvements
- [ ] Real-time collaboration features


