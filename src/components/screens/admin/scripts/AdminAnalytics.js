import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import {
  FaChartLine,
  FaUsers,
  FaExclamationTriangle,
  FaClock,
  FaArrowLeft
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties
} from 'firebase/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { trackFeatureView, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    userEngagement: [],
    featureUsage: {},
    errorRates: [],
    dailyActiveUsers: [],
    sessionTimes: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        trackFeatureView('admin_analytics');

        // Get Analytics instance
        const analyticsInstance = getAnalytics();

        // Enable analytics collection
        await setAnalyticsCollectionEnabled(analyticsInstance, true);

        // Set admin user properties
        if (currentUser) {
          setUserId(analyticsInstance, currentUser.uid);
          setUserProperties(analyticsInstance, {
            user_role: 'admin',
            admin_section: 'analytics'
          });
        }

        // Log admin analytics view
        logEvent(analyticsInstance, 'admin_analytics_view', {
          timestamp: new Date().toISOString(),
          admin_id: currentUser?.uid
        });

        // For now, we'll use mock data since we can't directly query analytics data
        // In a real implementation, this would come from your backend API
        const mockData = {
          userEngagement: [120, 150, 180, 160, 200, 170, 190],
          featureUsage: {
            'Dashboard': 450,
            'Profile': 320,
            'Settings': 280,
            'Reports': 210,
            'Tools': 180
          },
          errorRates: [5, 3, 4, 2, 3, 4, 3],
          dailyActiveUsers: [150, 180, 200, 170, 220, 190, 210],
          sessionTimes: 25 // Average session time in minutes
        };

        setAnalyticsData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        trackError('ANALYTICS_ERROR', error.message, 'AdminAnalytics');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [trackFeatureView, trackError, currentUser]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const userEngagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'User Interactions',
        data: analyticsData.userEngagement,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        tension: 0.4
      }
    ]
  };

  const featureUsageData = {
    labels: Object.keys(analyticsData.featureUsage),
    datasets: [
      {
        label: 'Feature Views',
        data: Object.values(analyticsData.featureUsage),
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(233, 30, 99, 0.7)',
          'rgba(156, 39, 176, 0.7)'
        ]
      }
    ]
  };

  const errorRatesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Errors',
        data: analyticsData.errorRates,
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        tension: 0.4
      }
    ]
  };

  const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    return ((last - first) / first) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-900 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200">
        <div className="w-12 h-12 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200 [data-theme=light]:text-zinc-900">
      <header className="max-w-[1400px] mx-auto mb-12 pb-8 border-b border-white/10 [data-theme=light]:border-zinc-200">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-0 [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-zinc-300"
        >
          <FaArrowLeft size={20} />
          <span>Back to Admin Panel</span>
        </Button>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl mb-4 flex items-center justify-center gap-4">
            <FaChartLine className="text-blue-500 [data-theme=light]:text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-zinc-300 text-lg [data-theme=light]:text-zinc-600">Monitor platform performance and user engagement</p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:-translate-y-1 transition-all duration-300 hover:bg-white/10 [data-theme=light]:hover:bg-zinc-50">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="text-3xl text-blue-500 bg-blue-500/10 p-4 rounded-xl [data-theme=light]:bg-blue-100 [data-theme=light]:text-blue-600">
                <FaUsers />
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-300 text-base m-0 [data-theme=light]:text-zinc-600">Daily Active Users</h3>
                <p className="text-2xl font-bold my-2 m-0">{analyticsData.dailyActiveUsers[6]}</p>
                <span className={cn(
                  "text-sm inline-block px-2 py-1 rounded",
                  calculateTrend(analyticsData.dailyActiveUsers) >= 0
                    ? "bg-green-500/10 text-green-500 [data-theme=light]:bg-green-100 [data-theme=light]:text-green-700"
                    : "bg-red-500/10 text-red-500 [data-theme=light]:bg-red-100 [data-theme=light]:text-red-700"
                )}>
                  {calculateTrend(analyticsData.dailyActiveUsers) >= 0 ? '+' : ''}{calculateTrend(analyticsData.dailyActiveUsers).toFixed(1)}% this week
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:-translate-y-1 transition-all duration-300 hover:bg-white/10 [data-theme=light]:hover:bg-zinc-50">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="text-3xl text-blue-500 bg-blue-500/10 p-4 rounded-xl [data-theme=light]:bg-blue-100 [data-theme=light]:text-blue-600">
                <FaClock />
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-300 text-base m-0 [data-theme=light]:text-zinc-600">Avg. Session Time</h3>
                <p className="text-2xl font-bold my-2 m-0">{analyticsData.sessionTimes}m</p>
                <span className="text-sm inline-block px-2 py-1 rounded bg-green-500/10 text-green-500 [data-theme=light]:bg-green-100 [data-theme=light]:text-green-700">Last 7 days</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:-translate-y-1 transition-all duration-300 hover:bg-white/10 [data-theme=light]:hover:bg-zinc-50">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="text-3xl text-blue-500 bg-blue-500/10 p-4 rounded-xl [data-theme=light]:bg-blue-100 [data-theme=light]:text-blue-600">
                <FaExclamationTriangle />
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-300 text-base m-0 [data-theme=light]:text-zinc-600">Error Rate</h3>
                <p className="text-2xl font-bold my-2 m-0">{analyticsData.errorRates[6]}</p>
                <span className={cn(
                  "text-sm inline-block px-2 py-1 rounded",
                  calculateTrend(analyticsData.errorRates) <= 0
                    ? "bg-green-500/10 text-green-500 [data-theme=light]:bg-green-100 [data-theme=light]:text-green-700"
                    : "bg-red-500/10 text-red-500 [data-theme=light]:bg-red-100 [data-theme=light]:text-red-700"
                )}>
                  {calculateTrend(analyticsData.errorRates) >= 0 ? '+' : ''}{calculateTrend(analyticsData.errorRates).toFixed(1)}% this week
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white m-0 [data-theme=light]:text-zinc-900">User Engagement</h2>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[250px] relative">
                <Line options={chartOptions} data={userEngagementData} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white m-0 [data-theme=light]:text-zinc-900">Feature Usage</h2>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[250px] relative">
                <Doughnut options={chartOptions} data={featureUsageData} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white m-0 [data-theme=light]:text-zinc-900">Error Rates</h2>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[250px] relative">
                <Line options={chartOptions} data={errorRatesData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
