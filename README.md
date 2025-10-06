# EduMaster - Educational Platform

A comprehensive educational platform built with React, TypeScript, and Firebase for managing courses, live classes, and interactive learning experiences. Now includes an integrated Telegram bot for user authentication.

## 🚀 Features

### ✨ Core Features
- **Dark Theme UI** - Modern dark grey color scheme for better visibility
- **Global Navigation** - Always visible navigation header across all pages
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Course Management** - Organized batch and subject-based content structure
- **Live Classes** - Real-time live class integration
- **Video Player** - Full-screen video player with external player support
- **Content Security** - Protected content with encoding/decoding mechanisms
- **Telegram Authentication** - User authentication through Telegram bot with channel verification

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
- **Authentication** - Firebase-based user authentication with Telegram integration
- **Channel Verification** - Mandatory Telegram channel membership verification

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Realtime Database) + Python Telegram Bot
- **Build Tool**: Vite
- **Video Player**: Custom HLS-enabled player
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Process Management**: Supervisord (for Docker deployment)

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
├── telegram_bot/           # Python Telegram bot
│   ├── bot.py             # Telegram bot logic
│   ├── api.py             # Flask API server
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Bot documentation
├── public/                 # Static assets
├── exports/               # Sample course exports
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.7 or higher
- npm or yarn
- Firebase project setup
- Telegram Bot Token (obtain from @BotFather)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd edumaster40-main
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd telegram_bot
   pip install -r requirements.txt
   cd ..
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication
   - Copy your Firebase config to `src/firebase/config.ts`

5. **Telegram Bot Setup**
   - Create a bot with @BotFather on Telegram
   - Obtain your bot token
   - Set the `BOT_TOKEN` environment variable

6. **Start development servers**
   ```bash
   # Terminal 1: Start the frontend
   npm run dev
   
   # Terminal 2: Start the bot API
   npm run bot:dev
   ```

7. **Open your browser**
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

### Telegram Bot Configuration
Update the mandatory channels in `telegram_bot/bot.py`:

```python
MANDATORY_CHANNELS = [
    '@Team_Masters_TM',
    'https://t.me/+uMpwtK3Bu8w0MzU1',
    'https://t.me/+rs2CiB7YDbJlM2M1',
    '@EduMaster2008',
    '@masters_chat_official'
]
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
- **Telegram Authentication**: Secure user verification through Telegram

### Telegram Authentication
- **Channel Verification**: Users must join mandatory Telegram channels
- **Session Management**: Unique session IDs with expiration
- **Activity Logging**: User interaction tracking
- **Login Logging**: Successful authentication records

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
- **Docker**: Integrated deployment with both frontend and Telegram bot

### Deploying to Koyeb with Integrated Bot

1. **Prerequisites**
   - Create a [Koyeb](https://www.koyeb.com/) account
   - Install Git
   - Obtain a Telegram Bot Token from @BotFather
   - Build the project locally: `npm run build`

2. **Deploy using Koyeb Dashboard**
   - Go to your Koyeb dashboard
   - Click "Create App"
   - Select "Docker Image" or connect your GitHub repository
   - Configure the app with these settings:
     - Build method: Dockerfile
     - Environment variables:
       - `BOT_TOKEN`: Your Telegram bot token
   - Deploy the app

3. **Deploy using Docker**
   ```bash
   # Build the Docker image
   docker build -t edumaster-with-bot .
   
   # Run the container
   docker run -d \
     --name edumaster \
     -p 80:80 \
     -p 8000:8000 \
     -e BOT_TOKEN="your_telegram_bot_token" \
     edumaster-with-bot
   ```

4. **Deploy using Koyeb CLI** (if installed)
   ```bash
   # Install Koyeb CLI (if not already installed)
   # Follow instructions at https://www.koyeb.com/docs/cli/installation
   
   # Deploy the app
   koyeb service create edumaster \
     --app your-app-name \
     --dockerfile Dockerfile \
     --env BOT_TOKEN=your_telegram_bot_token \
     --port 80:http \
     --port 8000:http
   ```

### API Endpoints

The Telegram bot API is accessible at `/api/` relative to your domain:

- `POST /api/generate_login_url` - Generate a login URL for Telegram
- `GET /api/check_login_status` - Check the status of a login session
- `GET /api/health` - Health check endpoint
- `GET /api/logs/activity` - Get activity logs
- `GET /api/logs/login` - Get login logs

## 📚 Documentation

- [TOKEN_AUTH_SYSTEM.md](TOKEN_AUTH_SYSTEM.md) - Authentication system documentation
- [TELEGRAM_BOT_IMPLEMENTATION.md](TELEGRAM_BOT_IMPLEMENTATION.md) - Telegram bot implementation details
- [INTEGRATED_DEPLOYMENT.md](INTEGRATED_DEPLOYMENT.md) - Deployment with integrated bot
- [TELEGRAM_BOT_SETUP.md](TELEGRAM_BOT_SETUP.md) - Setup guide for the Telegram bot
- [telegram_bot/README.md](telegram_bot/README.md) - Telegram bot specific documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape EduMaster
- Inspired by modern educational platforms and Telegram bot capabilities