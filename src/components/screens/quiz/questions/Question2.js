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
    <div className="question2-container">
      {/* Header and Progress Bar */}
      <div className="question2-progress-bar-container">
        <div className="question2-progress-bar">
          <div className="question2-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question2-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question2-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question2-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question2-task-header">
        <div className="question2-header-content">
          <div className="question2-points-section">
            <h3>Challenge 2</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question2-lightning-bolt" />
            <p className="question2-points">3 points</p>
          </div>
          <div className="question2-button-container">
            <button className="question2-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <p>
          Ben earns £60,000 a year. 
          <span 
            className="question2-clickable-term" 
            onMouseOver={(e) => showHoverModal('Income Tax', 'A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.', e)}
            onMouseLeave={hideHoverModal}
          >
            <strong>Income Tax</strong>
          </span>
          automatically comes out of his paycheck before he gets the money.
        </p>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="question2-glossary-sidebar">
          <div className="question2-glossary-header">
            <h2>{glossaryTitle}</h2>
            <button className="question2-close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="question2-glossary-content">
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question2-hint-modal-overlay">
          <div className="question2-hint-modal">
            <h3>Hint</h3>
            <p>The first £10,000 Ben earns doesn't get taxed at all. The next money he makes from £10,000 - £40,000 (which is £30,000) gets taxed at 20%. The remaining money he makes after £40,000 gets taxed at 40%.</p>
            <p>Calculate the total tax he pays and subtract it from his earnings.</p>
            <button onClick={() => setShowHintModal(false)} className="question2-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Tax Information Table */}
      <div className="question2-tax-info-table">
        <table>
          <thead>
            <tr>
              <th>Income</th>
              <th>
                <span 
                  className="question2-clickable-term" 
                  onMouseOver={(e) => showHoverModal('Tax Rate', "This tells you how much income tax you need to pay. It's like a rule that says how much money you give to the government based on how much money you make.", e)}
                  onMouseLeave={hideHoverModal}
                >
                  <strong>Tax Rate</strong>
                </span>
              </th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>£0 - £10,000</td>
              <td><span className="question2-tax-rate question2-tax-0">0%</span></td>
              <td>The first 10k is tax-free</td>
            </tr>
            <tr>
              <td>£10,000 - £40,000</td>
              <td><span className="question2-tax-rate question2-tax-20">20%</span></td>
              <td>You pay 20% tax on the money IN THIS BRACKET only</td>
            </tr>
            <tr>
              <td>£40,000 - £100,000</td>
              <td><span className="question2-tax-rate question2-tax-40">40%</span></td>
              <td>You pay 40% tax on the money IN THIS BRACKET only</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question2-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}

      {/* Conditionally display answer options or result section */}
      {!showResults ? (
        <div>
          {/* Question and Points Section */}
          <div className="question2-question-section">
            <p>How much money does he get in his account after tax?</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="question2-choices-container">
            <button className="question2-choice-button">A. £38,000</button>
            <button className="question2-choice-button">B. £42,000</button>
            <button className="question2-choice-button">C. £46,000</button>
            <button className="question2-choice-button">D. £48,000</button>
            <button className="question2-choice-button">E. £50,000</button>
          </div>

          {/* Team Answer Section */}
          <div className="question2-team-answer-section">
            <h4>Your answers</h4>
            <div className="question2-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question2-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question2-answer-select"
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
          <button className="question2-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question2-result-section">
          <h4>Correct Answer:</h4>
          <p className="question2-correct-answer">£46,000</p>
          <p onClick={toggleExpandedAnswer} className="question2-detailed-answer-toggle">
            Click to see detailed answer
            <span>{showExpandedAnswer ? '⬆️' : '⬇️'}</span>
          </p>

          {/* Expanded Answer (Detailed Explanation) */}
          {showExpandedAnswer && (
            <div className="question2-expanded-answer">
              <table>
                <thead>
                  <tr>
                    <th>Income</th>
                    <th>Tax rate</th>
                    <th>Calculations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>£0 - £10,000</td>
                    <td><span className="question2-tax-rate question2-tax-0">0%</span></td>
                    <td>£0</td>
                  </tr>
                  <tr>
                    <td>£10,000 - £40,000</td>
                    <td><span className="question2-tax-rate question2-tax-20">20%</span></td>
                    <td>£30,000 <span style={{ color: 'blue' }}>X</span> 20% = £6,000</td>
                  </tr>
                  <tr>
                    <td>£40,000 - <span className="question2-income-text">£60,000</span></td>
                    <td><span className="question2-tax-rate question2-tax-40">40%</span></td>
                    <td>£20,000 <span style={{ color: 'blue' }}>X</span> 40% = £8,000</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="question2-end-text">
                      <p><strong>Total tax paid:</strong> £6,000 + £8,000 = <span className="question2-tax-paid-text">£14,000</span></p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="question2-centered-text">
                      <p><strong>Total income left to take home</strong></p>
                      <p><span className="question2-income-text">£60,000</span> - <span className="question2-tax-paid-text">£14,000</span> = <span className="question2-correct-answer">£46,000</span></p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Display each team's answer with comparison */}
          <div className="question2-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question2-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question2-correct' : 'question2-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>

          <button className="question2-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Question2; 