import React, { useState, useEffect } from 'react';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import q1Image from '../../../../assets/icons/q1image.png';
import { Button } from '@/components/ui/button';

const Question1 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const correctAnswer = 'C';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const progressBarWidth = (timer / 180) * 100;

  const startTimer = () => !timerStarted && setTimerStarted(true);

  const showModal = (term, event) => {
    if (term === 'assets') {
      setModalContent({ title: 'Assets', content: 'Assets are things you own that have monetary value, such as cash, property, or investments.' });
    } else if (term === 'liabilities') {
      setModalContent({ title: 'Liabilities', content: 'Liabilities are things you owe, such as debts or financial obligations.' });
    }
    const rect = event.target.getBoundingClientRect();
    setModalPosition({ top: rect.top - 60, left: rect.left + 20 });
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map((answer) => (answer === correctAnswer ? 3 : 0));
    onAwardPoints(pointsArray);
  };

  const nextQuestion = () => onNextQuestion();

  const handleTeamAnswerChange = (index, value) => {
    const next = [...teamAnswers];
    next[index] = value;
    setTeamAnswers(next);
  };

  return (
    <div className="p-5 mx-auto bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-200">
        <div className="w-4/5 h-1.5 bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-blue-500 rounded transition-[width]" style={{ width: `${progressBarWidth}%` }} />
        </div>
        <div className="flex justify-center items-center">
          {!timerStarted ? (
            <Button variant="outline" onClick={startTimer} className="border-2 border-green-500/20 rounded-lg px-1 py-0.5 text-black bg-transparent hover:bg-green-500/20">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </Button>
          ) : (
            <div className="text-2xl font-bold text-black">⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}</div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mt-5">
        <div className="flex justify-between items-baseline w-full">
          <div className="flex flex-row justify-center gap-2">
            <h3 className="text-[2.3rem] text-black flex-grow text-start">Challenge 1</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="w-10 h-10" />
            <p className="text-xl text-blue-500 font-bold">3 points</p>
          </div>
          <Button variant="outline" onClick={() => setShowHintModal(true)} className="bg-[#f0f4ff] border border-gray-200 text-[#003F91] font-bold px-4 py-2 rounded-[20px] hover:bg-[#dbe9ff]">
            Hint?
          </Button>
        </div>
        <img src={q1Image} alt="Task 1" className="w-[300px] mr-5 my-4" />
        <p className="text-[#555] text-[1.7rem] mt-1">
          Ben is a 30 year old engineer. He has the following
          <span className="text-green-600 font-bold cursor-pointer underline" onMouseOver={(e) => showModal('assets', e)} onMouseLeave={() => setModalContent({ title: '', content: '' })}>
            <strong>assets</strong>
          </span>
          and
          <span className="text-red-600 font-bold cursor-pointer underline" onMouseOver={(e) => showModal('liabilities', e)} onMouseLeave={() => setModalContent({ title: '', content: '' })}>
            <strong>liabilities</strong>
          </span>
          .
        </p>
      </div>

      {modalContent.title && (
        <div className="quiz-hover-modal" style={{ top: modalPosition.top, left: modalPosition.left }}>
          <h4 className="m-0 text-base text-[#003f91]">{modalContent.title}</h4>
          <p className="mt-2 text-sm text-[#333] leading-snug">{modalContent.content}</p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-center gap-5">
        <div className="bg-[#ECECEC] p-5 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] w-[300px]">
          <h4 className="text-2xl mb-2.5 text-black/70">Assets</h4>
          <ul className="list-none p-0">
            <li className="flex justify-between items-center mb-2 text-xl text-black"><span className="mr-2.5">🏠 House</span><span className="ml-5 font-bold">£200,000</span></li>
            <li className="flex justify-between items-center mb-2 text-xl text-black"><span className="mr-2.5">🚗 Car</span><span className="ml-5 font-bold">£50,000</span></li>
            <li className="flex justify-between items-center mb-2 text-xl text-black"><span className="mr-2.5">💵 Cash</span><span className="ml-5 font-bold">£20,000</span></li>
          </ul>
        </div>
        <div className="bg-[#ECECEC] p-5 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] w-[300px]">
          <h4 className="text-2xl mb-2.5 text-black/70">Liabilities</h4>
          <ul className="list-none p-0">
            <li className="flex justify-between items-center mb-2 text-xl text-black"><span className="mr-2.5">🏠 Mortgage (6%)</span><span className="ml-5 font-bold">£150,000</span></li>
            <li className="flex justify-between items-center mb-2 text-xl text-black"><span className="mr-2.5">🚗 Car Loan (10%)</span><span className="ml-5 font-bold">£20,000</span></li>
          </ul>
        </div>
      </div>

      {showResults ? (
        <div className="text-center mt-5">
          <h4 className="text-black">Correct Answer:</h4>
          <p className="inline-block text-[1.8rem] font-bold text-black my-5 mx-5 bg-[#B3E3D3] rounded-[50px] w-1/4 py-4 text-center">£100,000</p>
          <p className="text-black">Net Worth is</p>
          <p className="text-black"><strong>Total Assets – Total Liabilities</strong></p>
          <p className="text-black">£270,000 - £170,000</p>
          <h4 className="text-black font-bold mt-12">Your answers</h4>
          <div className="flex justify-center gap-5 mt-5">
            {teams.map((team, index) => (
              <div key={team.name} className="flex flex-col items-center">
                <p className="mb-1 font-bold text-black">{team.name}</p>
                <div className={`w-[50px] h-[50px] rounded-lg flex items-center justify-center text-2xl font-bold ${teamAnswers[index] === correctAnswer ? 'bg-[#B3E3D3] text-white' : 'bg-[#FF6B6B]/60 text-white'}`}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={nextQuestion} className="w-1/5 bg-[#003F91] text-white rounded-[30px] py-2.5 px-5 text-xl mt-5 hover:bg-blue-600">
            Next
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-center mt-5">
            <p className="text-xl font-bold text-black mb-2.5">What is his net worth?</p>
          </div>
          <div className="flex justify-center gap-2.5 mt-5">
            {['A. £20,000', 'B. £50,000', 'C. £100,000', 'D. £270,000', 'E. £440,000'].map((opt) => (
              <button key={opt} className="bg-[#B8CEF0] py-2.5 px-5 rounded-lg text-[#1e3a8a] text-xl font-bold hover:bg-[#bae6fd]">
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <h4 className="text-center">Your answers</h4>
            <div className="flex justify-center gap-5 mt-2.5">
              {teams.map((team, index) => (
                <div key={team.name} className="flex flex-col items-center">
                  <p className="mb-1 font-bold text-black">{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="p-2 rounded-lg border border-gray-300 bg-[#e0f2ff] text-xl text-center"
                  >
                    <option value="" disabled>Select answer</option>
                    {['A', 'B', 'C', 'D', 'E'].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={submitAnswers} className="w-1/5 bg-[#003F91] text-white rounded-[30px] py-2.5 px-5 text-xl mt-5 hover:bg-blue-600 block mx-auto">
            Submit
          </Button>
        </div>
      )}

      {showHintModal && (
        <div className="quiz-hint-overlay" onClick={() => setShowHintModal(false)}>
          <div className="bg-white p-5 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] w-[500px] text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[1.8rem] mb-2.5 text-black">Hint</h3>
            <p className="text-xl mb-5 text-[#333]">Net worth = Total Assets – Total Liabilities</p>
            <Button onClick={() => setShowHintModal(false)} className="bg-blue-500 text-white hover:bg-blue-600">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question1;
