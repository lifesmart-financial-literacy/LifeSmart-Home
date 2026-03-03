/* eslint-disable no-unused-vars -- Question has placeholder state for future glossary/hint features */
import React, { useState, useEffect, useRef } from 'react';
import QuestionHeader from './QuestionHeader';

const PLANET_EARTH = '/financeQuest/celestialBodies/Earth.png';
const PLANET_MOON = '/financeQuest/celestialBodies/Moon.png';
const PLANET_MARS = '/financeQuest/celestialBodies/Mars.png';

const Question1 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const whyRef = useRef(null);

  const correctAnswer = 'A';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = timerStarted ? Math.floor(timer / 60) : 3;
  const seconds = timerStarted ? timer % 60 : 0;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
      setTimer(180);
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => {
      if (answer === 'A') return 3;
      if (answer === 'B') return 2;
      if (answer === 'E') return 1;
      return 0;
    });
    onAwardPoints(pointsArray);
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <>
      <QuestionHeader />
      <div className="bg-[#0D0021] pt-12 w-screen flex flex-row items-center justify-center gap-12 z-[5] relative max-[700px]:gap-3 max-[700px]:flex-col max-[700px]:items-stretch">
        <div className="flex items-center gap-2 bg-[#1F0149] border-2 border-white rounded px-[18px] py-1.5 pr-2.5 font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-[1.1rem] max-[700px]:text-base max-[700px]:py-1 max-[700px]:px-2">
          <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="w-[22px] h-[22px] mr-1.5" />
          <span className="tracking-[0.5px]">3 points</span>
        </div>
        <div className="text-[2.3rem] text-[#FF9524] font-['Press_Start_2P','VT323','Consolas',monospace] tracking-[2px] font-bold text-center mx-6 max-[700px]:text-[1.2rem] max-[700px]:mx-1" style={{ textShadow: '0 2px 0 #000, 0 0 8px #FF9524aa' }}>CHALLENGE 1</div>
        <div className="relative inline-block min-w-[120px] h-16 max-[700px]:min-w-[80px] max-[700px]:h-10">
          <button
            className="w-[260px] h-[60px] flex items-center justify-center bg-[#E1551D] rounded-xl shadow-[0_8px_32px_#0008] m-0 p-0 transition-all duration-180 cursor-pointer outline-none relative max-[700px]:w-[180px] max-[700px]:h-[60px] max-[700px]:rounded-2xl disabled:opacity-70 disabled:cursor-default hover:shadow-[0_12px_48px_#FF9524cc] hover:border-[#FF9524]"
            aria-label="Start timer"
            onClick={() => { if (!timerStarted) startTimer(); }}
            style={{ cursor: timerStarted ? 'default' : 'pointer' }}
            disabled={timerStarted}
          >
            <div className="bg-none rounded-none shadow-none min-w-0 min-h-0 text-[1.8rem] pr-8 text-white font-['Press_Start_2P','VT323','Consolas',monospace] flex items-center justify-center max-[700px]:text-[1.2rem] max-[700px]:pr-2">
              <span className="tracking-[2px]" style={{ textShadow: '0 2px 0 #000a' }}>{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
            </div>
            <img src="/financeQuest/icons/8bitAlarm.png" alt="timer" className="w-20 h-20 pointer-events-none max-[700px]:w-9 max-[700px]:h-9" />
          </button>
        </div>
      </div>
      <div className="min-h-screen w-screen bg-[#0D0021] relative overflow-x-hidden font-['Press_Start_2P','VT323','Consolas',monospace] text-white flex items-start justify-center p-0">
        <img src={PLANET_EARTH} alt="Earth" className="fq-planet fq-planet-earth" />
        <img src={PLANET_MOON} alt="Moon" className="fq-planet fq-planet-moon" />
        <img src={PLANET_MARS} alt="Mars" className="fq-planet fq-planet-mars" />
        <div className="my-12 py-0 pb-8 max-w-[900px] w-[98vw] z-[2] relative flex flex-col items-center max-[900px]:my-6 max-[900px]:pb-4">
          <div className="bg-[#1C0032] rounded-[10px] mx-8 mt-8 shadow-[0_2px_0_#0008] border-2 border-white/30 w-[calc(100%-64px)] max-w-[800px] z-[2] max-[900px]:mx-2 max-[900px]:w-[calc(100%-16px)]">
            <div className="flex flex-row items-center justify-between h-8 px-4 text-white text-[1.3rem] opacity-70 tracking-[2px] border-2 border-white/30">
              <span className="text-[1.5rem] opacity-70">…</span>
              <span className="text-[1.5rem] opacity-70 cursor-default">&#10005;</span>
            </div>
            <div className="font-['Montserrat',Arial,sans-serif] text-[1.15rem] text-white leading-[2.1] text-center">
              <span className="text-[1.2rem] font-bold">The year is <b>2150</b>.</span><br />
              Zara, 18-years-old, has just move to the New Horizon city on <b>Mars</b>. She's given 10,000 Mars Credits (MC) to start her new life.<br /><br />
              She has to <b>split the money</b> across <b>four categories</b>:<br />
              <span className="block mt-2.5 text-[1.1rem] text-left mx-auto max-w-[420px]">
                <span className="text-left">
                  <img src="/financeQuest/icons/8bitPotion.png" alt="Habitat Icon" className="fq-choice-pie w-7 h-7 align-middle mr-2.5 mb-1 inline-block" />
                  <b>Habitat</b> (life pod, air recycling)
                </span><br />
                <span className="text-left">
                  <img src="/financeQuest/icons/8bitPinkHeart.png" alt="Life-Support Icon" className="fq-choice-pie w-7 h-7 align-middle mr-2.5 mb-1 inline-block" />
                  <b>Life-Support</b> (food, water, utilities)
                </span><br />
                <span className="text-left">
                  <img src="/financeQuest/icons/8bitDiamond.png" alt="Safety Fund Icon" className="fq-choice-pie w-7 h-7 align-middle mr-2.5 mb-1 inline-block" />
                  <b>Safety Fund</b> (unexpected repairs)
                </span><br />
                <span className="text-left">
                  <img src="/financeQuest/icons/8bitStoneSword.png" alt="Exploration & Fun Icon" className="fq-choice-pie w-7 h-7 align-middle mr-2.5 mb-1 inline-block" />
                  <b>Exploration & Fun</b> (holo-games, rover trips)
                </span>
              </span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <span className="text-[1.3rem] text-white font-bold tracking-[1px]">Decide the <span className="text-[#C77DFF] font-bold">best split</span> for her money</span>
          </div>
          <div className="grid justify-center grid-cols-2 gap-8 mt-9 w-[90%] max-w-[1200px] justify-items-center font-['Montserrat',Arial,sans-serif] border-b border-white/15 w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] max-[900px]:gap-4 max-[900px]:gap-2">
            <div className="flex flex-col items-center">
              <img src={showResults ? "/financeQuest/pieCharts/correctPieChartA.png" : "/financeQuest/pieCharts/drawnPieChartA.png"} alt="A" className="fq-choice-pie w-[520px] h-auto my-2.5 block border-none rounded-none bg-none shadow-none transition-all duration-180 cursor-pointer hover:shadow-[0_0_0_6px_#FF9524,0_8px_32px_#FF9524aa] hover:scale-[1.025] hover:rounded-[18px] hover:z-[2] max-[900px]:w-[70px] max-[900px]:h-[70px]" />
              {showResults && (
                <button className="block w-full max-w-[520px] mt-8 py-6 bg-[#33005F] text-white border-2 border-white rounded-xl font-['Press_Start_2P','VT323','Consolas',monospace] text-[1.5rem] tracking-[2px] uppercase text-center cursor-pointer transition-all duration-180 hover:bg-[#CA70E3] max-[700px]:text-[1.1rem] max-[700px]:py-3" style={{ textShadow: '0 2px 0 #fff8' }} onClick={() => whyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                  WANT TO KNOW WHY?
                </button>
              )}
            </div>
            <img src="/financeQuest/pieCharts/drawnPieChartB.png" alt="B" className="fq-choice-pie w-[520px] h-auto my-2.5 block border-none rounded-none bg-none shadow-none transition-all duration-180 cursor-pointer hover:shadow-[0_0_0_6px_#FF9524,0_8px_32px_#FF9524aa] hover:scale-[1.025] hover:rounded-[18px] hover:z-[2] max-[900px]:w-[70px] max-[900px]:h-[70px]" />
            <img src="/financeQuest/pieCharts/drawnPieChartC.png" alt="C" className="fq-choice-pie w-[520px] h-auto my-2.5 block border-none rounded-none bg-none shadow-none transition-all duration-180 cursor-pointer hover:shadow-[0_0_0_6px_#FF9524,0_8px_32px_#FF9524aa] hover:scale-[1.025] hover:rounded-[18px] hover:z-[2] max-[900px]:w-[70px] max-[900px]:h-[70px]" />
            <img src="/financeQuest/pieCharts/drawnPieChartD.png" alt="D" className="fq-choice-pie w-[520px] h-auto my-2.5 block border-none rounded-none bg-none shadow-none transition-all duration-180 cursor-pointer hover:shadow-[0_0_0_6px_#FF9524,0_8px_32px_#FF9524aa] hover:scale-[1.025] hover:rounded-[18px] hover:z-[2] max-[900px]:w-[70px] max-[900px]:h-[70px]" />
            <img src="/financeQuest/pieCharts/drawnPieChartE.png" alt="E" className="fq-choice-pie w-[520px] h-auto my-2.5 block border-none rounded-none bg-none shadow-none transition-all duration-180 cursor-pointer hover:shadow-[0_0_0_6px_#FF9524,0_8px_32px_#FF9524aa] hover:scale-[1.025] hover:rounded-[18px] hover:z-[2] max-[900px]:w-[70px] max-[900px]:h-[70px]" />
          </div>
          <div className="mt-12 text-center w-full font-['Montserrat',Arial,sans-serif]">
            <span className="text-[1.7rem] text-white font-bold tracking-[1px]">Select your <span className="text-[#CA70E3] font-bold">answers</span></span>
            <div className="flex flex-row justify-center gap-12 mt-8 flex-wrap max-[900px]:gap-3 max-[900px]:flex-col max-[900px]:items-center max-[700px]:gap-3 max-[700px]:flex-col max-[700px]:items-center">
              {teams.map((team, idx) => (
                <div className="flex flex-col items-center py-[18px] px-6 min-w-[180px] max-w-[220px] box-border max-[900px]:min-w-[120px] max-[900px]:max-w-[99vw] max-[700px]:min-w-[120px] max-[700px]:max-w-[99vw] max-[700px]:py-2.5 max-[700px]:px-2" key={team.name}>
                  <span className="font-['Press_Start_2P','VT323','Consolas',monospace] text-[1.1rem] text-white font-bold mb-4 tracking-[1px] max-w-[180px] text-center whitespace-nowrap overflow-hidden text-ellipsis block max-[700px]:max-w-[99vw] max-[700px]:text-[0.9rem]">{idx + 1}. <b>{team.name}</b></span>
                  {showResults ? (
                    <div className={`w-16 h-16 flex items-center justify-center text-[2rem] font-bold text-white rounded-2xl mt-3 mx-auto shadow-[0_4px_16px_#0004] tracking-[1px] max-[700px]:w-10 max-[700px]:h-10 max-[700px]:text-[1.1rem] max-[700px]:rounded-lg ${teamAnswers[idx] === 'A' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}>{teamAnswers[idx]}</div>
                  ) : (
                    <select
                      value={teamAnswers[idx]}
                      onChange={e => handleTeamAnswerChange(idx, e.target.value)}
                      className="font-['Montserrat',Arial,sans-serif] text-[1.1rem] bg-transparent text-white bg-[#1F0149] border-2 border-white rounded-lg py-2.5 px-[18px] mt-1 outline-none shadow-[0_2px_0_#0008] transition-all duration-200 cursor-pointer focus:border-[#FF9524] focus:shadow-[0_0_0_2px_#FF9524aa] hover:border-[#FF9524] hover:shadow-[0_0_0_2px_#FF9524aa]"
                    >
                      <option value="">Select one</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
            {!showResults ? (
              <button className="mt-10 mx-auto block w-[220px] max-w-[90vw] bg-[#FF9524] text-[#1C0032] font-['Press_Start_2P','VT323','Consolas',monospace] text-[1.3rem] border-4 border-white rounded-xl shadow-[0_4px_0_#0008,0_0_0_4px_#C77DFF] py-[18px] pb-3.5 tracking-[2px] cursor-pointer transition-all duration-200 disabled:bg-[#888] disabled:text-white disabled:border-[#ccc] disabled:cursor-not-allowed disabled:shadow-none disabled:[text-shadow:none] hover:bg-[#C77DFF] hover:text-white hover:border-[#FF9524] hover:shadow-[0_8px_24px_#FF9524aa,0_0_0_4px_#C77DFF] max-[900px]:w-[99vw] max-[900px]:text-[1.1rem] max-[900px]:py-3 max-[900px]:pb-2.5 max-[700px]:w-[99vw] max-[700px]:text-[1.1rem] max-[700px]:py-3 max-[700px]:pb-2.5" style={{ textShadow: '0 2px 0 #fff8' }} onClick={submitAnswers} disabled={teamAnswers.some(a => !a)}>SUBMIT</button>
            ) : (
              <button className="mt-10 mx-auto block w-[220px] max-w-[90vw] bg-[#FF9524] text-[#1C0032] font-['Press_Start_2P','VT323','Consolas',monospace] text-[1.3rem] border-4 border-white rounded-xl shadow-[0_4px_0_#0008,0_0_0_4px_#C77DFF] py-[18px] pb-3.5 tracking-[2px] cursor-pointer transition-all duration-200 hover:bg-[#C77DFF] hover:text-white hover:border-[#FF9524] hover:shadow-[0_8px_24px_#FF9524aa,0_0_0_4px_#C77DFF] max-[900px]:w-[99vw] max-[900px]:text-[1.1rem] max-[700px]:w-[99vw] max-[700px]:text-[1.1rem]" style={{ textShadow: '0 2px 0 #fff8' }} onClick={onNextQuestion}>NEXT QUESTION</button>
            )}
          </div>
          {showResults && (
            <div className="mt-12 text-left w-full border-t border-white/15 pt-8 font-['Montserrat',Arial,sans-serif]" ref={whyRef}>
              <div className="font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-[1.2rem] uppercase mb-[18px] ml-12 tracking-[1px]">THE WHY</div>
              <div className="text-white text-[1.1rem] ml-12 text-left font-['Montserrat',Arial,sans-serif]">
                <ul className="ml-0 pl-6">
                  <li>
                    <strong>Follows the 50 / 30 / 20 rule.</strong>
                    <ul className="mt-2 mb-2">
                      <li><strong>Needs (Habitat + Life-Support): ≈50 %</strong> – keeps Zara safe and healthy.</li>
                      <li><strong>Savings (Safety Fund): ≈20 %</strong> – builds an emergency cushion for Mars mishaps.</li>
                      <li><strong>Wants (Exploration & Fun): ≈30 %</strong> – leaves room for enjoyment without derailing her budget.</li>
                    </ul>
                  </li>
                </ul>
                <p className="mt-[18px]">
                  Allocations that push <strong>too much into Wants</strong> or <strong>too little into Savings</strong> score fewer points because they increase the risk of running short when an unexpected repair or expense hits.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Question1;
