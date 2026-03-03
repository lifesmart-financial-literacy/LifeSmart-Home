import React, { useState, useEffect } from 'react';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../../../assets/icons/moneybars.png';
import InvestmentCalculator from '../../../widgets/InvestmentCalculator';

const Question4 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(240);
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
  const [detailedAnswerShown, setDetailedAnswerShown] = useState(false);

  const correctAnswer = 'D';

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
  const progressBarWidth = (timer / 240) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  // eslint-disable-next-line no-unused-vars -- reserved for glossary term hovers
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

  // eslint-disable-next-line no-unused-vars -- pairs with showHoverModal
  const hideHoverModal = () => {
    setHoverModal(prev => ({ ...prev, show: false }));
  };

  // eslint-disable-next-line no-unused-vars -- reserved for glossary term clicks
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

  const toggleDetailedAnswer = () => {
    setDetailedAnswerShown(!detailedAnswerShown);
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="p-5 mx-auto font-[Arial,sans-serif] bg-white rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] max-w-[1000px]">
      {/* Header and Progress Bar */}
      <div className="flex justify-between items-center mb-5">
        <div className="w-[80%] h-1.5 bg-gray-200 rounded-[5px] relative">
          <div className="h-full bg-blue-500 rounded-[5px]" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="flex justify-center items-center">
          {!timerStarted ? (
            <button onClick={startTimer} className="text-base py-0.5 px-1 bg-transparent text-black border-2 border-[#45a04933] rounded-[10px] cursor-pointer transition-colors hover:bg-[#45a04933]">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="text-2xl font-bold text-black">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="flex flex-col items-start mt-5 text-black">
        <div className="flex justify-between items-baseline w-full">
          <div className="flex flex-row justify-center mt-2.5">
            <h3 className="text-[2rem]">Challenge 4</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="w-10 h-10" />
            <p className="text-[1.3rem] text-blue-500 font-bold">5 points</p>
          </div>
          <div className="flex gap-2.5">
            <button className="bg-[#f0f4ff] border border-gray-200 text-[#003F91] font-bold text-[1.1rem] py-2 px-4 rounded-[20px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#dbe9ff]" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <p className="text-[#555] text-[1.3rem] mt-1.5 font-bold">Ben wants to save money for his future. He has £1,000 to invest.</p>
          <img src={moneyBars} alt="Task 4 scenario" className="w-[200px] mr-5" />
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="quiz-glossary-sidebar transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-baseline border-b border-gray-200 pb-2.5">
            <h2 className="text-[1.5rem] text-[#003F91]">{glossaryTitle}</h2>
            <button className="bg-transparent border-none text-[1.5rem] cursor-pointer text-[#003F91]" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div>
            <p className="text-base text-[#555] mt-1.5 leading-relaxed">{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="quiz-hint-overlay">
          <div className="bg-white p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.2)] w-[500px] text-center">
            <h3 className="text-[1.5rem] mb-2.5 text-black">Hint</h3>
            <p className="text-[1.2rem] mb-5 text-gray-600">Consider the risk and potential return of each investment option.</p>
            <button onClick={() => setShowHintModal(false)} className="bg-blue-500 text-white border-none py-2.5 px-5 rounded-[5px] cursor-pointer hover:bg-blue-600">Close</button>
          </div>
        </div>
      )}

      {/* Conditionally display answer options or result section */}
      {!showResults ? (
        <div>
          {/* Question and Points Section */}
          <div className="text-center mt-5">
            <p className="text-[1.6rem] font-bold text-black">What should he invest in?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="flex justify-center gap-2.5 mt-5">
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.3rem] hover:bg-[#bae6fd]">A. High-risk stocks</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.3rem] hover:bg-[#bae6fd]">B. Government bonds</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.3rem] hover:bg-[#bae6fd]">C. Savings account</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.3rem] hover:bg-[#bae6fd]">D. Cryptocurrency</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.3rem] hover:bg-[#bae6fd]">E. Real estate</button>
          </div>

          {/* Team Answer Section */}
          <div className="mt-8">
            <h4 className="text-center">Your answers</h4>
            <div className="flex justify-center gap-5 mt-2.5">
              {teams.map((team, index) => (
                <div key={team.name} className="flex flex-col items-center">
                  <p className="mb-1.5 font-bold text-black">{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="p-2 rounded-[10px] border border-gray-300 bg-[#e0f2ff] text-[1.4rem] text-center"
                  >
                    <option value="" disabled>Select answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-[20%] bg-[#003F91] text-white border-none py-2.5 rounded-[30px] text-[1.4rem] cursor-pointer mt-5 hover:bg-blue-600" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="text-center mt-5">
          <h4>Correct Answer:</h4>
          <p className="inline-block text-[1.8rem] font-bold text-black m-5 bg-[#B3E3D3] rounded-[50px] w-[25%] py-4 text-center">B. Government bonds</p>
          <p onClick={toggleDetailedAnswer} className="text-black text-2xl font-bold cursor-pointer transition-all duration-200 ease-in-out hover:text-[2.5rem]">
            Click to {detailedAnswerShown ? 'hide detailed answer ⬆️' : 'see detailed answer ⬇️'}
          </p>

          {/* Expanded Answer with Investment Calculator */}
          {detailedAnswerShown && (
            <div className="bg-white/5 rounded-[15px] p-6 my-5 text-black shadow-[0_4px_6px_rgba(0,0,0,0.1)] md:p-5">
              <p className="text-[1.2rem] mb-4">Government bonds are a good choice for Ben because:</p>
              <ul className="list-disc ml-5 mb-8">
                <li className="text-[1.1rem] mb-2.5">They are low-risk investments</li>
                <li className="text-[1.1rem] mb-2.5">They provide steady returns</li>
                <li className="text-[1.1rem] mb-2.5">They are backed by the government</li>
                <li className="text-[1.1rem] mb-2.5">They are suitable for long-term savings</li>
              </ul>

              {/* Investment Calculator Widget */}
              <div className="mt-8 pt-8 border-t border-black/10">
                <h3 className="text-[1.4rem] text-black mb-2.5 text-center md:text-[1.2rem]">Try our Investment Calculator</h3>
                <p className="text-[1.1rem] text-[#555] text-center mb-6 md:text-base">See how different investment strategies could grow your money over time:</p>
                <InvestmentCalculator />
              </div>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="flex justify-center gap-5 mt-5">
            {teams.map((team, index) => (
              <div key={team.name} className="flex flex-col items-center">
                <p className="mb-1.5 font-bold text-black">{team.name}</p>
                <div className={`w-[50px] h-[50px] rounded-[10px] flex items-center justify-center text-[1.5rem] font-bold ${teamAnswers[index] === correctAnswer ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="w-[20%] bg-[#003F91] text-white border-none py-2.5 rounded-[30px] text-[1.4rem] cursor-pointer mt-5 hover:bg-blue-600" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="quiz-hover-modal pointer-events-none" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3 className="text-[1.5rem] text-gray-600 mb-2">{hoverModal.title}</h3>
          <p className="text-[1.2rem] text-gray-500 m-0">{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question4;
