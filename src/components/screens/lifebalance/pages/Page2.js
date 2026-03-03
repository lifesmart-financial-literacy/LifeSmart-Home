import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Button } from '@/components/ui/button';

const LIFE_AREAS = [
  { label: 'Health & Well-being', prompt: 'How am I doing mentally and physically?' },
  { label: 'Family & Connections', prompt: 'Do I have people I rely on and who rely on me?' },
  { label: 'Career & Income', prompt: 'Do I earn enough for the life I want, in a career that feels right?' },
  { label: 'Lifestyle, Spending & Fun', prompt: 'Do I spend intentionally on joy, or just impulse?' },
  { label: 'Housing, Safety & Security', prompt: 'Does my living situation support or stress me?' },
  { label: 'Giving & Contribution', prompt: 'Do I give time or money to causes I care about?' },
  { label: 'Personal Growth & Purpose', prompt: 'Am I learning and moving toward my purpose?' },
];

const Page2 = ({ onSubmit, onStepChange }) => {
  const [scores, setScores] = useState(Array(LIFE_AREAS.length).fill(5));
  const [revealed, setRevealed] = useState(1);

  React.useEffect(() => {
    if (onStepChange) onStepChange(revealed);
  }, [revealed, onStepChange]);

  const handleSliderChange = (idx, value) => {
    const newScores = [...scores];
    newScores[idx] = value;
    setScores(newScores);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (revealed < LIFE_AREAS.length) {
      setRevealed(revealed + 1);
    } else {
      if (onSubmit) onSubmit(scores);
    }
  };

  const cardColorClass = (idx) => (idx % 3 === 0 ? 'lifebalance-card-dark' : idx % 3 === 1 ? 'lifebalance-card-green' : 'lifebalance-card-pink');

  return (
    <form onSubmit={handleNext} className="flex flex-col items-center w-full text-white min-h-[600px] relative">
      <h2 className="mb-4 text-3xl font-semibold text-center text-white tracking-wide">How are you really doing - right now?</h2>
      <p className="mb-8 text-xl font-light text-center text-white leading-8">
        Slide to rate each part of your life from<br />
        <span className="font-medium">0 <i>(needs attention)</i> to 10 <i>(doing great)</i>.</span>
      </p>
      <div className="flex flex-col gap-12 w-full max-w-[700px] mx-8 my-8 mb-10 relative" style={{ minHeight: '340px' }}>
        <TransitionGroup>
          {LIFE_AREAS.slice(0, revealed).map((area, idx) => (
            <CSSTransition key={area.label} timeout={400} classNames="slide-card">
              <div
                className={`w-full p-6 pb-6 rounded-[17px] flex flex-col items-center mb-6 border border-white/40 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_20px_rgba(169,156,255,0.2)] hover:border-[rgba(169,156,255,0.6)] transition-all cursor-pointer ${cardColorClass(idx)} ${idx % 3 === 0 ? 'bg-gradient-to-b from-[rgba(30,33,53,0.3)] to-[rgba(93,93,97,0.3)]' : idx % 3 === 1 ? 'bg-gradient-to-b from-[rgba(112,196,142,0.2)] to-[rgba(14,76,47,0.2)]' : 'bg-gradient-to-b from-[rgba(255,176,188,0.2)] to-[rgba(246,111,149,0.186)]'} shadow-[0_2px_16px_rgba(0,0,0,0.18)]`}
              >
                <div className={`text-2xl font-bold text-center mb-2 ${idx % 3 === 0 ? 'text-[#A99CFF]' : idx % 3 === 1 ? 'text-[#97FFE8]' : 'text-[#FFB398]'}`}>{area.label}</div>
                <div className="text-xl text-center text-white mb-4">{area.prompt}</div>
                <div className="flex flex-col items-center w-full gap-3 mt-5 mb-2 relative min-h-[90px]">
                  <div className="absolute w-[70%] left-[14%] top-5 h-10 pointer-events-none z-[3] flex flex-col items-center">
                    <div className="absolute left-0 flex flex-col items-center">
                      <div className="w-px h-11 bg-[#E0E0E0] rounded-sm" />
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#E0E0E0]" />
                    </div>
                    <div className="absolute right-0 flex flex-col items-center">
                      <div className="w-px h-11 bg-[#E0E0E0] rounded-sm" />
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#E0E0E0]" />
                    </div>
                  </div>
                  <div className="relative w-full h-11">
                    <ReactSlider
                      min={0}
                      max={10}
                      value={scores[idx]}
                      onChange={(val) => handleSliderChange(idx, val)}
                      className="lifebalance-slider"
                      thumbClassName="lifebalance-slider-thumb"
                      trackClassName="lifebalance-slider-track"
                      renderThumb={(props, state) => (
                        <div {...props} className="lifebalance-slider-thumb">
                          <span className="lifebalance-slider-value">{state.valueNow}</span>
                        </div>
                      )}
                      renderTrack={(props, state) => (
                        <div {...props} className={`lifebalance-slider-track ${state.index === 0 ? 'filled' : 'unfilled'}`} />
                      )}
                    />
                  </div>
                  <div className="absolute bottom-[-1rem] w-[80%] left-[10%] flex justify-between pointer-events-none text-[#E0E0E0] text-base">
                    <span>Needs work (0)</span>
                    <span>Thriving (10)</span>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <Button
        type="submit"
        className="absolute right-10 bottom-10 z-10 mt-10 mb-6 bg-gradient-to-b from-[#B79BFF] to-[#4E3BD3] hover:from-[#c4afff] hover:to-[#5e4bdd] text-white font-semibold px-12 py-4 rounded-xl border border-[#8872C6] shadow-md hover:-translate-y-0.5"
      >
        {revealed < LIFE_AREAS.length ? 'Next' : 'Complete'}
      </Button>
      {revealed === 1 && (
        <div className="mt-10 mb-2 text-center text-white text-[1.05rem]">
          <b>Remember</b>
          <br />
          Let the question under each heading guide your reflection
          <br />
          <span className="text-[#A99CFF] italic font-normal">There are no right answers here.</span>
        </div>
      )}
    </form>
  );
};

export default Page2;
