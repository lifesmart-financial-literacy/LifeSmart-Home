import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const WelcomePage = ({ onNext }) => {
  const [showJourneyScreen, setShowJourneyScreen] = useState(false);

  if (showJourneyScreen) {
    return (
      <div className="flex flex-col justify-center items-center gap-8 h-[60vh] text-center p-8">
        <h1 className="text-3xl font-bold text-[#97A1FF] m-0">Are you ready?</h1>
        <p className="text-white max-w-[400px] text-2xl leading-8 m-0">
          This takes less than 3 minutes. No right answers.
          <br />
          Just honest reflection.
        </p>
        <Button
          onClick={onNext}
          className="bg-gradient-to-b from-[#B79BFF] to-[#4E3BD3] hover:from-[#c4afff] hover:to-[#5e4bdd] text-white font-semibold px-12 py-4 rounded-xl border border-[#8872C6] shadow-md hover:-translate-y-0.5 hover:shadow-lg"
        >
          Start my journey
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center text-white p-8">
      <h1 className="text-3xl font-bold text-[#97A1FF] mb-6">Welcome to Life Balance</h1>

      <div className="flex flex-col gap-10 items-center">
        <p className="text-xl leading-8 text-[#BDBDBD] max-w-[650px] mx-auto">
          In just a few minutes, you'll map the key areas of your life — and discover how your{' '}
          <span className="text-[#97A1FF]">time and money</span> influence each one.
        </p>

        <div className="flex flex-col gap-6 w-full max-w-[600px]">
          <div className="p-6 rounded-2xl text-left border border-white/10 bg-gradient-to-b from-orange-500/30 to-amber-900/30 border-orange-600/50">
            <h2 className="text-2xl font-bold text-[#FF9264] mb-3 text-center uppercase tracking-wide">Why it matters</h2>
            <p className="text-[#E0E0E0] text-xl leading-8 text-center m-0">Clearer picture = smarter financial decisions</p>
          </div>
          <div className="p-6 rounded-2xl text-left border border-white/10 bg-gradient-to-b from-emerald-400/30 to-emerald-900/30 border-teal-500/50">
            <h2 className="text-2xl font-bold text-[#64FFD0] mb-3 text-center uppercase tracking-wide">What you'll get</h2>
            <p className="text-[#E0E0E0] text-xl leading-8 text-center m-0">
              A personalized LifeBalance Snapshot to guide your financial-literacy journey and build a life that reflects your values.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowJourneyScreen(true)}
          variant="outline"
          className="mt-4 bg-gradient-to-b from-[#1C1E32] to-[#555B98] border-white/15 text-white font-semibold px-11 py-4 rounded-xl hover:from-[#2b2e4a] hover:to-[#676cba] hover:-translate-y-0.5"
        >
          Lets Begin
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
