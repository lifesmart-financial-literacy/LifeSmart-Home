import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/initFirebase';
import {
  FaUsers,
  FaChartLine,
  FaCog,
  FaDatabase,
  FaUserShield,
  FaArrowLeft,
  FaKey,
  FaSlidersH
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminHome = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (authLoading) return;

        if (!currentUser) {
          trackError('AUTH_ERROR', 'No user found', 'AdminHome');
          navigate('/', { replace: true });
          return;
        }

        const userDoc = await getDoc(doc(db, 'Users', currentUser.uid));
        const data = userDoc.exists() ? userDoc.data() : {};
        const hasAccess = data.admin === true || data.developer === true || data.isAdmin === true || data.role === 'admin';
        if (!userDoc.exists() || !hasAccess) {
          trackError('AUTH_ERROR', 'Unauthorized access attempt', 'AdminHome');
          console.log("Unauthorized access attempt to admin panel");
          navigate('/', { replace: true });
          return;
        }

        setIsAdmin(true);
        setLoading(false);
        trackFeatureView('admin_panel');
      } catch (error) {
        console.error("Error checking admin status:", error);
        trackError('ADMIN_ERROR', error.message, 'AdminHome');
        navigate('/', { replace: true });
      }
    };

    checkAdminStatus();
  }, [currentUser, authLoading, navigate, trackFeatureView, trackError]);

  const handleFeatureClick = (feature) => {
    trackAdminAction('navigate', { destination: feature.path });
    navigate(feature.path);
  };

  const handleBackClick = () => {
    trackAdminAction('exit_admin_panel');
    navigate('/select');
  };

  const adminFeatures = [
    {
      title: 'User Management',
      icon: <FaUsers size={24} />,
      path: '/admin/users',
      description: 'Manage user accounts and permissions',
      inDevelopment: false
    },
    {
      title: 'Analytics',
      icon: <FaChartLine size={24} />,
      path: '/admin/analytics',
      description: 'View platform usage statistics and metrics',
      inDevelopment: true
    },
    {
      title: 'System Settings',
      icon: <FaCog size={24} />,
      path: '/admin/system-settings',
      description: 'Configure system-wide settings and parameters',
      inDevelopment: true
    },
    {
      title: 'Database Management',
      icon: <FaDatabase size={24} />,
      path: '/admin/database',
      description: 'Manage database operations and backups',
      inDevelopment: true
    },
    {
      title: 'Login Codes',
      icon: <FaKey size={24} />,
      path: '/admin/login-codes',
      description: 'Generate and manage login codes for users',
      inDevelopment: false
    },
    {
      title: 'Tool Configuration',
      icon: <FaSlidersH size={24} />,
      path: '/admin/tool-config',
      description: 'Configure tools and external links on the dashboard',
      inDevelopment: false
    },
  ];

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-900 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200">
        <div className="w-12 h-12 border-2 border-white/10 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200 [data-theme=light]:text-zinc-900">
      <header className="max-w-[1400px] mx-auto mb-12 pb-8 border-b border-white/10 [data-theme=light]:border-zinc-200">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="mb-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-0 [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-zinc-300"
        >
          <FaArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Button>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl mb-4 flex items-center justify-center gap-4">
            <FaUserShield className="text-amber-400 [data-theme=light]:text-amber-600" />
            Admin Control Panel
          </h1>
          <p className="text-zinc-300 text-lg [data-theme=light]:text-zinc-600">Manage and monitor your platform</p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {adminFeatures.map((feature, index) => (
            <button
              key={index}
              onClick={() => !feature.inDevelopment && handleFeatureClick(feature)}
              className={cn(
                "relative overflow-hidden text-left flex flex-col items-start gap-4 rounded-xl p-8 transition-all duration-300",
                "bg-white/5 border border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:shadow-md",
                feature.inDevelopment
                  ? "cursor-not-allowed opacity-80 bg-white/[0.03] [data-theme=light]:bg-zinc-50"
                  : "cursor-pointer hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl [data-theme=light]:hover:bg-zinc-50 [data-theme=light]:hover:shadow-lg"
              )}
            >
              {feature.inDevelopment && (
                <div className="absolute top-4 -right-8 bg-amber-400 text-black px-10 py-2 text-sm font-semibold rotate-45 shadow-md z-10">
                  In Development
                </div>
              )}
              <div className={cn(
                "p-4 rounded-xl bg-amber-400/10 text-amber-400 [data-theme=light]:bg-amber-100 [data-theme=light]:text-amber-600",
                feature.inDevelopment && "opacity-70"
              )}>
                {feature.icon}
              </div>
              <h2 className={cn(
                "text-xl font-semibold text-white [data-theme=light]:text-zinc-900",
                feature.inDevelopment && "text-white/70 [data-theme=light]:text-zinc-600"
              )}>{feature.title}</h2>
              <p className={cn(
                "text-zinc-300 text-base leading-relaxed m-0 [data-theme=light]:text-zinc-600",
                feature.inDevelopment && "text-zinc-300/70 [data-theme=light]:text-zinc-500"
              )}>{feature.description}</p>
            </button>
          ))}
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-white/10 text-center text-zinc-300 text-sm [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-600">
        <p>Admin Panel v1.0 • {new Date().getFullYear()} Life Smart</p>
      </footer>
    </div>
  );
};

export default AdminHome;
