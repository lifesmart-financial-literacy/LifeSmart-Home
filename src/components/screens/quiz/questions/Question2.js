import React, { useState, useEffect } from 'react';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';

const Question2 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [showExpandedAnswer, setShowExpandedAnswer] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(240);
  const [timerStarted, setTimerStarted] = useState(false);
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

  const correctAnswer = 'C';

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

  // eslint-disable-next-line no-unused-vars -- reserved for glossary term clicks
  const openGlossary = (term) => {
    setShowGlossary(true);
    if (term === 'incomeTax') {
      setGlossaryTitle('Income Tax');
      setGlossaryContent('A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.');
    } else if (term === 'taxRate') {
      setGlossaryTitle('Tax Rate');
      setGlossaryContent("This tells you how much income tax you need to pay. It's like a rule that says how much money you give to the government based on how much money you make.");
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

  const toggleExpandedAnswer = () => {
    setShowExpandedAnswer(prev => !prev);
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="p-5 mx-auto font-[Arial,sans-serif] bg-white rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)]">
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
      <div className="flex flex-col items-start mt-5">
        <div className="flex justify-between items-baseline w-full">
          <div className="flex flex-row justify-center">
            <h3 className="text-[1.8rem] text-black flex-grow text-start">Challenge 2</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="w-10 h-10" />
            <p className="text-[1.3rem] text-blue-500 font-bold">3 points</p>
          </div>
          <div className="flex gap-2.5">
            <button className="bg-[#f0f4ff] border border-gray-200 text-[#003F91] font-bold text-[1.1rem] py-2 px-4 rounded-[20px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#dbe9ff]" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <p className="text-[#555] text-[1.3rem] mt-1.5">
          Ben earns £60,000 a year.
          <span
            className="text-blue-500 cursor-pointer underline hover:text-blue-600"
            onMouseOver={(e) => showHoverModal('Income Tax', 'A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.', e)}
            onMouseLeave={hideHoverModal}
          >
            <strong>Income Tax</strong>
          </span>
          {' '}automatically comes out of his paycheck before he gets the money.
        </p>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="quiz-glossary-sidebar">
          <div className="flex justify-between items-baseline border-b border-gray-200 pb-2.5">
            <h2 className="text-[1.8rem] text-[#003F91]">{glossaryTitle}</h2>
            <button className="bg-transparent border-none text-[1.9rem] cursor-pointer text-[#003F91]" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div>
            <p className="text-[1.6rem] text-[#555] mt-1.5 leading-relaxed">{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="quiz-hint-overlay">
          <div className="bg-white p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.2)] w-[500px] text-center">
            <h3 className="text-[1.9rem] mb-2.5 text-black">Hint</h3>
            <p className="text-[1.6rem] mb-5 text-gray-600">The first £10,000 Ben earns doesn&apos;t get taxed at all. The next money he makes from £10,000 - £40,000 (which is £30,000) gets taxed at 20%. The remaining money he makes after £40,000 gets taxed at 40%.</p>
            <p className="text-[1.6rem] mb-5 text-gray-600">Calculate the total tax he pays and subtract it from his earnings.</p>
            <button onClick={() => setShowHintModal(false)} className="bg-blue-500 text-white border-none py-2.5 px-5 rounded-[5px] cursor-pointer hover:bg-blue-600">Close</button>
          </div>
        </div>
      )}

      {/* Tax Information Table */}
      <div className="mt-5 border border-[#B3E3D3] rounded-[10px] overflow-hidden text-black">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2.5 text-left bg-[#EFEFEF] text-black">Income</th>
              <th className="p-2.5 text-left bg-[#EFEFEF] text-black">
                <span
                  className="text-blue-500 cursor-pointer underline hover:text-blue-600"
                  onMouseOver={(e) => showHoverModal('Tax Rate', "This tells you how much income tax you need to pay. It's like a rule that says how much money you give to the government based on how much money you make.", e)}
                  onMouseLeave={hideHoverModal}
                >
                  <strong>Tax Rate</strong>
                </span>
              </th>
              <th className="p-2.5 text-left bg-[#EFEFEF] text-black">Info</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white text-black">
              <td className="p-2.5 text-left bg-white text-black">£0 - £10,000</td>
              <td className="p-2.5 text-left bg-white text-black"><span className="bg-[#f3ba2f] py-1.5 px-2.5 rounded-[20px] text-white font-bold">0%</span></td>
              <td className="p-2.5 text-left bg-white text-black">The first 10k is tax-free</td>
            </tr>
            <tr className="bg-white text-black">
              <td className="p-2.5 text-left bg-white text-black">£10,000 - £40,000</td>
              <td className="p-2.5 text-left bg-white text-black"><span className="bg-[#ffa500] py-1.5 px-2.5 rounded-[20px] text-white font-bold">20%</span></td>
              <td className="p-2.5 text-left bg-white text-black">You pay 20% tax on the money IN THIS BRACKET only</td>
            </tr>
            <tr className="bg-white text-black">
              <td className="p-2.5 text-left bg-white text-black">£40,000 - £100,000</td>
              <td className="p-2.5 text-left bg-white text-black"><span className="bg-[#ff4500] py-1.5 px-2.5 rounded-[20px] text-white font-bold">40%</span></td>
              <td className="p-2.5 text-left bg-white text-black">You pay 40% tax on the money IN THIS BRACKET only</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="quiz-hover-modal w-[300px] rounded-[10px]" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3 className="text-[1.4rem] mb-1.5 text-[#003f91]">{hoverModal.title}</h3>
          <p className="text-[1.2rem] text-gray-600">{hoverModal.content}</p>
        </div>
      )}

      {/* Conditionally display answer options or result section */}
      {!showResults ? (
        <div>
          {/* Question and Points Section */}
          <div className="text-center mt-5">
            <p className="text-[1.6rem] font-bold">How much money does he get in his account after tax?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="flex justify-center gap-2.5 mt-5">
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.4rem] hover:bg-[#bae6fd]">A. £38,000</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.4rem] hover:bg-[#bae6fd]">B. £42,000</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.4rem] hover:bg-[#bae6fd]">C. £46,000</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.4rem] hover:bg-[#bae6fd]">D. £48,000</button>
            <button className="bg-[#B8CEF0] py-2.5 px-5 border-none rounded-[25px] text-black font-bold text-[1.4rem] hover:bg-[#bae6fd]">E. £50,000</button>
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
                    className="p-2 rounded-[10px] border border-gray-300 bg-[#e0f2ff] text-[1.3rem] text-center"
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
          <button className="w-[20%] bg-[#003F91] text-white border-none py-2.5 rounded-[30px] text-[1.5rem] cursor-pointer mt-5 hover:bg-blue-600" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="text-center mt-5">
          <h4>Correct Answer:</h4>
          <p className="inline-block text-[1.8rem] font-bold text-black m-5 bg-[#B3E3D3] rounded-[50px] w-[25%] py-4 text-center">£46,000</p>
          <p onClick={toggleExpandedAnswer} className="cursor-pointer text-blue-500 text-[1.4rem]">
            Click to see detailed answer
            <span>{showExpandedAnswer ? '⬆️' : '⬇️'}</span>
          </p>

          {/* Expanded Answer (Detailed Explanation) */}
          {showExpandedAnswer && (
            <div className="mt-4 border border-[#B3E3D3] rounded-[10px] overflow-hidden text-black">
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th className="p-2.5 text-left bg-[#EFEFEF] text-black">Income</th>
                    <th className="p-2.5 text-left bg-[#EFEFEF] text-black">Tax rate</th>
                    <th className="p-2.5 text-left bg-[#EFEFEF] text-black">Calculations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200">£0 - £10,000</td>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200"><span className="bg-[#f3ba2f] py-1.5 px-2.5 rounded-[20px] text-white font-bold">0%</span></td>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200">£0</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200">£10,000 - £40,000</td>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200"><span className="bg-[#ffa500] py-1.5 px-2.5 rounded-[20px] text-white font-bold">20%</span></td>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200">£30,000 <span style={{ color: 'blue' }}>X</span> 20% = £6,000</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200">£40,000 - <span className="text-[#8a2be2] font-bold">£60,000</span></td>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200"><span className="bg-[#ff4500] py-1.5 px-2.5 rounded-[20px] text-white font-bold">40%</span></td>
                    <td className="p-2.5 text-left bg-white border-b border-gray-200">£20,000 <span style={{ color: 'blue' }}>X</span> 40% = £8,000</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="p-2.5 text-right">
                      <p className="text-end m-0"><strong>Total tax paid:</strong> £6,000 + £8,000 = <span className="text-[#F28C28] font-bold">£14,000</span></p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="p-2.5 text-center">
                      <p className="text-center m-0"><strong>Total income left to take home</strong></p>
                      <p className="text-center m-0"><span className="text-[#8a2be2] font-bold">£60,000</span> - <span className="text-[#F28C28] font-bold">£14,000</span> = <span className="text-black font-bold">£46,000</span></p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="flex justify-center gap-5 mt-5">
            {teams.map((team, index) => (
              <div key={team.name} className="flex flex-col items-center">
                <p className="mb-1.5 font-bold text-black">{team.name}</p>
                <div className={`w-[50px] h-[50px] rounded-[10px] flex items-center justify-center text-[1.6rem] font-bold ${teamAnswers[index] === correctAnswer ? 'bg-[#B3E3D3] border border-[#003F9180] text-white' : 'bg-[#FF6B6B99] border border-[#003F9180] text-white'}`}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="w-[20%] bg-[#003F91] text-white border-none py-2.5 rounded-[30px] text-[1.5rem] cursor-pointer mt-5 hover:bg-blue-600" onClick={nextQuestion}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Question2;
