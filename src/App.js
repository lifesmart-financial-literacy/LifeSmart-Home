import React from 'react';
import Navigation from './components/common/Navigation';
import { ThemeProvider, useTheme } from './components/contexts/ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  return (
    <div data-theme={theme}>
      {/* <ThemeToggle /> */}
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
