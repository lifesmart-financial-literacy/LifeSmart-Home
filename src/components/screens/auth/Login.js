import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../firebase/auth';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/initFirebase';
import Modal from '../../widgets/modals/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'success' });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();

  const updateLoginStreak = async (userId) => {
    try {
      const streakRef = doc(db, userId, 'Login Streak');
      const streakDoc = await getDoc(streakRef);
      const now = new Date();
      const currentDate = now.toISOString();

      if (streakDoc.exists()) {
        const { lastLogin, streak } = streakDoc.data();
        const lastLoginDate = new Date(lastLogin);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastDay = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
        const daysDiff = Math.floor((today.getTime() - lastDay.getTime()) / (1000 * 3600 * 24));

        const newStreak = daysDiff === 1 ? streak + 1 : daysDiff === 0 ? streak : 1;
        await setDoc(streakRef, { lastLogin: currentDate, streak: newStreak });
      } else {
        await setDoc(streakRef, { lastLogin: currentDate, streak: 1 });
      }
    } catch (error) {
      console.error('Error updating login streak:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signIn(email, password);
      await updateLoginStreak(user.uid);
      setModalConfig({ title: 'Welcome Back!', message: 'You have successfully signed in.', type: 'success' });
      setModalOpen(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/select', { replace: true });
    } catch (error) {
      setModalConfig({ title: 'Authentication Error', message: error.message, type: 'error' });
      setModalOpen(true);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      const user = provider === 'google' ? await signInWithGoogle() : await signInWithApple();
      await updateLoginStreak(user.uid);
      setModalConfig({ title: 'Welcome!', message: `You have successfully signed in with ${provider}.`, type: 'success' });
      setModalOpen(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/select', { replace: true });
    } catch (error) {
      setModalConfig({ title: 'Authentication Error', message: error.message, type: 'error' });
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="w-full max-w-[420px]">
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/10 shadow-xl [data-theme=light]:bg-white/95 [data-theme=light]:border-gray-200 [data-theme=light]:shadow-lg animate-in fade-in duration-500"
        >
          <h2 className="text-white text-2xl font-semibold mb-6 text-center [data-theme=light]:text-[#181a1b]">
            Welcome Back
          </h2>

          <div className="flex flex-col gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignIn('google')}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white font-medium cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-0.5 w-full [data-theme=light]:bg-white [data-theme=light]:text-gray-800 [data-theme=light]:border-gray-200 [data-theme=light]:hover:bg-gray-50"
            >
              <FaGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn('apple')}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-black text-white font-medium cursor-pointer transition-all hover:bg-gray-900 hover:-translate-y-0.5 w-full"
            >
              <FaApple className="w-5 h-5" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="flex items-center my-6 text-white/50 [data-theme=light]:text-gray-400">
            <div className="flex-1 border-b border-white/10 [data-theme=light]:border-gray-200" />
            <span className="px-4 text-sm">or</span>
            <div className="flex-1 border-b border-white/10 [data-theme=light]:border-gray-200" />
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white/80 [data-theme=light]:text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40 [data-theme=light]:bg-gray-100 [data-theme=light]:text-[#181a1b] [data-theme=light]:border-gray-200 [data-theme=light]:placeholder:text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white/80 [data-theme=light]:text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40 [data-theme=light]:bg-gray-100 [data-theme=light]:text-[#181a1b] [data-theme=light]:border-gray-200 [data-theme=light]:placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 [data-theme=light]:from-indigo-300 [data-theme=light]:to-indigo-200 [data-theme=light]:hover:from-indigo-400 [data-theme=light]:hover:to-indigo-300"
            >
              Sign In
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full border-white/20 [data-theme=light]:border-gray-200 [data-theme=light]:text-[#181a1b]">
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalConfig.title} message={modalConfig.message} type={modalConfig.type} />
    </>
  );
};

export default Login;
