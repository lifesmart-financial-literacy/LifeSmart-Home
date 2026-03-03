import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaFire,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/initFirebase';
import Modal from '../widgets/modals/Modal';
import { cn } from '@/lib/utils';
import { useToolConfig } from '../../hooks/useToolConfig';
import { getIconComponent, canRoleAccessTool } from '../../lib/toolConfig';

const SelectScreen = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, logout } = useAuth();
  const { groups, loading: toolsLoading } = useToolConfig();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [expandedGroups, setExpandedGroups] = useState(null);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => {
      const base = prev ?? new Set(groups.map((g) => g.id));
      const next = new Set(base);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const isGroupExpanded = (groupId) => {
    if (expandedGroups === null) return true;
    return expandedGroups.has(groupId);
  };

  useEffect(() => {
    if (groups.length > 0) {
      setExpandedGroups((prev) => (prev === null ? new Set(groups.map((g) => g.id)) : prev));
    }
  }, [groups]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authLoading) return;
        if (!currentUser) {
          navigate('/', { replace: true });
          return;
        }
        const userDoc = await getDoc(doc(db, 'Users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const hasAccess = data.admin === true || data.developer === true || data.isAdmin === true || data.role === 'admin';
          setCanAccessAdmin(hasAccess);
          setStreak(data.streak || 0);
          const role = data.developer === true ? 'developer' : data.admin === true || data.isAdmin === true || data.role === 'admin' ? 'admin' : 'user';
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [currentUser, authLoading, navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      setShowLogoutModal(true);
      await logout();
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading || loading || toolsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] [data-theme=light]:from-[#f7f8fa] [data-theme=light]:to-[#e3e8ee]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-green-500 rounded-full animate-spin [data-theme=light]:border-gray-200 [data-theme=light]:border-t-green-500" />
      </div>
    );
  }

  if (!currentUser && !authLoading) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-white [data-theme=light]:from-[#f7f8fa] [data-theme=light]:to-[#e3e8ee] [data-theme=light]:text-[#181a1b]">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden z-[1]">
          <div className="absolute w-[300px] h-[300px] -top-[150px] -left-[150px] rounded-full bg-white/10 animate-float [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-indigo-200 [data-theme=light]:to-indigo-100" />
          <div className="absolute w-[200px] h-[200px] top-1/2 -right-[100px] rounded-full bg-white/10 animate-float [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-pink-200 [data-theme=light]:to-red-200" style={{ animationDelay: '-5s' }} />
          <div className="absolute w-[150px] h-[150px] -bottom-[75px] left-1/2 rounded-full bg-white/10 animate-float [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-teal-200 [data-theme=light]:to-sky-200" style={{ animationDelay: '-10s' }} />
        </div>

        <div className="relative z-[2] w-full max-w-[1200px] p-8 text-center">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-green-500">Life</span>
              <span className="text-blue-500">Smart</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 [data-theme=light]:text-gray-600">Choose your financial journey</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full animate-pulse [data-theme=light]:bg-amber-50 [data-theme=light]:border-amber-300 [data-theme=light]:text-amber-600">
              <FaFire className="text-orange-500 text-2xl [data-theme=light]:text-amber-600" />
              <span className="font-semibold text-lg text-white [data-theme=light]:text-amber-600">
                {streak} Day{streak !== 1 ? 's' : ''}
              </span>
            </div>
          </header>

          <main>
            <div className="flex flex-col gap-10">
              {groups.map((group) => {
                const visibleTools = (group.tools || []).filter((tool) => canRoleAccessTool(tool, userRole));
                if (visibleTools.length === 0) return null;
                const expanded = isGroupExpanded(group.id);
                return (
                  <section key={group.id} className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="flex items-center gap-2 w-full text-left px-1 py-2 rounded-lg hover:bg-white/5 [data-theme=light]:hover:bg-gray-100 transition-colors group/btn"
                    >
                      <span className="text-gray-400 group-hover/btn:text-gray-300 transition-transform duration-200 [data-theme=light]:text-gray-500 [data-theme=light]:group-hover/btn:text-gray-700">
                        {expanded ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
                      </span>
                      {group.label && (
                        <h2 className="text-lg font-semibold text-gray-300 [data-theme=light]:text-gray-600">
                          {group.label}
                        </h2>
                      )}
                      <span className="text-sm text-gray-500 [data-theme=light]:text-gray-400 ml-1">
                        ({visibleTools.length})
                      </span>
                    </button>
                    {expanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
                      {visibleTools.map((tool) => {
                const iconEl = getIconComponent(tool.icon, 40, tool.color);
                const isExternal = tool.type === 'external';
                const cardClass = cn(
                  'relative flex flex-col items-center gap-4 p-8 rounded-2xl transition-all duration-300',
                  'backdrop-blur-md text-white text-xl',
                  isExternal
                    ? 'bg-teal-500/20 border border-teal-400/40 [data-theme=light]:bg-teal-50 [data-theme=light]:text-[#181a1b] [data-theme=light]:border-teal-300 [data-theme=light]:shadow-md'
                    : 'bg-white/10 [data-theme=light]:bg-white/85 [data-theme=light]:text-[#181a1b] [data-theme=light]:border [data-theme=light]:border-gray-200 [data-theme=light]:shadow-md'
                );
                const disabledClass = cn(
                  'relative flex flex-col items-center gap-4 p-8 rounded-2xl cursor-not-allowed opacity-70',
                  'bg-white/5 [data-theme=light]:bg-gray-100 [data-theme=light]:text-gray-400 [data-theme=light]:border [data-theme=light]:border-gray-200'
                );

                if (tool.enabled) {
                  const content = (
                    <>
                      {tool.inDevelopment && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-15 bg-black/80 text-blue-500 px-4 py-2 rounded border-2 border-blue-500 text-base font-bold z-10 whitespace-nowrap [data-theme=light]:bg-blue-50 [data-theme=light]:text-blue-600 [data-theme=light]:border-blue-500">
                          In Development
                        </div>
                      )}
                      <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{iconEl}</span>
                      <span className="font-medium">{tool.label}</span>
                    </>
                  );

                  if (tool.type === 'external') {
                    return (
                      <a
                        key={tool.id}
                        href={tool.url}
                        target={tool.openInNewTab ? '_blank' : undefined}
                        rel={tool.openInNewTab ? 'noopener noreferrer' : undefined}
                        className={cn(cardClass, 'cursor-pointer hover:-translate-y-1 hover:bg-teal-500/30 hover:border-teal-400/60 hover:shadow-xl [data-theme=light]:hover:bg-teal-100 [data-theme=light]:hover:border-teal-400 no-underline')}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleNavigation(tool.path)}
                      className={cn(cardClass, 'border-none cursor-pointer hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl [data-theme=light]:hover:bg-gray-100')}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <div key={tool.id} className={disabledClass}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-15 bg-black/80 text-green-500 px-4 py-2 rounded border-2 border-green-500 text-base font-bold z-10 whitespace-nowrap [data-theme=light]:bg-amber-50 [data-theme=light]:text-green-600 [data-theme=light]:border-green-500">
                      Coming Soon
                    </div>
                    <span className="opacity-50">{iconEl}</span>
                    <span className="opacity-50 font-medium">{tool.label}</span>
                  </div>
                );
              })}
                    </div>
                    )}
                  </section>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 p-4 bg-white/5 rounded-xl backdrop-blur-md [data-theme=light]:bg-gray-100 [data-theme=light]:border [data-theme=light]:border-gray-200">
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-blue-500/20 text-white font-medium cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-blue-500/30 [data-theme=light]:bg-indigo-200 [data-theme=light]:text-[#181a1b] [data-theme=light]:border-indigo-300 [data-theme=light]:hover:bg-indigo-300"
              >
                <FaUserCircle size={24} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => handleNavigation('/settings')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-purple-500/20 text-white font-medium cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-purple-500/30 [data-theme=light]:bg-purple-100 [data-theme=light]:text-[#181a1b] [data-theme=light]:border-purple-300 [data-theme=light]:hover:bg-purple-200"
              >
                <FaCog size={24} />
                <span>Settings</span>
              </button>
              {canAccessAdmin && (
                <button
                  onClick={() => handleNavigation('/admin')}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-amber-500/20 text-white font-medium cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-amber-500/30 [data-theme=light]:bg-amber-100 [data-theme=light]:text-[#181a1b] [data-theme=light]:border-amber-300 [data-theme=light]:hover:bg-amber-200"
                >
                  <FaCog size={24} />
                  <span>Admin Controls</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-red-500/20 text-white font-medium cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-red-500/30 [data-theme=light]:bg-red-100 [data-theme=light]:text-[#181a1b] [data-theme=light]:border-red-300 [data-theme=light]:hover:bg-red-200"
              >
                <FaSignOutAlt size={24} />
                <span>Logout</span>
              </button>
            </div>
          </main>

          <footer className="mt-12 text-gray-400 [data-theme=light]:text-gray-500">
            <p className="text-sm">© 2024 Life Smart. All rights reserved.</p>
          </footer>
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Successfully Logged Out"
        message="Thank you for using LifeSmart. You have been successfully logged out."
        type="success"
      />
    </>
  );
};

export default SelectScreen;
