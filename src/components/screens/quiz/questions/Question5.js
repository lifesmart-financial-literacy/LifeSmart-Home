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
    <div className="question5-container">
      {/* Header and Progress Bar */}
      <div className="question5-progress-bar-container">
        <div className="question5-progress-bar">
          <div className="question5-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question5-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question5-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question5-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question5-task-header">
        <div className="question5-top-layer">
          <div className="question5-points-section">
            <h3>Challenge 5</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question5-lightning-bolt" />
            <p className="question5-points">5 points</p>
          </div>
          <div className="question5-button-container">
            <button className="question5-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question5-task-header-question">
          <p>Ben decides he wants to get another loan in the future, so he would like to improve his 
            <span 
              className="question5-clickable-term"
              onMouseEnter={(e) => showHoverModal('Credit Rating', 'A score that shows how reliable you are at repaying money. A higher score means banks are more likely to lend to you.', e)}
              onMouseLeave={hideHoverModal}
            > credit rating</span>.
          </p>
          <img src={moneyBars} alt="Task 5 Image" className="question5-task-image" />
        </div>
      </div>

      {/* Question Section */}
      <div className="question5-question-section">
        <p className="question5-question-text">Which of the following things improve your 
          <span 
            className="question5-clickable-term"
            onMouseEnter={(e) => showHoverModal('Credit Rating', 'A score that shows how reliable you are at repaying money. A higher score means banks are more likely to lend to you.', e)}
            onMouseLeave={hideHoverModal}
          > credit rating</span>?
        </p>
      </div>

      {!showResults ? (
        <div>
          {/* Multiple Choice Options */}
          <div className="question5-choices-container">
            {answerOptions.map((option, index) => (
              <button key={index} className="question5-choice-button">
                {option}
              </button>
            ))}
          </div>

          {/* Team Answer Section */}
          <div className="question5-team-answer-section">
            <h4>Your answers (select all that apply)</h4>
            <div className="question5-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question5-team-answer-box">
                  <p>{team.name}</p>
                  <div className="question5-answer-bubbles">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => (
                      <button
                        key={letter}
                        className={`question5-answer-bubble ${teamAnswers[index].includes(letter) ? 'selected' : ''}`}
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

          <button className="question5-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question5-result-section">
          <h4>Answers:</h4>
          {answerOptions.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            return (
              <p key={index} className={correctAnswer.includes(letter) ? 'question5-correct-answer' : 'question5-incorrect-answer'}>
                {option}
              </p>
            );
          })}

          {/* Display each team's answer with comparison */}
          <div className="question5-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question5-team-answer-box">
                <p>{team.name}</p>
                <div className="question5-answers-display">
                  {teamAnswers[index].map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className={correctAnswer.includes(answer) ? 'question5-correct' : 'question5-incorrect'}
                    >
                      {answer}
                    </div>
                  ))}
                  {teamAnswers[index].length === 0 && <div className="question5-no-answer">-</div>}
                </div>
                <p className="question5-team-score">
                  Score: {teamAnswers[index].filter(answer => correctAnswer.includes(answer)).length}
                </p>
              </div>
            ))}
          </div>

          <button className="question5-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question5-hint-modal-overlay">
          <div className="question5-hint-modal">
            <h3>Hint</h3>
            <p>Think about what actions show banks that you're reliable with money.</p>
            <button onClick={() => setShowHintModal(false)} className="question5-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question5-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question5; 