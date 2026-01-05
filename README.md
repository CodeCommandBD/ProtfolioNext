# Portfolio - Next.js 15

A modern, dynamic portfolio website built with Next.js 15, featuring a custom admin dashboard for content management.

## Features

- ✨ **Server-Side Rendering (SSR)** - Fast initial page loads with dynamic data
- 🎨 **Beautiful Animations** - Framer Motion, GSAP, Three.js animations
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🎯 **Dynamic Content** - Manage all content through admin dashboard
- 🖼️ **Image Management** - Cloudinary integration for image uploads
- 📧 **Contact Form** - Integrated with Nodemailer for email notifications
- 🔐 **Admin Authentication** - Secure admin panel with NextAuth.js
- 🗄️ **MongoDB Database** - Scalable data storage
- 🎭 **shadcn/ui Components** - Beautiful, accessible UI components

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Styled Components** - CSS-in-JS styling
- **Tailwind CSS v4** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Three.js** - 3D graphics and effects
- **TypeScript** - Type safety

### Backend

- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **NextAuth.js** - Authentication
- **Cloudinary** - Image hosting
- **Nodemailer** - Email service

### UI Components

- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account
- Email SMTP credentials (Gmail recommended)

### Installation

1. **Clone and navigate to the project**

   ```bash
   cd c:\Users\Shanto\Downloads\Compressed\project\ProtfolioReact-main\ProtfolioNext
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   copy .env.example .env.local
   ```

   Then edit `.env.local` with your credentials:

   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=your_email@gmail.com
   EMAIL_TO=recipient@example.com

   # Admin Credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   ```

4. **Seed the database** (Optional - populates with initial data)

   ```bash
   node scripts/seed.js
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin/login

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── bio/          # Bio/Profile API
│   │   ├── skills/       # Skills API
│   │   ├── experience/   # Experience API
│   │   ├── education/    # Education API
│   │   ├── projects/     # Projects API
│   │   ├── upload/       # Image upload API
│   │   └── contact/      # Contact form API
│   ├── admin/            # Admin dashboard (to be created)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/
│   ├── canvas/           # Three.js components
│   ├── cards/            # Card components
│   ├── sections/         # Page sections
│   ├── HeroBgAnimation/  # Hero background animation
│   └── Navbar.tsx        # Navigation bar
├── lib/
│   ├── db/
│   │   ├── models/       # Mongoose models
│   │   └── mongoose.js   # DB connection
│   ├── utils/            # Utility functions
│   ├── cloudinary.js     # Cloudinary config
│   ├── nodemailer.js     # Email config
│   └── registry.tsx      # Styled components registry
├── scripts/
│   └── seed.js           # Database seeding script
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size

## Admin Dashboard

Access the admin dashboard at `/admin/login` with your configured credentials.

### Features:

- Manage Bio/Profile information
- Add/Edit/Delete Skills
- Add/Edit/Delete Work Experience
- Add/Edit/Delete Education
- Add/Edit/Delete Projects
- Upload images to Cloudinary
- Real-time preview of changes

## API Endpoints

### Public Endpoints

- `GET /api/bio` - Get profile data
- `GET /api/skills` - Get all skills
- `GET /api/experience` - Get all experiences
- `GET /api/education` - Get all education
- `GET /api/projects` - Get all projects
- `POST /api/contact` - Send contact email

### Protected Endpoints (Admin only)

- `PUT /api/bio` - Update profile
- `POST /api/skills` - Create skill
- `PUT /api/skills/[id]` - Update skill
- `DELETE /api/skills/[id]` - Delete skill
- (Similar CRUD for experience, education, projects)
- `POST /api/upload` - Upload image

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS
- Google Cloud

## Environment Variables Guide

### MongoDB

Get a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas

### Cloudinary

Sign up at https://cloudinary.com for image hosting

### Email (Gmail)

1. Enable 2-factor authentication
2. Generate an App Password
3. Use the app password in EMAIL_PASSWORD

### NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

## Contributing

This is a personal portfolio project, but suggestions and improvements are welcome!

## License

MIT License - feel free to use this project for your own portfolio!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 15
