import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/auth';
import Login from './auth/Login';
import Register from './auth/Register';
import Modal from '../widgets/modals/Modal';

const HomeScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success',
  });

  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (currentUser && !authLoading) {
      setModalConfig({
        title: 'Welcome Back!',
        message: 'You have been automatically logged in.',
        type: 'success',
      });
      setModalOpen(true);
      setTimeout(() => {
        navigate('/select', { replace: true });
      }, 2000);
    }
  }, [currentUser, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900 [data-theme=light]:bg-gray-100">
        <div className="w-12 h-12 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin [data-theme=light]:border-gray-300 [data-theme=light]:border-t-indigo-500" />
      </div>
    );
  }

  if (currentUser) return null;

  const showSignInForm = () => {
    setIsSignInMode(true);
    setShowForm(true);
  };

  const showRegisterForm = () => {
    setIsSignInMode(false);
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-white bg-slate-900 font-['Poppins',sans-serif] [data-theme=light]:text-[#181a1b] [data-theme=light]:bg-gray-100">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] -top-[100px] -left-[100px] rounded-full blur-[60px] opacity-40 animate-homescreen-float bg-gradient-to-br from-indigo-500 to-violet-500 [data-theme=light]:from-indigo-200 [data-theme=light]:to-indigo-100"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute w-[600px] h-[600px] -bottom-[200px] -right-[100px] rounded-full blur-[60px] opacity-40 animate-homescreen-float bg-gradient-to-br from-pink-500 to-rose-500 [data-theme=light]:from-pink-200 [data-theme=light]:to-red-200"
          style={{ animationDelay: '-5s' }}
        />
        <div
          className="absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] opacity-40 animate-homescreen-float bg-gradient-to-br from-teal-500 to-sky-500 [data-theme=light]:from-teal-200 [data-theme=light]:to-sky-200"
          style={{ animationDelay: '-10s' }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-[1200px] mx-auto p-8 w-full">
        <header className="py-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold m-0 tracking-tight leading-none [data-theme=light]:text-[#181a1b]">
            <span className="text-white mr-1 [data-theme=light]:text-[#181a1b]">Life</span>
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent [data-theme=light]:from-indigo-400 [data-theme=light]:via-violet-400 [data-theme=light]:to-pink-400">
              Smart
            </span>
          </h1>
          <p className="text-xl font-light mt-4 opacity-80 [data-theme=light]:text-gray-600 [data-theme=light]:opacity-85">
            Your journey to financial wisdom begins here
          </p>
        </header>

        <main className="flex-1 flex justify-center items-center py-8">
          {!showForm ? (
            <div className="flex flex-col gap-6 w-full max-w-[320px]">
              <button
                onClick={showSignInForm}
                className="flex justify-between items-center px-6 py-4 rounded-xl border-none text-lg font-medium cursor-pointer transition-all text-white shadow-lg bg-gradient-to-br from-indigo-500 to-violet-500 hover:-translate-y-1 hover:shadow-indigo-500/30 [data-theme=light]:text-[#181a1b] [data-theme=light]:shadow-md [data-theme=light]:from-indigo-300 [data-theme=light]:to-indigo-200 [data-theme=light]:hover:from-indigo-400 [data-theme=light]:hover:to-indigo-300"
              >
                <span className="flex-1 text-center">Sign In</span>
                <span className="text-xl ml-2">→</span>
              </button>
              <button
                onClick={showRegisterForm}
                className="flex justify-between items-center px-6 py-4 rounded-xl border-none text-lg font-medium cursor-pointer transition-all text-white shadow-lg bg-gradient-to-br from-pink-500 to-rose-500 hover:-translate-y-1 hover:shadow-pink-500/30 [data-theme=light]:text-[#181a1b] [data-theme=light]:shadow-md [data-theme=light]:from-pink-300 [data-theme=light]:to-red-200 [data-theme=light]:hover:from-pink-400 [data-theme=light]:hover:to-red-300"
              >
                <span className="flex-1 text-center">Register</span>
                <span className="text-xl ml-2">+</span>
              </button>
            </div>
          ) : (
            isSignInMode ? <Login onClose={closeForm} /> : <Register onClose={closeForm} />
          )}
        </main>

        <footer className="py-6 text-center">
          <p className="text-sm opacity-60 m-0 [data-theme=light]:text-gray-500">© 2024 Life Smart. All rights reserved.</p>
        </footer>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default HomeScreen;
