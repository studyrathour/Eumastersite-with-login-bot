# EduMaster - Educational Platform

A comprehensive educational platform built with React, TypeScript, and Firebase for managing courses, live classes, and interactive learning experiences.

## 🚀 Features

### ✨ Core Features
- **Dark Theme UI** - Modern dark grey color scheme for better visibility
- **Global Navigation** - Always visible navigation header across all pages
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Course Management** - Organized batch and subject-based content structure
- **Live Classes** - Real-time live class integration
- **Video Player** - Full-screen video player with external player support
- **Content Security** - Protected content with encoding/decoding mechanisms

### 📚 Content Management
- **Batch System** - Multiple layout options (Standard Grid, Horizontal List, Overlay Grid, Alternating List)
- **Subject Organization** - Hierarchical content structure
- **Content Types** - Support for videos, notes, assignments, and quizzes
- **Thumbnail Management** - Original image ratio preservation
- **4-Column Layout** - Optimized content display with clear borders

### 🎥 Video Features
- **Full-Screen Player** - Immersive video viewing experience
- **HLS Support** - HTTP Live Streaming compatibility
- **External Player Integration** - Seamless video player embedding
- **Mobile Optimized** - Touch-friendly video controls

### 👥 User Management
- **Admin Dashboard** - Comprehensive admin panel
- **Student Interface** - Clean, intuitive student experience
- **Protected Routes** - Secure admin access
- **Authentication** - Firebase-based user authentication

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Realtime Database)
- **Build Tool**: Vite
- **Video Player**: Custom HLS-enabled player
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Hooks

## 📁 Project Structure

```
edumaster40-main/
├── src/
│   ├── components/           # React components
│   │   ├── batch-layouts/   # Different batch display layouts
│   │   ├── AdminDashboard.tsx
│   │   ├── HomePage.tsx
│   │   ├── Navigation.tsx
│   │   ├── ContentThumbnail.tsx
│   │   └── ...
│   ├── firebase/            # Firebase configuration
│   ├── services/            # API services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and assets
│   └── App.tsx
├── public/                 # Static assets
├── exports/               # Sample course exports
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd edumaster40-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication
   - Copy your Firebase config to `src/firebase/config.ts`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Firebase Setup
Update `src/firebase/config.ts` with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 📱 Features in Detail

### Navigation System
- **Always Visible Header**: Sticky navigation with Home, Batches, and Live Classes
- **Active State**: Current page highlighting
- **Responsive Design**: Desktop and mobile optimized

### Content Display
- **Dark Theme**: Grey backgrounds with visible borders for content identification
- **4-Column Grid**: Optimal content layout (1 col mobile → 4 cols desktop)
- **Original Thumbnails**: No forced aspect ratios, natural image dimensions
- **Compact Buttons**: Small Watch/View buttons for better space utilization

### Video Player
- **Full-Screen Mode**: Complete viewport coverage
- **External Integration**: Embedded video player support

### Security Features
- **Content Protection**: Base64 encoding with random prefixes/suffixes
- **Dynamic Obfuscation**: DOM attributes protection
- **Secure Storage**: Encoded data in Firebase
- **Anti-Scraping**: Multiple protection layers

## 🎨 Design System

### Color Scheme
- **Background**: Dark grey (`bg-gray-600`)
- **Borders**: Medium grey (`border-gray-400`)
- **Text**: White (`text-white`) with blue accents (`text-blue-300`)
- **Buttons**: Compact design with hover effects

### Layout Principles
- **4-Column Grid**: Maximum 4 items per row
- **8% Navigation**: Minimal header space (reduced from 25%)
- **Visible Borders**: Clear content separation
- **Original Ratios**: Natural image dimensions

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Netlify**: Ready with `netlify.toml` configuration
- **Vercel**: Compatible with Vite builds
- **Firebase Hosting**: Direct Firebase integration
- **Koyeb**: Ready with `koyeb.yaml` configuration

### Deploying to Koyeb

1. **Prerequisites**
   - Create a [Koyeb](https://www.koyeb.com/) account
   - Install Git
   - Build the project locally: `npm run build`

2. **Deploy using Koyeb Dashboard**
   - Go to your Koyeb dashboard
   - Click "Create App"
   - Select "Static Site"
   - Connect your GitHub repository or upload the `dist` folder
   - Configure the app with these settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Environment variables (if needed)
   - Deploy the app

3. **Deploy using Koyeb CLI** (if installed)
   ```bash
   # Install Koyeb CLI (if not already installed)
   # Follow instructions at https://www.koyeb.com/docs/cli/installation
   
   # Login to Koyeb
   koyeb login
   
   # Deploy the app
   npm run deploy:koyeb
   ```

4. **Docker Deployment**
   - The project includes a Dockerfile for containerized deployment
   - See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed instructions
   - Select "Docker" as the deployment method in Koyeb dashboard

5. **Manual Deployment**
   - Build the project: `npm run build`
   - Upload the contents of the `dist` folder to Koyeb as a static site

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Suraj Rathour** - *Initial work* - [studyrathour](https://github.com/studyrathour)

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling system
- Lucide React for icons
- Vite for build tooling
- React Router for navigation

## 📞 Support

For support, email rathourravishankar186@gmail.com or create an issue in this repository.

---

**Built with ❤️ for education**