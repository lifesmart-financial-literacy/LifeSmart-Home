# LifeSmart - Financial Education Platform

<div align="center">
  <img src="src/assets/icons/LifeSmartLogo.png" alt="LifeSmart Logo" width="200"/>
  
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-11.6.0-orange.svg)](https://firebase.google.com/)
  [![Chart.js](https://img.shields.io/badge/Chart.js-4.4.8-green.svg)](https://www.chartjs.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

  <strong>Repository:</strong> <a href="https://github.com/Hum2a/LifeSmart-Omni">https://github.com/Hum2a/LifeSmart-Omni</a>

  A comprehensive financial education platform empowering users to make informed financial decisions through interactive tools, personalized guidance, and real-world simulations.
</div>

## 🌟 Features

### Core Features
- **Budget Tool**: Advanced budgeting assistant with interactive features
  - Step-by-step budget creation wizard
  - AI-powered budget recommendations
  - Visual budget breakdown with Chart.js
  - Exportable budget reports (Excel/CSV)
  - Real-time expense tracking
  - Category-based spending analysis

- **Stock Market Simulation**
  - Real-time market data integration
  - Virtual trading environment
  - Portfolio tracking
  - Historical performance analysis
  - Risk assessment tools

- **Learning Center**
  - Interactive financial education modules
  - Progress tracking
  - Achievement system
  - Personalized learning paths

- **Quiz System**
  - Knowledge assessment tests
  - Topic-specific quizzes
  - Performance analytics
  - Certification system

- **Investment Calculator**
  - Compound interest calculations
  - Retirement planning
  - Investment growth projections
  - Risk analysis tools

### Administrative Features
- User management dashboard
- Content management system
- Analytics and reporting
- System configuration tools

## 🚀 Tech Stack

### Frontend
- **Core Framework**: React.js 18.2.0
- **Routing**: React Router v6.21.0
- **State Management**: React Hooks
- **Styling**: 
  - CSS3 with modern features (Flexbox, Grid, CSS Variables)
  - Framer Motion for animations
  - React Transition Group for smooth transitions

### Backend & Services
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Analytics**: Firebase Analytics
- **Hosting**: Firebase Hosting

### Data Visualization & Processing
- **Charts**: Chart.js with react-chartjs-2
- **Spreadsheet Processing**: ExcelJS and XLSX
- **Date Handling**: date-fns
- **HTTP Client**: Axios

## 🛠️ Project Structure

```
src/
├── components/
│   ├── screens/           # Main screen components
│   │   ├── admin/        # Administrative dashboard
│   │   ├── auth/         # Authentication screens
│   │   ├── budget/       # Budget management
│   │   ├── calculator/   # Financial calculators
│   │   ├── learning/     # Educational content
│   │   ├── quiz/         # Assessment system
│   │   ├── simulation/   # Stock market simulation
│   │   └── stockmarket/  # Market analysis tools
│   ├── common/           # Shared components
│   ├── widgets/          # Reusable UI components
│   └── styles/           # Component-specific styles
├── hooks/                # Custom React hooks
├── services/             # API and service integrations
├── utils/                # Utility functions
├── firebase/             # Firebase configuration
└── assets/              # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Firebase account and project setup
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hum2a/LifeSmart-Omni.git
   cd LifeSmart-Omni
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Development Server**
   ```bash
   npm start
   ```

5. **Production Build**
   ```bash
   npm run build
   ```

## 🧪 Testing

The project includes comprehensive testing setup:
- Jest for unit testing
- React Testing Library for component testing
- User event simulation
- DOM testing utilities

Run tests with:
```bash
npm test
```

## 🚀 Release Process

To create a new release, use the `release.sh` script in the project root:

```bash
./release.sh
```

This script will:
1. Ensure you are in the project root.
2. Pull the latest changes from `origin/master`.
3. Install dependencies.
4. Run all tests.
5. Build the production bundle.
6. Auto-increment and create a new git tag for the release.
7. Output next steps for pushing tags and deploying.

**Windows users:**
- If you are on Windows, run the script with Git Bash or WSL:
  ```bash
  bash release.sh
  ```
- You may need to make the script executable on Unix systems:
  ```bash
  chmod +x release.sh
  ```
- **PowerShell Bash Alias (Git Bash workaround):**
  If you have Git for Windows installed, you can set a temporary alias in PowerShell so `bash` works:
  ```powershell
  Set-Alias -Name bash -Value "C:\Program Files\Git\bin\bash.exe"
  bash release.sh
  ```
  Replace the path if your Git is installed elsewhere. This alias lasts for the current session.

After running the script, follow the output instructions to push tags and deploy as needed.

## 📱 Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

- All API keys and sensitive data are stored in environment variables
- Firebase security rules are implemented for data access control
- Regular security audits are performed
- HTTPS is enforced in production

## 📞 Support

For support:
- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation
- Join our community forum

## 🔄 Updates & Maintenance

- Regular dependency updates
- Security patches
- Feature enhancements
- Performance optimizations
