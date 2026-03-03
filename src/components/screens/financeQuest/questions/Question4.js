/* eslint-disable no-unused-vars -- Question has placeholder functions for future glossary/hint features */
import React, { useState, useEffect, useRef } from 'react';

const PLANET_EARTH = '/financeQuest/celestialBodies/Earth.png';
const PLANET_MOON = '/financeQuest/celestialBodies/Moon.png';
const PLANET_MARS = '/financeQuest/celestialBodies/Mars.png';

const Question4 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverModal, setHoverModal] = useState({
    show: false,
    title: "",
    content: "",
    x: 0,
    y: 0,
  });
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const [showWhy, setShowWhy] = useState(false);
  const whyRef = useRef(null);

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
  const progressBarWidth = (timer / 180) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const showHoverModal = (title, content, event) => {
    if (!event) return;
    setHoverModal({
      show: true,
      title,
      content,
      x: event.clientX + 15,
      y: event.clientY + 15
    });
  };

  const hideHoverModal = () => {
    setHoverModal(prev => ({ ...prev, show: false }));
  };

  const openGlossary = (term) => {
    setShowGlossary(true);
    if (term === 'stocksFundPortfolio') {
      setGlossaryTitle('Stocks Fund Portfolio');
      setGlossaryContent('A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn\'t do well, others in the basket might still grow!');
    } else if (term === 'sAndP500') {
      setGlossaryTitle('S&P 500');
      setGlossaryContent('A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you\'re buying a little piece of each of those 500 companies.');
    } else if (term === 'annually') {
      setGlossaryTitle('Annually');
      setGlossaryContent('The return rate is calculated based on a yearly period. For example, an 8% annual return means an 8% increase over one year.');
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 3 : 0));
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <>
      <div className="min-h-screen w-screen bg-[#0D0021] relative overflow-x-hidden font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white block p-0">
        {/* Floating Planets - use fq- prefixed classes from index.css */}
        <img src={PLANET_EARTH} alt="Earth" className="fq-planet fq-planet-earth" />
        <img src={PLANET_MOON} alt="Moon" className="fq-planet fq-planet-moon" />
        <img src={PLANET_MARS} alt="Mars" className="fq-planet fq-planet-mars" />
        {/* Top Bar Row */}
        <div className="bg-[#0D0021] pt-12 w-screen max-w-none m-0 flex flex-row items-center justify-center gap-12 z-[5] relative left-0">
          <div className="flex items-center gap-2 bg-[#1F0149] border-2 border-white rounded px-[10px] py-1.5 pr-[18px] text-[1.1rem] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white">
            <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="w-[22px] h-[22px] mr-1.5" />
            <span className="text-white font-inherit text-[1.1rem] tracking-wide">3 points</span>
          </div>
          <div className="text-[2.3rem] text-[#FF9524] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] tracking-[2px] [text-shadow:0_2px_0_#000,0_0_8px_rgba(255,149,36,0.67)] font-bold text-center mx-6">
            CHALLENGE 4
          </div>
          <div className="relative inline-block min-w-[120px] h-16">
            {!timerStarted ? (
              <button onClick={startTimer} className="min-w-0 w-40 h-10 flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-0 py-0 px-4 transition-[box-shadow,border,opacity] duration-180 cursor-pointer outline-none relative border-none text-[1.3rem]">
                <span className="text-[1.3rem] tracking-[2px] [text-shadow:0_2px_0_rgba(0,0,0,0.67)] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white flex items-center">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="w-8 h-8 ml-2.5 mr-0 pointer-events-none inline-block align-middle" />
              </button>
            ) : (
              <div className="min-w-0 w-40 h-10 flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-0 py-0 px-4 opacity-70 cursor-default relative border-none text-[1.3rem]">
                <span className="text-[1.3rem] tracking-[2px] [text-shadow:0_2px_0_rgba(0,0,0,0.67)] font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-white flex items-center">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="w-8 h-8 ml-2.5 mr-0 pointer-events-none inline-block align-middle" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full max-w-[900px] mx-auto flex flex-col items-center">
          {/* Story Card */}
          <div className="bg-[#1C0032] rounded-[10px] mx-8 mt-8 shadow-[0_2px_0_rgba(0,0,0,0.5)] border-2 border-white/33 w-[calc(100%-64px)] max-w-[800px] z-[2] relative pb-6">
            <div className="flex flex-row items-center justify-between h-8 px-4 text-white text-[1.3rem] opacity-70 tracking-[2px] border-b-2 border-white/33">
              <span className="text-[1.5rem] opacity-70 tracking-[2px]">&hellip;</span>
              <span className="text-[1.5rem] opacity-70 cursor-default">&#10005;</span>
            </div>
            <div className="font-['Montserrat',Arial,sans-serif] text-[1.15rem] text-white leading-[2.1] text-center pt-8 px-8 font-medium">
              A meteor storm is coming. Zara <b>needs to build an emergency "Shield Fund."</b><br />
              How much should she set aside based on her costs?
            </div>
            <div className="mt-8 mx-auto w-full max-w-[600px] bg-[#270544] rounded-2xl py-6 pt-6 pb-3 shadow-[0_2px_0_rgba(0,0,0,0.5)]">
              <table className="w-full border-collapse text-white font-['Montserrat',Arial,sans-serif] text-[1.05rem] bg-none">
                <thead>
                  <tr>
                    <th className="font-bold text-white bg-none border-none py-2.5 px-2 text-[1.1rem]">Category</th>
                    <th className="font-bold text-white bg-none border-none py-2.5 px-2 text-[1.1rem]">Description</th>
                    <th className="font-bold text-white bg-none border-none py-2.5 px-2 text-[1.1rem]">Cost (MC)</th>
                    <th className="font-bold text-white bg-none border-none py-2.5 px-2 text-[1.1rem]">Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Habitat pod rent</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Includes air-recycling fee</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">1,150</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Need</td></tr>
                  <tr><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Life Support</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Food, water, basic utilities</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">900</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Want</td></tr>
                  <tr><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Colony Data plan</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Communicator & holo-net</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">210</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Want</td></tr>
                  <tr><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Exploration & Fun</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Holo-games subscription, eating out with friends</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">580</td><td className="text-white border-none border-b border-white/20 py-2.5 px-2 text-[1.05rem] text-left">Want</td></tr>
                  <tr><td className="text-white border-none py-2.5 px-2 text-[1.05rem] text-left">Safety Fund auto-transfer</td><td className="text-white border-none py-2.5 px-2 text-[1.05rem] text-left">Emergency Savings (20% of income target)</td><td className="text-white border-none py-2.5 px-2 text-[1.05rem] text-left">800</td><td className="text-white border-none py-2.5 px-2 text-[1.05rem] text-left">Savings</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Question Section */}
          <div className="font-['Montserrat',Arial,sans-serif] text-[22px] font-semibold text-white my-12 mb-8 text-center">
            Which one is the <span className="text-[#CA70E3]">smartest</span> and most <span className="text-[#CA70E3]">realistic choice?</span>
          </div>
          {/* Choices */}
          <div className="w-full max-w-[900px] flex flex-row gap-[18px] mb-10 justify-center">
            {['A', 'B', 'C', 'D', 'E'].map((letter, idx) => {
              const values = ['2,050 MC', '6,150 MC', '3,640 MC', '12,300 MC', '10,920 MC'];
              const isCorrect = letter === correctAnswer && showResults;
              return (
                <div
                  key={letter}
                  className={`bg-[#2D0245] border-[1.5px] border-white/40 py-[18px] px-6 font-['Montserrat',Arial,sans-serif] text-[1.15rem] text-white flex items-center gap-4 font-bold min-w-[180px] justify-center ${isCorrect ? '!bg-[#0B6B4F] !text-white !font-bold !border-2 !border-[#1DE782] shadow-[0_0_8px_rgba(29,231,130,0.33)]' : ''}`}
                  style={isCorrect ? { background: '#023B35', color: '#fff', fontWeight: 'bold', border: '2px solid #1DE782' } : {}}
                >
                  <span className={`rounded-full border-[2.5px] border-[#111] w-9 h-9 flex items-center justify-center font-['Thertole','VT323','Consolas',monospace] text-2xl mr-4 ${isCorrect ? '!bg-[#4ED47B] !text-white !font-bold shadow-[0_0_8px_rgba(78,212,123,0.33)]' : 'bg-[#8B1264] text-white'}`}>{letter}</span>{values[idx]}
                </div>
              );
            })}
          </div>
          {/* WANT TO KNOW WHY Button */}
          {showResults && !showWhy && (
            <button
              className="mx-auto mt-8 block bg-[#270544] text-white border-2 border-[#CA70E3] rounded-lg font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-lg py-3.5 px-8 cursor-pointer shadow-[0_2px_8px_rgba(202,112,227,0.27)] tracking-[2px] uppercase transition-[background,color,border] duration-180 hover:bg-[#CA70E3] hover:text-white hover:border-white"
              onClick={() => setShowWhy(true)}
            >
              WANT TO KNOW WHY?
            </button>
          )}
          {/* Team Answers/Results */}
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
                      className="w-[120px] text-lg rounded-md border-[1.5px] border-[#CA70E3] bg-[#1C0032] text-white font-['Montserrat',Arial,sans-serif] py-2 px-3 mb-2"
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
                className="mx-auto mt-8 block w-[200px] bg-white text-[#1C0032] border-2 border-[#CA70E3] rounded-lg font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-lg py-3 cursor-pointer shadow-[0_2px_8px_rgba(202,112,227,0.27)] transition-[background,color] duration-200 disabled:bg-[#ccc] disabled:text-[#888] disabled:cursor-not-allowed"
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
                6,150 MC
              </div>
              <div className="flex flex-row gap-8 justify-center items-center mb-6">
                {teams.map((team, index) => (
                  <div key={team.name} className="flex flex-col items-center min-w-[120px]">
                    <div className="font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-lg mb-2 text-center max-w-[160px] break-words whitespace-normal overflow-visible [text-overflow:unset] leading-tight min-h-[2.6em] inline-block">{index + 1}. {team.name}</div>
                    <div className={`w-[70px] h-[70px] rounded-2xl flex items-center justify-center text-[32px] font-bold mb-0 mt-0 ${teamAnswers[index] === correctAnswer ? 'bg-[#B3E3D3] text-[#1e3a8a] border-2 border-[#7fc8b2]' : 'bg-[#FF6B6B]/60 text-[#b91c1c] border-2 border-[#b91c1c]/20'}`}>
                      {teamAnswers[index] || '-'}
                    </div>
                    <div className="font-['Montserrat',Arial,sans-serif] text-base text-white mt-2">
                      {teamAnswers[index] === correctAnswer ? 3 : 0} points
                    </div>
                  </div>
                ))}
              </div>
              <button className="mx-auto mt-8 block w-[200px] bg-[#FF9524] text-white border-none rounded-lg font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-lg py-3 cursor-pointer shadow-[0_2px_8px_rgba(255,149,36,0.27)] transition-[background,color] duration-200 disabled:bg-[#ccc] disabled:text-[#888] disabled:cursor-not-allowed" onClick={nextQuestion}>NEXT</button>
            </div>
          )}
          {/* THE WHY Section */}
          {showResults && showWhy && (
            <div className="mt-12 mx-auto max-w-[700px] bg-none text-white py-0 px-4 pb-8 text-left">
              <hr className="border-none border-t-2 border-[#39205A] mb-6 mt-0" />
              <div className="font-['Press_Start_2P','VT323','Consolas',monospace,Arial,sans-serif] text-[1.1rem] text-white font-bold tracking-[2px] mb-[18px] uppercase">THE WHY</div>
              <div className="font-['Montserrat',Arial,sans-serif] text-[1.13rem] text-white leading-[2.1] mx-0 [&_b]:font-bold [&_b]:text-[#CA70E3]">
                <p>A solid emergency fund should cover at least three months of Zara's essential (needs) costs.</p>
                <p><b>Essential category</b><br/>
                Monthly cost (MC)<br/>
                Habitat pod rent: 1,350<br/>
                Life-Support: 900<br/>
                Transport: 240<br/>
                <br/>
                <b>Total monthly needs</b>: 2,490</p>
                <p>Three months' cover: 2,490 MC × 3 = 7,470 MC → <b>Option B</b>.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="fixed top-0 right-0 w-[350px] h-full bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.2)] z-[1000] p-5 overflow-y-auto">
          <div className="flex justify-between items-baseline border-b border-gray-200 pb-2.5">
            <h2>{glossaryTitle}</h2>
            <button className="bg-transparent border-none text-[1.9rem] cursor-pointer text-[#003F91]" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div>
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.2)] w-[500px] text-center">
            <h3>Hint</h3>
            <p>Consider the risk and potential return of each investment option.</p>
            <button onClick={() => setShowHintModal(false)} className="bg-[#3b82f6] text-white border-none py-2.5 px-5 rounded-md cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="fixed z-[1000] bg-white border border-gray-300 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-4 max-w-[300px]" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </>
  );
};

export default Question4;
