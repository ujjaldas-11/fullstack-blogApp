# EasyWrite - AI-Powered Blog App

A modern, feature-rich blogging platform powered by artificial intelligence. Create, share, and discover engaging blog posts with an intuitive interface and powerful AI capabilities.

🌐 **Live Demo:** [https://easywrite-blog.vercel.app](https://easywrite-blog.vercel.app)

![App Preview](./images/hero-preview.png)

## 📋 Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Routes & Server Actions](#api-routes--server-actions)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Content Management
- **Create Posts** - Write and publish new blog posts with a rich text editor
- **Update Posts** - Edit your published content anytime
- **Delete Posts** - Remove posts from your blog
- **Add Images** - Upload and embed images directly in your posts
- **AI-Powered Writing** - Leverage Gemini API to generate blog content automatically

### Social Interactions
- **Like System** - Like your favorite posts and see trending content
- **Comments** - Engage with other readers through post comments
- **User Profiles** - View author profiles and their published posts
- **Search Functionality** - Easily find posts by title, author, or keywords

### User Experience
- **Authentication System** - Secure login/signup with email verification
- **Dark & Light Theme** - Toggle between themes for comfortable reading
- **Responsive Design** - Seamless experience across all devices
- **Real-time Updates** - Instant UI updates for likes, comments, and posts
- **Rich Text Editor** - Quill-powered editor with AI assistance

![Features Demo](./images/features-demo.png)

## 🌐 Live Demo

**Visit the live application:** [https://easywrite-blog.vercel.app](https://easywrite-blog.vercel.app)

### Demo Credentials (Optional)
- Email: `demo@example.com`
- Password: `demo123456`

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router & Server Components
- **React** - UI library
- **shadcn/ui** - High-quality, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Quill Editor** - Rich text editor for blog content

### Backend & Database
- **Supabase** - Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (Email/Password)
  - Storage for images
  - Edge Functions

### AI & Content Generation
- **Gemini API** - Google's AI for intelligent blog generation

### Deployment
- **Vercel** - Hosting platform for Next.js applications

### Other Tools
- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code quality and consistency

## 📁 Folder Structure

```
fullstack-blog-app/
├── public/                    # Static files (logo, favicon)
├── src/
│   ├── app/                   # Pages & layouts
│   │   ├── blog/              # Blog list + single post
│   │   ├── write/             # Create/edit post
│   │   ├── profile/           # User profile & edit
│   │   ├── login/             # Auth pages
│   │   ├── layout.js          # Root layout + navbar
│   │   └── page.js            # Home page
│   ├── components/            # UI components
│   │   ├── ui/                # shadcn/ui components
│   │   └── ...                # QuillEditor, Navbar, etc.
│   ├── lib/supabase/          # Supabase client/server helpers
│   └── server/actions/        # Server Actions (posts, AI, etc.)
├── .env.local                 # Local secrets (not committed)
├── README.md
└── package.json
```

### Folder Structure Explanation

- **public/** - Static assets served directly (images, icons, etc.)
- **src/app/** - Next.js 14 App Router with file-based routing
  - **(auth)/** - Route group for authentication pages (doesn't affect URL)
  - **[id]/** - Dynamic routes for single resources
- **src/components/** - Reusable React components
- **src/lib/** - Shared utilities and Supabase client instances
- **src/server/** - Server Actions (Next.js 13+) for server-side logic

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git
- Supabase account
- Google Gemini API key

### Clone Repository
```bash
git clone https://github.com/ujjaldas-11/fullstack-blogApp.git
cd fullstack-blogApp
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Getting Your API Keys

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to **Settings → API**
4. Copy `Project URL` and `Anon Key`
5. Go to **Settings → Database** to set up your schema

#### Gemini API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy and paste in your `.env.local`

#### Database Schema (Supabase SQL)
```sql
-- Users table (auto-created by Supabase Auth)

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

## 📖 Getting Started

### Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm run start
# or
yarn build
yarn start
```

### Lint Code
```bash
npm run lint
```

## 💡 Usage

### Creating a Blog Post
1. Click **"Write"** in the navbar
2. Enter your post title
3. Use the Quill editor to write your content, or
4. Click **"Generate with AI"** to let Gemini create content for you
5. Add images by clicking the image icon in the editor
6. Click **"Publish"** when ready

![Create Post](./images/create-post.png)

### Interacting with Posts
- **Like** - Click the heart icon to show appreciation
- **Comment** - Scroll to comments section and share your thoughts
- **Search** - Use the search bar to find posts by keyword or author
- **Filter** - View posts by date, popularity, or by specific authors

### Managing Your Profile
- Click on your **profile icon** in the header
- Update your bio, profile picture, and personal info
- View all your published posts
- Manage account settings and preferences

![User Profile](./images/user-profile.png)

### Theme Switching
- Click the **theme toggle** in the header (sun/moon icon)
- Preference is automatically saved to your browser

## 📡 API Routes & Server Actions

### Server Actions (src/server/actions/)

#### Authentication (`auth.js`)
```javascript
// Sign up new user
export async function signUp(email, password)

// Log in user
export async function logIn(email, password)

// Log out user
export async function logOut()

// Get current user
export async function getCurrentUser()
```

#### Posts (`posts.js`)
```javascript
// Create new post
export async function createPost(title, content, imageUrl)

// Get all posts
export async function getAllPosts(limit, offset)

// Get single post
export async function getPostById(id)

// Update post
export async function updatePost(id, title, content, imageUrl)

// Delete post
export async function deletePost(id)

// Get user's posts
export async function getUserPosts(userId)
```

#### Comments (`comments.js`)
```javascript
// Add comment to post
export async function addComment(postId, content)

// Get post comments
export async function getPostComments(postId)

// Delete comment
export async function deleteComment(commentId)
```

#### Likes (`likes.js`)
```javascript
// Like a post
export async function likePost(postId)

// Unlike a post
export async function unlikePost(postId)

// Check if user liked post
export async function checkUserLike(postId)

// Get post likes count
export async function getPostLikesCount(postId)
```

#### Search (`search.js`)
```javascript
// Search posts by title and content
export async function searchPosts(query)

// Search posts by author
export async function searchByAuthor(authorName)
```

#### AI (`ai.js`)
```javascript
// Generate blog content with Gemini
export async function generateBlogContent(prompt)
```

## 🎨 Theme Configuration

The app uses Tailwind CSS with built-in dark and light theme support. Themes are managed through the `ThemeProvider` context and saved to localStorage.

### Customize Theme Colors
Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      }
    }
  }
}
```

## 📸 Screenshots

### Dashboard
![Dashboard](./images/dashboard.png)

### Blog Post View
![Blog Post](./images/blog-post-view.png)

### Create Post
![Create Post](./images/create-post-page.png)

### Comments Section
![Comments](./images/comments-section.png)

### Search Results
![Search Results](./images/search-results.png)

### User Profile
![User Profile](./images/user-profile.png)

## 🐛 Troubleshooting

### Supabase Connection Issues
```
Error: "Cannot connect to Supabase"
```
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Check that your Supabase project is active in the dashboard
- Ensure database tables are created properly

### Images Not Uploading
```
Error: "File upload failed"
```
- Ensure Supabase Storage bucket `blog-images` is configured
- Check file size limits (default: 50MB)
- Verify bucket permissions allow public access
- Restart development server

### AI Generation Not Working
```
Error: "AI generation failed"
```
- Confirm your Gemini API key is valid and not expired
- Check that your Google account has access to the Gemini API
- Verify API quota hasn't been exceeded
- Check browser console for detailed error messages

### Authentication Not Working
```
Error: "Email/Password authentication failed"
```
- Verify email provider is enabled in Supabase Auth settings
- Check that user exists in the database
- Clear browser cookies and try again
- Check Supabase logs for auth errors

## 📝 Environment Checklist

Before deploying to production:

- [ ] Set up all environment variables
- [ ] Create Supabase database tables
- [ ] Configure Supabase Storage bucket for images
- [ ] Test authentication flow (signup, login, logout)
- [ ] Test creating, updating, deleting posts
- [ ] Test image uploads
- [ ] Test AI content generation
- [ ] Test search functionality
- [ ] Test comments and likes
- [ ] Test theme switching
- [ ] Test responsive design on mobile

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Use TypeScript for new components
- Add comments for complex logic
- Test features before submitting PR
- Update README if adding new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support & Contact

- 🌐 **Live App:** [https://easywrite-blog.vercel.app](https://easywrite-blog.vercel.app)
- 📧 **Email:** dasu82058@gmail.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/ujjaldas-11/fullstack-blog-app/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/fullstack-blog-app/discussions)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"**
4. Import your repository
5. Add environment variables in project settings
6. Click **"Deploy"**

### Deploy to Other Platforms

The app can also be deployed to:
- [Netlify](https://netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Railway](https://railway.app)
- [Render](https://render.com)

---

## 📊 Project Stats

- **Tech Stack:** Next.js 14, React, Supabase, Tailwind CSS
- **Lines of Code:** ~2000+
- **Components:** 15+
- **Server Actions:** 20+
- **Database Tables:** 4

---

**Made with ❤️ for the blogging community**

Last updated: February 2026
