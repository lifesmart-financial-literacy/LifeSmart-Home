import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SelectScreen from '../screens/SelectScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import SettingsScreen from '../screens/auth/SettingsScreen';
import NotFound from '../screens/NotFound';

// Admin related screens
import AdminHome from '../screens/admin/scripts/AdminHome';
import AdminAnalytics from '../screens/admin/scripts/AdminAnalytics';
import AdminUserManagement from '../screens/admin/scripts/AdminUserManagement';
import AdminSystemSettings from '../screens/admin/scripts/AdminSystemSettings';
import AdminDatabaseManagement from '../screens/admin/scripts/AdminDatabaseManagement';
import AdminLoginCodes from '../screens/admin/scripts/AdminLoginCodes';
import AdminToolConfig from '../screens/admin/scripts/AdminToolConfig';

// Life Balance related screens
import LifeBalance from '../screens/lifebalance/LifeBalance';

// School Quiz related screens (simulation removed)
import SchoolQuizLandingPage from '../screens/quiz/QuizLandingPage';
import SchoolFinancialQuiz from '../screens/quiz/FinancialQuiz';

// Adult Simulation related screens
import FinanceQuestFinancialQuiz from '../screens/financeQuest/FinancialQuiz';
import FinanceQuestLandingPage from '../screens/financeQuest/QuestLandingPage';
import FinanceQuestTeamCreationPage from '../screens/financeQuest/TeamCreationPage';
import FinanceQuestLeaderboard from '../screens/financeQuest/Leaderboard';
import FinanceQuestSimSetup from '../screens/financeQuest/sim/SimSetup';
import FinanceQuestPastSimulations from '../screens/financeQuest/sim/PastSimulations';
import FinanceQuestSimulation from '../screens/financeQuest/FinanceQuestSimulation';
import FinanceQuestSimulationControls from '../screens/financeQuest/sim/SimulationControls';
import FinanceQuestResultsScreen from '../screens/financeQuest/sim/ResultsScreen';

// Adult Quiz related screens
import AdultQuiz from '../screens/adult/scripts/AdultQuiz';

// Tools and Calculators
import InvestmentCalculator from '../screens/calculator/InvestmentCalculator';
import BudgetTool from '../screens/budget/scripts/BudgetTool';

const Navigation = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          {/* Core Navigation */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/select" element={<SelectScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
          <Route path="/admin/database" element={<AdminDatabaseManagement />} />
          <Route path="/admin/login-codes" element={<AdminLoginCodes />} />
          <Route path="/admin/tool-config" element={<AdminToolConfig />} />
          

          {/* School Quiz System */}
          <Route path="/quiz-landing" element={<SchoolQuizLandingPage />} />
          <Route path="/quiz" element={<SchoolFinancialQuiz />} />

          {/* Adult Simulation System */}
          <Route path="/finance-quest" element={<FinanceQuestLandingPage />} />
          <Route path="/finance-quest-quiz" element={<FinanceQuestFinancialQuiz />} />
          <Route path="/finance-quest-team-creation" element={<FinanceQuestTeamCreationPage />} />
          <Route path="/finance-quest-leaderboard" element={<FinanceQuestLeaderboard />} />
          <Route path="/finance-quest-results" element={<FinanceQuestResultsScreen />} />
          <Route path="/finance-quest-setup" element={<FinanceQuestSimSetup />} />
          <Route path="/finance-quest-past-simulations" element={<FinanceQuestPastSimulations />} />
          <Route path="/finance-quest-controls" element={<FinanceQuestSimulationControls />} />
          <Route path="/finance-quest-page" element={<FinanceQuestSimulation />} />

          {/* Adult Quiz System */}
          <Route path="/adult-quiz" element={<AdultQuiz />} />

          {/* Life Balance System */}
          <Route path="/life-balance" element={<LifeBalance />} />

          {/* Financial Tools */}
          <Route path="/investment-calculator" element={<InvestmentCalculator />} />
          <Route path="/budget-tool" element={<BudgetTool />} />

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation; 