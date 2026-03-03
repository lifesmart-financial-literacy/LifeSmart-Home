import React from 'react';
import { useNavigate } from 'react-router-dom';
import lifesmartlogo from '../../assets/icons/LifeSmartLogo.png';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="px-8 py-4 bg-white shadow-sm">
        <img src={lifesmartlogo} alt="LifeSmart Logo" className="h-10 object-contain" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-slate-700 m-0 leading-none bg-gradient-to-br from-slate-700 to-blue-600 bg-clip-text text-transparent animate-fade-in">
          404
        </h1>
        <h2 className="text-xl md:text-3xl text-slate-600 mt-4 animate-slide-up animation-delay-300">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-500 mb-8 max-w-[600px] animate-slide-up animation-delay-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="animate-slide-up animation-delay-900 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
