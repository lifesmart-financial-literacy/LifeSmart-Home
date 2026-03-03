import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Button } from '@/components/ui/button';

const LIFE_AREAS = [
  { label: 'Health & Well-being', prompt: 'More rest, exercise, meal prep or routine to boost energy?' },
  { label: 'Family & Connections', prompt: 'Could deeper, unhurried time strengthen key relationships?' },
  { label: 'Career & Income', prompt: 'Would extra hours let you pursue training or a passion project?' },
  { label: 'Lifestyle, Spending & Fun', prompt: 'If you had more free time, would you feel richer experiences?' },
  { label: 'Housing, Safety & Security', prompt: 'With time to organise, maintain or move, would you feel safer?' },
  { label: 'Giving & Contribution', prompt: 'How much more impact could extra volunteer hours create?' },
  { label: 'Growth & Purpose', prompt: 'Could quiet blocks for reading or reflection fuel personal growth?' },
];

const Page4 = ({ baseScores = [], onFinish, onStepChange }) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [newScores, setNewScores] = useState(Array(LIFE_AREAS.length).fill(5));
  const [revealed, setRevealed] = useState(1);

  useEffect(() => {
    if (onStepChange && tutorialStep > 0) onStepChange(revealed);
  }, [revealed, onStepChange, tutorialStep]);

  const handleSliderChange = (idx, value) => {
    const updated = [...newScores];
    updated[idx] = value;
    setNewScores(updated);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (tutorialStep === 0) {
      setTutorialStep(1);
      return;
    }
    if (revealed < LIFE_AREAS.length) {
      setRevealed(revealed + 1);
    } else {
      if (onFinish) onFinish(newScores);
    }
  };

  const cardColorClass = (idx) => (idx % 3 === 0 ? 'lifebalance-card-dark' : idx % 3 === 1 ? 'lifebalance-card-green' : 'lifebalance-card-pink');

  if (tutorialStep === 0) {
    return (
      <form onSubmit={handleNext} className="flex flex-col items-center w-full text-white min-h-[600px] relative">
        <h2 className="mb-10 text-3xl font-semibold text-center">
          <span className="text-[#97A1FF] font-semibold">Now imagine if you had</span>
          <span className="text-white font-normal"> an extra 12 hours of </span>
          <br />
          <span className="text-[#97A1FF] font-semibold">free time</span>
          <span className="text-white font-normal"> every week.</span>
        </h2>
        <div className="flex flex-col gap-12 w-full max-w-[500px] mx-auto mb-10">
          <div className="w-full p-6 pb-6 rounded-[17px] flex flex-col items-center border border-white/40 bg-gradient-to-b from-[rgba(30,33,53,0.3)] to-[rgba(93,93,97,0.3)] shadow-[0_2px_16px_rgba(0,0,0,0.18)] lifebalance-card-dark">
            <div className="flex flex-col items-center w-full gap-3 mt-0 mb-2 relative min-h-[90px]">
              <div className="relative w-full h-11">
                <ReactSlider
                  min={0}
                  max={10}
                  value={4}
                  disabled
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
        </div>
        <div className="lifebalance-tutorial-text">
          <div className="lifebalance-tutorial-arrow">
            <svg width="111" height="157" viewBox="-40 0 111 117" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 115 C-40 0, 40 0, 20 -3" stroke="#fff" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse" markerUnits="strokeWidth">
                  <polygon points="0 0, 8 4, 0 8" fill="#fff" transform="rotate(110 4 4)" />
                </marker>
              </defs>
            </svg>
          </div>
          <div className="lifebalance-tutorial-content">
            <div className="lifebalance-tutorial-main">
              Slide to rate each part of your life from
              <br />
              <b>0 (needs work) to 10 (thriving).</b>
            </div>
            <div className="lifebalance-tutorial-sub">Use the prompts to think deeply about the impact that extra time could have.</div>
          </div>
        </div>
        <Button type="submit" className="absolute right-10 bottom-10 z-[100] bg-gradient-to-b from-[#B79BFF] to-[#4E3BD3] hover:from-[#c4afff] hover:to-[#5e4bdd] text-white font-semibold px-12 py-4 rounded-xl border border-[#8872C6] shadow-md hover:-translate-y-0.5">
          Let's start
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleNext} className="flex flex-col items-center w-full text-white min-h-[600px] relative">
      <h2 className="mb-6 text-3xl font-semibold text-center">
        Ask yourself, how would more time affect these <br />
        parts of your life?
      </h2>
      <p className="mb-8 text-xl font-light text-center leading-8">
        Now <b>slide</b> to rate what you think your score in each factor will be from <br />
        <span className="italic font-semibold">0 (needs work) to 10 (thriving).</span>
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
                <div className="text-center text-[1.1rem] font-semibold text-[#bdbdbd] mb-1 mt-2">Previous Selection</div>
                <div className="flex flex-col items-center w-full gap-3 mt-2 mb-2 relative min-h-[90px]">
                  <div className="relative w-full h-11">
                    <ReactSlider
                      min={0}
                      max={10}
                      value={typeof baseScores[idx] === 'number' ? baseScores[idx] : 0}
                      disabled
                      className="lifebalance-slider lifebalance-prev-slider"
                      thumbClassName="lifebalance-slider-thumb lifebalance-prev-thumb"
                      trackClassName="lifebalance-slider-track"
                      renderThumb={(props, state) => (
                        <div {...props} className="lifebalance-slider-thumb lifebalance-prev-thumb">
                          <span className="lifebalance-slider-value lifebalance-prev-value">{state.valueNow}</span>
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
                <div className="flex flex-col items-center w-full gap-3 mt-5 mb-2 relative min-h-[90px]">
                  <div className="relative w-full h-11">
                    <ReactSlider
                      min={0}
                      max={10}
                      value={newScores[idx]}
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
        className="absolute right-10 bottom-10 z-[100] mt-10 mb-6 bg-gradient-to-b from-[#B79BFF] to-[#4E3BD3] hover:from-[#c4afff] hover:to-[#5e4bdd] text-white font-semibold px-12 py-4 rounded-xl border border-[#8872C6] shadow-md hover:-translate-y-0.5"
      >
        {revealed < LIFE_AREAS.length ? 'Next' : 'Finish'}
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

export default Page4;
