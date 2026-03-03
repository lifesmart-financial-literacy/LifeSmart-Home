/* eslint-disable no-unused-vars -- Question has glossary state for future term tooltips */
import React, { useState, useEffect } from 'react';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../../../assets/icons/moneybars.png';

const Question5 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
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
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill([]));

  const correctAnswer = ['A', 'B', 'D', 'E', 'G'];

  const answerOptions = [
    'A: Paying bills and payments on time',
    'B: Registering on the electoral roll',
    'C: Frequently applying for new credit',
    'D: Paying off or maintaining low levels of debt',
    'E: Keeping a bank account open for many years',
    'F: Maxing out your credit cards regularly',
    'G: Avoiding frequent credit applications',
    'H: Moving house regularly'
  ];

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

  const handleTeamAnswerChange = (index, letter) => {
    const newAnswers = [...teamAnswers];
    const teamAnswerSet = new Set(newAnswers[index]);

    if (teamAnswerSet.has(letter)) {
      teamAnswerSet.delete(letter);
    } else {
      teamAnswerSet.add(letter);
    }

    newAnswers[index] = Array.from(teamAnswerSet).sort();
    setTeamAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    // Calculate points based only on correct answers (1 point per correct answer)
    const pointsArray = teamAnswers.map(answers => {
      const correctCount = answers.filter(answer => correctAnswer.includes(answer)).length;
      return correctCount;
    });
    onAwardPoints(pointsArray);
    onNextQuestion();
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
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[2rem] m-0">Challenge 5</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="w-[30px] h-[30px]" />
            <p className="text-[1.3rem] text-blue-500 font-bold m-0">5 points</p>
          </div>
          <div className="flex gap-2.5">
            <button className="bg-[#f0f4ff] border border-gray-200 text-[#003F91] font-bold text-[1.1rem] py-2 px-4 rounded-[20px] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#dbe9ff]" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="flex flex-row items-center mt-5">
          <p className="text-[#555] text-[1.3rem] mt-1.5 font-bold">
            Ben decides he wants to get another loan in the future, so he would like to improve his{' '}
            <span
              className="text-blue-500 cursor-pointer underline font-bold"
              onMouseEnter={(e) => showHoverModal('Credit Rating', 'A score that shows how reliable you are at repaying money. A higher score means banks are more likely to lend to you.', e)}
              onMouseLeave={hideHoverModal}
            >
              credit rating
            </span>
            .
          </p>
          <img src={moneyBars} alt="Task 5 scenario" className="w-[200px] ml-5" />
        </div>
      </div>

      {/* Question Section */}
      <div className="my-8 text-left">
        <p className="text-[1.3rem] text-black m-0">
          Which of the following things improve your{' '}
          <span
            className="text-blue-500 cursor-pointer underline font-bold"
            onMouseEnter={(e) => showHoverModal('Credit Rating', 'A score that shows how reliable you are at repaying money. A higher score means banks are more likely to lend to you.', e)}
            onMouseLeave={hideHoverModal}
          >
            credit rating
          </span>
          ?
        </p>
      </div>

      {!showResults ? (
        <div>
          {/* Multiple Choice Options */}
          <div className="flex flex-col gap-2.5 my-5 w-full">
            {answerOptions.map((option, index) => (
              <button key={index} className="bg-[#E8F1FF] py-4 px-5 border-none rounded-lg text-black text-[1.1rem] text-left cursor-pointer transition-colors duration-200 w-full hover:bg-[#D1E3FF]">
                {option}
              </button>
            ))}
          </div>

          {/* Team Answer Section */}
          <div className="mt-8">
            <h4 className="text-left mb-4 text-[1.2rem] text-gray-600">Your answers (select all that apply)</h4>
            <div className="flex gap-5 mt-2.5">
              {teams.map((team, index) => (
                <div key={team.name} className="flex flex-col items-start">
                  <p className="m-0 mb-1.5 font-bold text-gray-600">{team.name}</p>
                  <div className="flex gap-2 flex-wrap max-w-[300px]">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => (
                      <button
                        key={letter}
                        className={`w-9 h-9 rounded-full border-none font-bold text-base flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#D1E3FF] hover:scale-105 ${teamAnswers[index].includes(letter) ? 'bg-[#003F91] text-white' : 'bg-[#E8F1FF] text-gray-600'}`}
                        onClick={() => handleTeamAnswerChange(index, letter)}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="bg-[#003F91] text-white border-none py-3 px-10 rounded-[25px] text-[1.2rem] cursor-pointer mt-8 transition-colors duration-200 hover:bg-[#002d6a]" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <h4>Answers:</h4>
          {answerOptions.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            return (
              <p
                key={index}
                className={`py-4 px-8 rounded-[25px] inline-block my-2.5 text-[1.1rem] w-[80%] text-left ${correctAnswer.includes(letter) ? 'bg-[#B3E3D3] text-black' : 'bg-[#FFD1D1] text-black'}`}
              >
                {option}
              </p>
            );
          })}

          {/* Display each team's answer with comparison */}
          <div className="flex justify-center gap-8 my-8">
            {teams.map((team, index) => (
              <div key={team.name} className="flex flex-col items-center">
                <p className="mb-1.5 font-bold text-black">{team.name}</p>
                <div className="flex gap-2 flex-wrap my-2.5">
                  {teamAnswers[index].map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className={`py-2.5 px-5 rounded-lg font-bold ${correctAnswer.includes(answer) ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                      {answer}
                    </div>
                  ))}
                  {teamAnswers[index].length === 0 && <div className="bg-gray-200 text-gray-500 w-9 h-9 rounded-full flex items-center justify-center font-bold">-</div>}
                </div>
                <p className="mt-1.5 mb-0 text-[1.1rem] text-gray-600">
                  Score: {teamAnswers[index].filter(answer => correctAnswer.includes(answer)).length}
                </p>
              </div>
            ))}
          </div>

          <button className="bg-[#003F91] text-white border-none py-3 px-10 rounded-[25px] text-[1.2rem] cursor-pointer transition-colors duration-200 hover:bg-[#002d6a]" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="quiz-hint-overlay">
          <div className="bg-white p-8 rounded-[15px] max-w-[500px] text-center">
            <h3 className="m-0 mb-4 text-[1.5rem]">Hint</h3>
            <p className="m-0 mb-5 text-[1.2rem] text-gray-500">Think about what actions show banks that you&apos;re reliable with money.</p>
            <button onClick={() => setShowHintModal(false)} className="bg-[#003F91] text-white border-none py-2.5 px-6 rounded-[20px] text-[1.1rem] cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="quiz-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3 className="m-0 mb-2.5 text-[1.2rem]">{hoverModal.title}</h3>
          <p className="m-0 text-base text-gray-500">{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question5;
