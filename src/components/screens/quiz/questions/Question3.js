import React, { useState, useEffect } from 'react';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import blueCash from '../../../../assets/icons/bluecash.png';

const Question3 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(480);
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
  const [detailsVisible, setDetailsVisible] = useState({
    A: false,
    B: false,
    C: false,
    D: false,
    E: false
  });

  const pointsMapping = {
    A: 7,
    B: 10,
    C: 8,
    D: 6,
    E: 4
  };

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
  const progressBarWidth = (timer / 480) * 100;

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
    if (term === 'mortgage') {
      setGlossaryTitle('Mortgage');
      setGlossaryContent('A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.');
    } else if (term === 'cryptocurrency') {
      setGlossaryTitle('Cryptocurrency');
      setGlossaryContent('A type of money you can use on a computer but can\'t touch like coins or bills. It\'s made using special computer codes, and you can use it to buy things online.');
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => pointsMapping[answer] || 0);
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const toggleDetails = (option) => {
    setDetailsVisible(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  const getPoints = (answer) => {
    return pointsMapping[answer] || 0;
  };

  const getPointsColor = (points) => {
    const minPoints = 0;
    const maxPoints = 10;
    const coldColor = [0, 0, 255]; // Cold: Blue (RGB)
    const warmColor = [0, 255, 0];   // Warm: Green (RGB)

    const ratio = (points - minPoints) / (maxPoints - minPoints);

    const r = Math.round(coldColor[0] + ratio * (warmColor[0] - coldColor[0]));
    const g = Math.round(coldColor[1] + ratio * (warmColor[1] - coldColor[1]));
    const b = Math.round(coldColor[2] + ratio * (warmColor[2] - coldColor[2]));

    return `rgb(${r}, ${g}, ${b})`;
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
      <div className="flex flex-col items-start mt-5 text-black">
        <div className="flex justify-between items-baseline w-full">
          <div className="flex flex-row justify-center">
            <h3 className="text-[2rem]">Challenge 3</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="w-10 h-10" />
            <p className="text-[1.3rem] text-blue-500 font-bold">10 points</p>
          </div>
          <div className="flex gap-2.5">
            <button className="bg-[#f0f4ff] border border-gray-200 text-[#003F91] font-bold text-[0.9rem] py-2 px-4 rounded-[20px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#dbe9ff]" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <p className="text-[#555] text-[1.4rem] mt-1.5 font-bold">Ben inherits a £20,000 gift from an old uncle. He has several options on what to do with the money.</p>
          <img src={blueCash} alt="Task 3 scenario" className="w-[200px] mr-5" />
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="quiz-glossary-sidebar">
          <div className="flex justify-between items-baseline border-b border-gray-200 pb-2.5">
            <h2 className="text-[1.9rem] text-[#003F91]">{glossaryTitle}</h2>
            <button className="bg-transparent border-none text-[1.5rem] cursor-pointer text-[#003F91]" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div>
            <p className="text-[1.4rem] text-[#555] mt-1.5 leading-relaxed">{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="quiz-hint-overlay">
          <div className="bg-white p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.2)] w-[500px] text-center">
            <h3 className="text-[1.5rem] mb-2.5 text-black">Hint</h3>
            <p className="text-[1.2rem] mb-5 text-gray-600">Net worth = Total Assets – Total Liabilities</p>
            <button onClick={() => setShowHintModal(false)} className="bg-blue-500 text-white border-none py-2.5 px-5 rounded-[5px] cursor-pointer hover:bg-blue-600">Close</button>
          </div>
        </div>
      )}

      {/* Assets and Liabilities Section */}
      <div className="mt-5 flex justify-center gap-5">
        <div className="flex flex-row gap-5">
          <div className="bg-[#ECECEC] p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] w-[300px]">
            <h4 className="text-[1.6rem] mb-2.5 text-black/70">Assets</h4>
            <ul className="list-none p-0">
              <li className="flex justify-between items-center mb-2 text-[1.2rem] text-black">
                <span className="mr-2.5">🏠 House</span>
                <span className="ml-5 font-bold">£200,000</span>
              </li>
              <li className="flex justify-between items-center mb-2 text-[1.2rem] text-black">
                <span className="mr-2.5">🚗 Car</span>
                <span className="ml-5 font-bold">£50,000</span>
              </li>
              <li className="flex justify-between items-center mb-2 text-[1.2rem] text-black">
                <span className="mr-2.5">💵 Cash</span>
                <span className="ml-5 font-bold">£20,000</span>
              </li>
            </ul>
          </div>
          <div className="bg-[#ECECEC] p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.1)] w-[300px]">
            <h4 className="text-[1.6rem] mb-2.5 text-black/70">Liabilities</h4>
            <ul className="list-none p-0">
              <li className="flex justify-between items-center mb-2 text-[1.2rem] text-black">
                <span className="mr-2.5">
                  🏠
                  <span
                    className="text-blue-500 cursor-pointer underline hover:text-blue-600"
                    onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                    onMouseLeave={hideHoverModal}
                  >
                    <strong>Mortgage</strong>
                  </span>
                  {' '}(6%)
                </span>
                <span className="ml-5 font-bold">£150,000</span>
              </li>
              <li className="flex justify-between items-center mb-2 text-[1.2rem] text-black">
                <span className="mr-2.5">🚗 Car Loan (10%)</span>
                <span className="ml-5 font-bold">£20,000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conditionally display answer options or result section */}
      {!showResults ? (
        <div>
          {/* Question and Points Section */}
          <div className="text-center mt-5">
            <p className="text-[1.6rem] font-bold">What should he do with the money?</p>
          </div>

          {/* Options List Before Submission */}
          <div className="mt-5 p-0">
            <ol className="list-none p-0 m-0">
              <li className="bg-[#B8CEF0] py-4 px-4 rounded-[15px] text-[1.5rem] text-black font-bold mb-4 transition-colors duration-300 ease-in-out text-center hover:bg-[#9bb6d9]">
                A. Pay off some of his
                <span
                  className="text-blue-500 cursor-pointer underline hover:text-blue-600"
                  onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                  onMouseLeave={hideHoverModal}
                >
                  <strong>Mortgage</strong>
                </span>
                {' '}(house loan)
              </li>
              <li className="bg-[#B8CEF0] py-4 px-4 rounded-[15px] text-[1.5rem] text-black font-bold mb-4 transition-colors duration-300 ease-in-out text-center hover:bg-[#9bb6d9]">B. Pay off his car loan</li>
              <li className="bg-[#B8CEF0] py-4 px-4 rounded-[15px] text-[1.5rem] text-black font-bold mb-4 transition-colors duration-300 ease-in-out text-center hover:bg-[#9bb6d9]">C. Spend the money on a training and self-development course</li>
              <li className="bg-[#B8CEF0] py-4 px-4 rounded-[15px] text-[1.5rem] text-black font-bold mb-4 transition-colors duration-300 ease-in-out text-center hover:bg-[#9bb6d9]">
                <span>
                  D. Invest in a new{' '}
                  <span
                    className="text-blue-500 cursor-pointer underline hover:text-blue-600"
                    onMouseOver={(e) => showHoverModal('Cryptocurrency', 'A type of money you can use on a computer but can\'t touch like coins or bills. It\'s made using special computer codes, and you can use it to buy things online.', e)}
                    onMouseLeave={hideHoverModal}
                  >
                    <strong>cryptocurrency</strong>
                  </span>
                  {' '}coin his friend has just bought (Skibidicoin)
                </span>
              </li>
              <li className="bg-[#B8CEF0] py-4 px-4 rounded-[15px] text-[1.5rem] text-black font-bold mb-4 transition-colors duration-300 ease-in-out text-center hover:bg-[#9bb6d9]">E. Put the money in a savings account (paying 3% interest)</li>
            </ol>
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
                    className="p-2 rounded-[10px] border border-gray-300 bg-[#e0f2ff] text-[1.5rem] text-center"
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
          <button className="w-[20%] bg-[#003F91] text-white border-none py-2.5 rounded-[30px] text-base cursor-pointer mt-5 hover:bg-blue-600" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="text-center mt-5">
          <h4>Points Breakdown:</h4>
          <p className="text-[1.4rem] mb-4">Here&apos;s how many points each option scores:</p>

          {/* Options List After Submission */}
          <div className="mt-5 p-0">
            <ol className="list-none p-0 m-0">
              {['A', 'B', 'C', 'D', 'E'].map((option) => (
                <li key={option} onClick={() => toggleDetails(option)} className="flex flex-col items-center mb-4">
                  <div className="flex flex-row w-full">
                    <span className="flex-1 mr-5 bg-[#B8CEF0] py-4 px-4 rounded-[15px] text-[1.5rem] text-black font-bold items-center cursor-pointer transition-colors duration-300 ease-in-out w-[85%] hover:bg-[#9bb6d9]">
                      {option === 'A' && 'A. Pay off some of his '}
                      {option === 'A' && (
                        <span
                          className="text-blue-500 cursor-pointer underline hover:text-blue-600"
                          onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                          onMouseLeave={hideHoverModal}
                        >
                          <strong>Mortgage</strong>
                        </span>
                      )}
                      {option === 'A' && ' (house loan)'}
                      {option === 'B' && 'B. Pay off his car loan'}
                      {option === 'C' && 'C. Spend the money on a training and self-development course'}
                      {option === 'D' && (
                        <>
                          D. Invest in a new{' '}
                          <span
                            className="text-blue-500 cursor-pointer underline hover:text-blue-600"
                            onMouseOver={(e) => showHoverModal('Cryptocurrency', 'A type of money you can use on a computer but can\'t touch like coins or bills. It\'s made using special computer codes, and you can use it to buy things online.', e)}
                            onMouseLeave={hideHoverModal}
                          >
                            <strong>cryptocurrency</strong>
                          </span>
                          {' '}coin his friend has just bought (Skibidicoin)
                        </>
                      )}
                      {option === 'E' && 'E. Put the money in a savings account (paying 3% interest)'}
                    </span>
                    <span className="flex items-center bg-white text-[#003F91] py-1.5 px-2.5 rounded-[15px]">
                      <img src={lightningBolt} alt="Lightning Bolt" className="w-5 h-5 mr-1.5" />
                      {pointsMapping[option]} points
                    </span>
                  </div>
                  {detailsVisible[option] && (
                    <div className="mt-2.5 bg-[#f0f0f0] rounded-[10px] p-2.5">
                      <table className="w-full text-left border-collapse border border-[#B3E3D3]">
                        <thead>
                          <tr>
                            <th className="p-1.5 bg-[#EFEFEF] text-gray-600 font-bold">Assets</th>
                            <th className="p-1.5 bg-[#EFEFEF] text-gray-600 font-bold">Liabilities</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black">House £200,000</td>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black">
                              <span
                                className="text-blue-500 cursor-pointer underline hover:text-blue-600"
                                onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                                onMouseLeave={hideHoverModal}
                              >
                                <strong>Mortgage</strong>
                              </span>
                              {' '}£150,000
                            </td>
                          </tr>
                          <tr>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black">Car £50,000</td>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black">Car Loan £20,000</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black">Cash £{option === 'A' ? '28,000' : option === 'B' ? '35,000' : option === 'C' ? '50,000' : option === 'D' ? '25,000' : '45,000'}</td>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black"></td>
                          </tr>
                          <tr>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black"><strong>Total: £{option === 'A' ? '278,000' : option === 'B' ? '285,000' : option === 'C' ? '300,000' : option === 'D' ? '275,000' : '275,000'}</strong></td>
                            <td className="p-1.5 border-b border-gray-300 bg-white text-black"><strong>Total: £{option === 'B' ? '150,000' : '170,000'}</strong></td>
                          </tr>
                          <tr>
                            <td colSpan="2" className="p-1.5 bg-white text-black"><strong>Net Worth = £{option === 'A' ? '128,000' : option === 'B' ? '135,000' : option === 'C' ? '130,000' : option === 'D' ? '105,000' : '125,000'}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Team Answers with Points */}
          <div className="flex justify-center gap-5 mt-5">
            {teams.map((team, index) => (
              <div key={team.name} className="flex flex-col items-center">
                <p className="mb-1.5 font-bold text-black">{team.name}</p>
                <div className="w-20 h-12 rounded-[10px] flex items-center justify-center text-[1.2rem] font-bold text-white" style={{ backgroundColor: getPointsColor(getPoints(teamAnswers[index])) }}>
                  {getPoints(teamAnswers[index])} points
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button className="w-[20%] bg-[#003F91] text-white border-none py-2.5 rounded-[30px] text-base cursor-pointer mt-5 hover:bg-blue-600" onClick={nextQuestion}>Next</button>
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

export default Question3;
