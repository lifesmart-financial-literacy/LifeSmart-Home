import React from 'react';
import { FaWallet, FaHome, FaChartBar } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const Startquiz = ({ onStartQuiz }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/70 to-[rgba(10,33,55,0.8)] text-white flex flex-col relative overflow-hidden">
      <div className="absolute w-[420px] h-[380px] -top-[120px] left-[calc(100vw-120px)] bg-[rgba(84,255,41,1)] blur-[200px] opacity-50 rounded-full rotate-[87.72deg] pointer-events-none z-[1]" />
      <div className="flex items-center justify-start ml-[150px] pt-12 h-20">
        <img src={process.env.PUBLIC_URL + '/logo/LifeSmartSessionsWhite.png'} alt="LifeSmart Logo" className="w-[300px] h-[100px]" />
      </div>
      <div className="flex-1 flex flex-row items-center justify-center p-0 mt-0 min-h-0 max-lg:flex-col max-lg:items-center max-lg:justify-start max-lg:pt-10">
        <div className="min-w-[420px] flex flex-col items-start justify-center mr-20 max-lg:mr-0 max-lg:items-center max-lg:text-center">
          <h1 className="text-3xl font-bold italic text-[rgba(115,228,138,1)] mb-7 mt-0 tracking-wide leading-tight">
            Take the Quiz - Take Control of Your Finances
          </h1>
          <p className="text-[1.35rem] text-[#e6e6e6] mb-12 leading-relaxed max-w-[720px]">
            Learn to manage your money with confidence. LifeSmart's Financial Quiz helps you test your knowledge and build smarter financial habits—one question at a time.
          </p>
          <Button
            onClick={onStartQuiz}
            className="bg-gradient-to-r from-[#73E48A] to-[#00A120] border border-[rgba(84,255,41,1)] text-white text-xl font-bold rounded-[32px] px-14 py-5 shadow-[0_4px_24px_rgba(30,215,96,0.18)] hover:from-[#8DF5A1] hover:to-[#00B728] hover:shadow-[0_8px_32px_rgba(30,215,96,0.3)] hover:-translate-y-0.5 transition-all mt-[18px]"
          >
            START QUIZ
          </Button>
        </div>
        <div className="relative min-w-[540px] w-[540px] h-[400px] flex items-center justify-center max-lg:mt-10">
          <div className="absolute top-0 left-[170px] z-[3] w-[220px] h-[220px] rounded-[28px] flex flex-col items-start justify-start shadow-[0_8px_32px_rgba(0,0,0,0.13)] bg-[rgba(123,252,90,0.61)] text-[rgba(16,33,13,1)]">
            <FaWallet size={48} className="mt-8 ml-8" />
            <div className="mt-[22px] ml-[22px] text-[1.32rem] font-semibold">Budget</div>
          </div>
          <div className="absolute top-[120px] left-10 z-[2] w-[220px] h-[220px] rounded-[28px] flex flex-col items-start justify-start shadow-[0_8px_32px_rgba(0,0,0,0.13)] bg-[rgba(254,214,214,0.25)] text-white">
            <FaHome size={48} className="mt-8 ml-8" />
            <div className="mt-[22px] ml-[22px] text-[1.32rem] font-semibold">Mortgage</div>
          </div>
          <div className="absolute top-[220px] left-[260px] z-[1] w-[220px] h-[220px] rounded-[28px] flex flex-col items-start justify-start shadow-[0_8px_32px_rgba(0,0,0,0.13)] bg-white/70 text-[rgba(16,33,13,1)]">
            <FaChartBar size={48} className="mt-8 ml-8" />
            <div className="mt-[22px] ml-[22px] text-[1.32rem] font-semibold">Investment</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Startquiz;
