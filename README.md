# Doctor's Chamber 🏥�

Professional healthcare services platform with expert medical care and modern booking system.

## 🌟 Features

- **🏥‍⚕️ Comprehensive Healthcare Services** - Medical check-ups, nutrition advice, surgery, emergency care, counselling, and diagnosis
- **📅 Smart Booking System** - Real-time availability, calendar integration, and automated reminders
- **💳 Secure Payment Processing** - Integrated Stripe payment system with multiple payment options
- **👥 User Management** - Complete user profiles with medical history and preferences
- **💬 Real-time Communication** - Built-in messaging system between patients and healthcare providers
- **📊 Admin Dashboard** - Comprehensive management system for services, users, and bookings
- **📝 Blog CMS** - Dynamic blog system with content management and SEO optimization
- **🎨 Professional Theme** - Cohesive design system based on official brand colors
- **🔐 Authentication & Security** - Firebase-based auth with role-based access control
- **📱 Responsive Design** - Mobile-first approach with seamless cross-device experience
- **♿ Accessibility** - WCAG compliant with focus states and reduced motion support
- **🔍 SEO Optimized** - Meta tags, structured data, and search engine optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project configuration

### Installation

```bash
# Clone the repository
git clone https://github.com/doctors-chamber/platform.git
cd doctors-chamber

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase and Stripe configuration

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🏗️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Bootstrap 5** - Responsive UI framework
- **React Router** - Client-side routing
- **Firebase** - Authentication, database, and storage
- **Stripe** - Payment processing

### Backend Services
- **Firebase Authentication** - User management and security
- **Firebase Firestore** - NoSQL database for real-time data
- **Firebase Storage** - File storage for images and documents
- **Firebase Functions** - Serverless backend logic

### Development Tools
- **Jest** - Testing framework with React Testing Library
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Git Hooks** - Pre-commit hooks for code quality

## 🎨 Theme System

The application features a comprehensive theme system based on the official Doctor's Chamber logo colors:

### Color Palette
- **Primary Blue**: `#0066CC` - Main medical brand color
- **Secondary Blue**: `#003366` - Professional/trust color
- **Accent Aqua**: `#00B4D8` - Calming/health color
- **Success Green**: `#28A745` - Positive actions
- **Warning Yellow**: `#FFC107` - Cautionary elements
- **Danger Red**: `#DC3545` - Error states

### Theme Usage
```jsx
import { useThemeColors } from './hooks/useTheme';

const MyComponent = () => {
  const { primary, secondary, getGradient } = useThemeColors();  
  return (
    <div style={{ 
      background: getGradient('primary'),
      color: secondary 
    }}>
      Themed content
    </div>
  );
};
```

## 📁 Project Structure

```
doctors-chamber/
├── public/
│   ├── logo.png                 # Official logo
│   ├── manifest.json            # PWA manifest
│   └── robots.txt              # SEO configuration
├── src/
│   ├── components/              # Reusable components
│   │   ├── ChatSystem.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── NotificationSystem.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RoleManager.jsx
│   │   ├── SEOHead.jsx
│   │   ├── VerificationGuard.jsx
│   │   └── VerificationStatus.jsx
│   ├── pages/                  # Page components
│   │   ├── Admin.jsx
│   │   ├── About.jsx
│   │   ├── Blogs/
│   │   ├── Chat.jsx
│   │   ├── Checkout/
│   │   ├── Common/
│   │   ├── Contact.jsx
│   │   ├── Home/
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Services.jsx
│   │   └── Signin.jsx
│   ├── theme/                  # Theme system
│   │   ├── theme.js
│   │   ├── ThemeProvider.jsx
│   │   └── README.md
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuthRole.js
│   │   ├── useEmailVerification.js
│   │   └── useTheme.js
│   ├── utils/                  # Utility functions
│   │   └── firebaseHelpers.js
│   ├── App.jsx                 # Main application component
│   ├── index.css              # Global styles and theme variables
│   └── main.jsx               # Application entry point
├── package.json                # Dependencies and scripts
└── README.md                  # This file
```

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run preview          # Preview production build

# Building
npm run build            # Build for production
npm run lint             # Run ESLint

# Testing
npm run test              # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:ci           # Run tests for CI/CD
```

## 🧪 Testing

The application includes comprehensive testing:

- **Unit Tests** - Component testing with Jest and React Testing Library
- **Integration Tests** - API integration and user flows
- **Coverage Reports** - Code coverage tracking
- **Mock Strategies** - Firebase and external service mocking

Run tests:
```bash
npm run test
npm run test:coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

### Environment Setup
1. **Firebase Hosting** - Recommended for static hosting
2. **Vercel** - Alternative with automatic deployments
3. **Netlify** - Another static hosting option

### Firebase Hosting Deployment
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Build and deploy
npm run build
firebase deploy --only hosting
```

## 🔐 Security Features

- **Firebase Authentication** - Secure user management
- **Role-Based Access Control** - Admin, doctor, patient roles
- **Email Verification** - Account verification system
- **Input Validation** - Client and server-side validation
- **XSS Protection** - Input sanitization and CSP headers
- **Secure Payments** - Stripe integration with PCI compliance

## 📱 PWA Features

- **Service Worker** - Offline functionality
- **Web App Manifest** - Installable app experience
- **Responsive Design** - Mobile-optimized interface
- **Touch Gestures** - Mobile-friendly interactions

## 🔍 SEO Optimization

- **Meta Tags** - Dynamic meta for each page
- **Structured Data** - Schema.org markup
- **Open Graph** - Social media sharing
- **Twitter Cards** - Twitter integration
- **Sitemap** - XML sitemap for search engines
- **Robots.txt** - Search engine crawling instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and theme system
- Write tests for new features
- Update documentation for API changes
- Ensure accessibility compliance
- Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: info@doctorschamber.com
- **Website**: https://doctorschamber.com
- **Documentation**: https://docs.doctorschamber.com
- **Issues**: [GitHub Issues](https://github.com/doctors-chamber/platform/issues)

## 🙏 Acknowledgments

- **Firebase Team** - For amazing backend services
- **Stripe** - For secure payment processing
- **Bootstrap Team** - For responsive UI framework
- **React Team** - For excellent frontend library
- **Open Source Community** - For various tools and libraries

---

**Doctor's Chamber** - *Professional Healthcare Services, Modern Technology, Expert Care* 🏥�⚕️

- **Frontend Framework**: React 18.0.0
- **Routing**: React Router DOM 6.3.0
- **UI Framework**: React Bootstrap 2.2.3 with Bootstrap 5.1.3
- **Authentication**: Firebase Authentication (v9.6.11)
- **State Management**: React Firebase Hooks for auth state
- **Notifications**: React Toastify 8.2.0
- **Icons**: Bootstrap Icons 1.8.1
- **Deployment**: Firebase Hosting

### Project Structure

```
src/
├── App.js (Main routing component)
├── firebase.init.js (Firebase configuration)
├── Pages/
│   ├── Home/ (Landing page components)
│   ├── Common/ (Header, Footer)
│   ├── Authentication/ (Signin, Register)
│   ├── Protected/ (Checkout with auth)
│   └── Utility/ (404, About, Blogs)
```

## Features & Functionalities

### 1. **Authentication System**

- **Multi-method Sign-in**: Email/password and Google OAuth
- **User Registration**: New user account creation
- **Password Reset**: Email-based password recovery
- **Protected Routes**: [RequireAuth](cci:9://file:///d:/assignment10/src/Pages/RequireAuth:0:0-0:0) component guards checkout pages
- **Session Management**: Persistent auth state with Firebase hooks
- **Sign-out Functionality**: Secure logout with token cleanup

### 2. **Service Catalog**

- **Dynamic Service Loading**: Fetches from [Services.json](cci:7://file:///d:/assignment10/public/Services.json:0:0-0:0) API
- **Service Cards**: Bootstrap card components with:
  - Service images
  - Pricing information
  - Detailed descriptions
  - Checkout navigation buttons
- **Six Healthcare Services**:
  - Medical and Health Check-ups ($12)
  - Health and Nutrition Advice ($9)
  - Surgery ($40)
  - Emergency ($10)
  - Counselling ($17)
  - Diagnosis and Treatment ($25)

### 3. **Navigation & Routing**

- **React Router Setup**: Client-side routing with these routes:
  - `/` & `/home` - Landing page
  - `/checkout/:id` - Protected checkout page
  - `/blogs` - Blog section
  - `/about` - About page
  - `/register` - User registration
  - `/signin` - User authentication
  - `/*` - 404 error page
- **Sticky Navigation**: Bootstrap navbar with smooth scrolling
- **Responsive Design**: Mobile-friendly navigation

### 4. **User Experience Features**

- **Loading States**: Visual feedback during authentication
- **Toast Notifications**: User feedback for actions
- **404 Error Page**: Custom error page with animated GIF
- **Dynamic Footer**: Auto-updating copyright year
- **Smooth Scrolling**: Navigation to page sections

### 5. **UI/UX Design**

- **Bootstrap Theme**: Success color scheme (green)
- **Responsive Layout**: Mobile-first design approach
- **Component Structure**: Modular React components
- **Custom Styling**: Component-specific CSS files
- **Interactive Elements**: Hover states, transitions, and animations

## Key Components Analysis

### Authentication Flow

1. **Signin Component**: Handles email/password and Google OAuth
2. **RequireAuth**: HOC pattern for route protection
3. **SocialLink**: Google authentication integration
4. **Loading Component**: UX during auth processes

### Service Management

1. **Services Component**: Fetches and displays service catalog
2. **Service Component**: Individual service cards with checkout navigation
3. **Checkout Component**: Protected booking page (currently minimal)

### Layout Components

1. **Header**: Navigation with auth-aware UI
2. **Footer**: Dynamic copyright display
3. **NotFound**: Custom 404 error handling

## Security Features

- **Firebase Authentication**: Secure token-based auth
- **Protected Routes**: Server-side validation
- **Environment Variables**: Firebase config security
- **Input Validation**: Form validation and sanitization

## Deployment & Hosting

- **Firebase Hosting**: Production deployment at `independent-service-prov-9208a.web.app`
- **Build Process**: Optimized React build pipeline
- **Static Asset Serving**: Efficient CDN delivery

## Areas for Enhancement

### Current Limitations

1. **Checkout Page**: Minimal implementation, needs booking logic
2. **Service Management**: No admin panel for service updates
3. **User Profiles**: No user dashboard or booking history
4. **Payment Integration**: No payment processing
5. **Blog Content**: Static implementation, no CMS

### Recommended Improvements

1. **E-commerce Integration**: Stripe/PayPal for payments
2. **Admin Dashboard**: Service and user management
3. **Booking System**: Calendar integration and scheduling
4. **User Profiles**: Booking history and preferences
5. **Real-time Features**: Chat, notifications
6. **SEO Optimization**: Meta tags, structured data
7. **Testing Suite**: Unit and integration tests
8. **Performance Optimization**: Code splitting, lazy loading

## Code Quality Assessment

- **Component Architecture**: Well-structured, modular design
- **State Management**: Appropriate use of React hooks
- **Error Handling**: Basic error boundaries and user feedback
- **Code Organization**: Clear separation of concerns
- **Naming Conventions**: Consistent and descriptive

## Conclusion

Abdullah's Chamber is a solid foundation for a healthcare service platform with modern React architecture, Firebase integration, and responsive design. While it successfully implements core features like authentication and service catalog, it has significant potential for expansion into a full-featured healthcare booking system with payment processing, user management, and administrative capabilities.
