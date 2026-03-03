import React, { useState, useEffect, useRef } from 'react';
import QuestionHeader from './QuestionHeader';

const Question3 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const [showWhy, setShowWhy] = useState(false);
  const whyRef = useRef(null);

  // Points mapping: A=1, B=4, C=0, D=3, E=2
  const pointsMapping = { A: 1, B: 4, C: 0, D: 3, E: 2 };
  const correctAnswer = 'B';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => pointsMapping[answer] || 0);
    onAwardPoints(pointsArray);
  };

  const nextQuestion = () => {
    onNextQuestion();
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <>
    <QuestionHeader />
    <div className="min-h-screen w-screen max-w-none m-0 bg-[#0D0021] relative overflow-x-hidden font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white block p-0">
      {/* Floating Planets - use fq- prefixed classes from index.css */}
      <img src="/financeQuest/celestialBodies/Earth.png" alt="Earth" className="fq-planet fq-planet-earth" />
      <img src="/financeQuest/celestialBodies/Moon.png" alt="Moon" className="fq-planet fq-planet-moon" />
      <img src="/financeQuest/celestialBodies/Mars.png" alt="Mars" className="fq-planet fq-planet-mars" />
      {/* Top Bar Row */}
      <div className="bg-[#0D0021] pt-12 w-screen max-w-none m-0 flex flex-row items-center justify-center gap-12 z-[5] relative left-0">
        <div className="flex items-center gap-2 bg-[#1F0149] border-2 border-white rounded px-[10px] py-1.5 pr-[18px] text-[1.1rem] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white">
          <img src="/financeQuest/icons/8bitLightning.png" alt="Lightning Bolt" className="w-[22px] h-[22px] mr-1.5" />
          <span className="text-white font-inherit text-[1.1rem] tracking-wide">4 points</span>
        </div>
        <div className="text-[2.3rem] text-[#FF9524] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] tracking-[2px] [text-shadow:0_2px_0_#000,0_0_8px_rgba(255,149,36,0.67)] font-bold text-center mx-6">
          CHALLENGE 3
        </div>
        <div className="relative inline-block min-w-[120px] h-16">
          {!timerStarted ? (
            <button onClick={startTimer} className="min-w-0 w-40 h-10 flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-0 py-0 px-4 transition-[box-shadow,border,opacity] duration-180 cursor-pointer outline-none relative border-none text-[1.3rem]">
              <span className="text-[1.3rem] tracking-[2px] [text-shadow:0_2px_0_rgba(0,0,0,0.67)] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white flex items-center">
                {minutes}:{seconds < 10 ? '0' + seconds : seconds}
              </span>
              <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="w-12 h-12 ml-2.5 -mr-5 pointer-events-none inline-block align-middle" />
            </button>
          ) : (
            <div className="min-w-0 w-40 h-10 flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-0 py-0 px-4 opacity-70 cursor-default relative border-none text-[1.3rem]">
              <span className="text-[1.3rem] tracking-[2px] [text-shadow:0_2px_0_rgba(0,0,0,0.67)] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white flex items-center">
                {minutes}:{seconds < 10 ? '0' + seconds : seconds}
              </span>
              <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="w-12 h-12 ml-2.5 -mr-5 pointer-events-none inline-block align-middle" />
            </div>
          )}
        </div>
      </div>

      {/* Main Card/Story Box */}
      <div className="w-full max-w-[900px] mx-auto flex flex-col items-center">
        <div className="bg-[#1C0032] rounded-[10px] m-8 shadow-[0_2px_0_rgba(0,0,0,0.5)] border-2 border-white/33 w-[calc(100%-64px)] max-w-[800px] z-[2] relative pb-6">
          <div className="flex flex-row items-center justify-between h-8 px-4 text-white text-[1.3rem] opacity-70 tracking-[2px] border-b-2 border-white/33">
            <span className="text-[1.5rem] opacity-70 tracking-[2px]">&hellip;</span>
            <span className="text-[1.5rem] opacity-70 cursor-default">&#10005;</span>
          </div>
          <div className="font-['Montserrat',Arial,sans-serif] text-[1.15rem] text-white leading-[2.1] text-center pt-8 px-8 font-medium">
            Zara wants to <b>buy her own Mars-Rover scooter (6,000 MC)</b>. She has <b>120 MC left over each month</b>, so it will take her years to save up.<br /><br />
            She thinks of <b>5 ideas</b> to help her reach the goal faster.
          </div>
        </div>

        <div className="font-['Montserrat',Arial,sans-serif] text-[22px] font-semibold text-white mb-8 text-center">
          Which one is the <span className="text-[#CA70E3]">smartest</span> and most <span className="text-[#CA70E3]">realistic choice?</span>
        </div>

        {/* Choices */}
        <div className="w-full max-w-[800px] flex flex-col gap-[18px] mb-10">
          <div className="bg-[#2D0245] border-[1.5px] border-white/40 rounded-[10px] py-[18px] px-6 font-['Montserrat',Arial,sans-serif] text-[18px] text-white flex items-center gap-4">
            <span className="bg-[#8B1264] text-white rounded-full w-9 h-9 flex items-center justify-center font-['Thertole','VT323','Consolas',monospace] text-2xl mr-4">A</span>
            Stop spending on fun. Saves 180 MC/month.
          </div>
          {showResults ? (
            <>
              <div className="bg-[#0B5C4B] border-[1.5px] border-[#0B5C4B] rounded-[10px] py-[18px] px-6 font-['Montserrat',Arial,sans-serif] text-[1.15rem] text-white flex items-center gap-4 font-bold mb-[18px]">
                <span className="bg-[#1FC77A] text-white rounded-full w-8 h-8 flex items-center justify-center font-['Thertole','VT323','Consolas',monospace] text-xl mr-4 font-bold">B</span>
                <b>Pay 500 MC for a 2-month skills course that leads to a pay rise.</b>
              </div>
              <button className="block w-[420px] max-w-[90vw] mx-auto mt-8 py-[18px] bg-[#33005F] text-white border-2 border-white rounded-lg font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-[1.3rem] tracking-[2px] uppercase text-center [text-shadow:0_2px_0_rgba(255,255,255,0.5)] cursor-pointer transition-[background,color,border] duration-180 hover:bg-[#CA70E3] hover:text-white hover:border-white" onClick={() => {
                setShowWhy(true);
                setTimeout(() => {
                  if (whyRef.current) {
                    whyRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 50);
              }}>WANT TO KNOW WHY?</button>
            </>
          ) : (
            <div className="bg-[#2D0245] border-[1.5px] border-white/40 rounded-[10px] py-[18px] px-6 font-['Montserrat',Arial,sans-serif] text-[18px] text-white flex items-center gap-4">
              <span className="bg-[#8B1264] text-white rounded-full w-9 h-9 flex items-center justify-center font-['Thertole','VT323','Consolas',monospace] text-2xl mr-4">B</span>
              Pay 500 MC for a 2-month skills course that leads to a pay rise.
            </div>
          )}
          <div className="bg-[#2D0245] border-[1.5px] border-white/40 rounded-[10px] py-[18px] px-6 font-['Montserrat',Arial,sans-serif] text-[18px] text-white flex items-center gap-4">
            <span className="bg-[#8B1264] text-white rounded-full w-9 h-9 flex items-center justify-center font-['Thertole','VT323','Consolas',monospace] text-2xl mr-4">C</span>
            Borrow 3,000 MC from cousin to invest in risky RedDustCoin.
          </div>
          <div className="bg-[#2D0245] border-[1.5px] border-white/40 rounded-[10px] py-[18px] px-6 font-['Montserrat',Arial,sans-serif] text-[18px] text-white flex items-center gap-4">
            <span className="bg-[#8B1264] text-white rounded-full w-9 h-9 flex items-center justify-center font-['Thertole','VT323','Consolas',monospace] text-2xl mr-4">D</span>
            Use weekends to earn 500 MC/month doing freelance tech support.
          </div>
          <div className="bg-[#2D0245] border-[1.5px] border-white/40 rounded-[10px] py-[18px] px-6 font-['Montserrat',Arial,sans-serif] text-[18px] text-white flex items-center gap-4">
            <span className="bg-[#8B1264] text-white rounded-full w-9 h-9 flex items-center justify-center font-['Thertole','VT323','Consolas',monospace] text-2xl mr-4">E</span>
            Use weekends to earn 500 MC/month doing freelance tech support.
          </div>
        </div>

        {/* Team Answers */}
        {!showResults ? (
          <div className="w-full max-w-[800px] mx-auto mb-8">
            <div className="font-['Montserrat',Arial,sans-serif] text-xl font-semibold text-white mb-4 text-center">
              Select your <span className="text-[#CA70E3]">answers</span>
            </div>
            <div className="flex flex-row gap-8 justify-center items-center">
              {teams.map((team, index) => (
                <div key={team.name} className="flex flex-col items-center min-w-[120px]">
                  <div className="font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-lg mb-2 text-center max-w-[160px] break-words whitespace-normal overflow-visible [text-overflow:unset] leading-tight min-h-[2.6em] inline-block">{index + 1}. {team.name}</div>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="w-[120px] text-lg rounded-md border-[1.5px] border-[#C77DFF] bg-[#1C0032] text-white font-['Montserrat',Arial,sans-serif] py-2 px-3 mb-2"
                  >
                    <option value="">Select one</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              ))}
            </div>
            <button
              className="mx-auto mt-8 block w-[200px] bg-white text-[#1C0032] border-2 border-[#C77DFF] rounded-lg font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-lg py-3 cursor-pointer shadow-[0_2px_8px_rgba(199,125,255,0.27)] transition-[background,color] duration-200 disabled:bg-[#ccc] disabled:text-[#888] disabled:cursor-not-allowed"
              onClick={submitAnswers}
              disabled={teamAnswers.some(answer => !answer)}
            >
              SUBMIT
            </button>
          </div>
        ) : (
          <div className="w-full max-w-[800px] mx-auto mt-8 bg-[#1C0032] rounded-2xl p-8 text-white shadow-[0_4px_32px_rgba(0,0,0,0.67)] text-center">
            <div className="font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-[22px] text-[#FF9524] mb-4">
              Correct Answer: B
            </div>
            <div className="font-['Montserrat',Arial,sans-serif] text-lg text-white mb-6">
              Pay 500 MC for a 2-month skills course that leads to a pay rise.
            </div>
            <div className="flex flex-row gap-8 justify-center items-center mb-6">
              {teams.map((team, index) => (
                <div key={team.name} className="flex flex-col items-center min-w-[120px]">
                  <div className="font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-lg mb-2 text-center max-w-[160px] break-words whitespace-normal overflow-visible [text-overflow:unset] leading-tight min-h-[2.6em] inline-block">{index + 1}. {team.name}</div>
                  <div className={`w-[70px] h-[70px] rounded-2xl flex items-center justify-center text-[32px] font-bold mb-0 mt-0 ${teamAnswers[index] === correctAnswer ? 'bg-[#B3E3D3] text-[#1e3a8a] border-2 border-[#7fc8b2]' : 'bg-[#FF6B6B]/60 text-[#b91c1c] border-2 border-[#b91c1c]/20'}`}>
                    {teamAnswers[index] || '-'}
                  </div>
                  <div className="font-['Montserrat',Arial,sans-serif] text-base text-white mt-2">
                    {pointsMapping[teamAnswers[index]] || 0} points
                  </div>
                </div>
              ))}
            </div>
            <button className="mx-auto mt-8 block w-[200px] bg-[#FF9524] text-white border-none rounded-lg font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-lg py-3 cursor-pointer shadow-[0_2px_8px_rgba(255,149,36,0.27)] transition-[background,color] duration-200 disabled:bg-[#ccc] disabled:text-[#888] disabled:cursor-not-allowed" onClick={nextQuestion}>NEXT</button>
          </div>
        )}
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.2)] w-[500px] text-center">
            <h3 className="text-[1.8rem] mb-2.5 text-black">Hint</h3>
            <p className="text-[1.2rem] mb-5 text-[#333]">Think about which option gives Zara a permanent, sustainable increase in her ability to save for her goal, without risky debt or extreme sacrifice.</p>
            <button onClick={() => setShowHintModal(false)} className="bg-[#3b82f6] text-white border-none py-2.5 px-5 rounded-md cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {showWhy && (
        <div ref={whyRef} className="mt-12 mx-auto text-left w-full max-w-[800px] font-['Montserrat',Arial,sans-serif]">
          <div className="font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white text-[1.2rem] uppercase mb-[18px] ml-0 tracking-wide">THE&nbsp;WHY</div>
          <div className="text-white text-[1.1rem] ml-0 text-left font-['Montserrat',Arial,sans-serif] leading-[1.7]">
            Option B wins because spending money on an up-skilling course creates a permanent pay-rise, giving Zara more income every month without risky debt or extreme lifestyle cuts. The other choices either rely on unsustainable sacrifice (A), high risk and borrowing (C), extra time and limited scale (D), or small savings that take longer to reach the goal (E).
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Question3;
