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
      <div className="financeQuest-question4-pixel-bg">
        {/* Floating Planets */}
        <img src={PLANET_EARTH} alt="Earth" className="financeQuest-question4-planet earth" />
        <img src={PLANET_MOON} alt="Moon" className="financeQuest-question4-planet moon" />
        <img src={PLANET_MARS} alt="Mars" className="financeQuest-question4-planet mars" />
        {/* Top Bar Row */}
        <div className="financeQuest-question4-topbar-row">
          <div className="financeQuest-question4-points-box">
            <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="financeQuest-question4-points-icon" />
            <span className="financeQuest-question4-points-label">3 points</span>
          </div>
          <div className="financeQuest-question4-challenge-title">CHALLENGE 4</div>
          <div className="financeQuest-question4-timer-container">
            {!timerStarted ? (
              <button onClick={startTimer} className="financeQuest-question4-timer-btn">
                <span className="financeQuest-question4-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question4-timer-icon" />
              </button>
            ) : (
              <div className="financeQuest-question4-timer-btn financeQuest-question4-timer-btn-disabled">
                <span className="financeQuest-question4-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question4-timer-icon" />
              </div>
            )}
          </div>
        </div>
        <div className="financeQuest-question4-main-content">
          {/* Story Card */}
          <div className="financeQuest-question4-story-box">
            <div className="financeQuest-question4-story-topbar">
              <span className="financeQuest-question4-story-ellipsis">&hellip;</span>
              <span className="financeQuest-question4-story-x">&#10005;</span>
            </div>
            <div className="financeQuest-question4-story-text">
              A meteor storm is coming. Zara <b>needs to build an emergency "Shield Fund."</b><br />
              How much should she set aside based on her costs?
            </div>
            <div className="financeQuest-question4-cost-table-wrapper">
              <table className="financeQuest-question4-cost-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Cost (MC)</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Habitat pod rent</td><td>Includes air-recycling fee</td><td>1,150</td><td>Need</td></tr>
                  <tr><td>Life Support</td><td>Food, water, basic utilities</td><td>900</td><td>Need</td></tr>
                  <tr><td>Colony Data plan</td><td>Communicator & holo-net</td><td>210</td><td>Want</td></tr>
                  <tr><td>Exploration & Fun</td><td>Holo-games subscription, eating out with friends</td><td>580</td><td>Want</td></tr>
                  <tr><td>Safety Fund auto-transfer</td><td>Emergency Savings (20% of income target)</td><td>800</td><td>Savings</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Question Section */}
          <div className="financeQuest-question4-question-text">
            Which one is the <span className="financeQuest-question4-purple">smartest</span> and most <span className="financeQuest-question4-purple">realistic choice?</span>
          </div>
          {/* Choices */}
          <div className="financeQuest-question4-choices-list">
            {['A', 'B', 'C', 'D', 'E'].map((letter, idx) => {
              const values = ['2,050 MC', '6,150 MC', '3,640 MC', '12,300 MC', '10,920 MC'];
              const isCorrect = letter === correctAnswer && showResults;
              return (
                <div
                  key={letter}
                  className={`financeQuest-question4-choice-card${isCorrect ? ' financeQuest-question4-choice-correct' : ''}`}
                  style={isCorrect ? { background: '#023B35', color: '#fff', fontWeight: 'bold', border: '2px solid #1DE782' } : {}}
                >
                  <span className={`financeQuest-question4-choice-letter${isCorrect ? ' financeQuest-question4-choice-letter-correct' : ''}`}>{letter}</span>{values[idx]}
                </div>
              );
            })}
          </div>
          {/* WANT TO KNOW WHY Button */}
          {showResults && !showWhy && (
            <button
              className="financeQuest-question4-why-btn"
              onClick={() => setShowWhy(true)}
              style={{ margin: '32px auto 0 auto', display: 'block' }}
            >
              WANT TO KNOW WHY?
            </button>
          )}
          {/* Team Answers/Results */}
          {!showResults ? (
            <div className="financeQuest-question4-team-answers-section">
              <div className="financeQuest-question4-team-answers-title">
                Select your <span className="financeQuest-question4-purple">answers</span>
              </div>
              <div className="financeQuest-question4-team-answers-list">
                {teams.map((team, index) => (
                  <div key={team.name} className="financeQuest-question4-team-answer-box">
                    <div className="financeQuest-question4-team-name">{index + 1}. {team.name}</div>
                    <select
                      value={teamAnswers[index]}
                      onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                      className="financeQuest-question4-team-answer-select"
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
                className="financeQuest-question4-submit-btn" 
                onClick={submitAnswers}
                disabled={teamAnswers.some(answer => !answer)}
              >
                SUBMIT
              </button>
            </div>
          ) : (
            <div className="financeQuest-question4-results-section">
              <div className="financeQuest-question4-results-title">Correct Answer: B</div>
              <div className="financeQuest-question4-results-answer">6,150 MC</div>
              <div className="financeQuest-question4-results-list">
                {teams.map((team, index) => (
                  <div key={team.name} className="financeQuest-question4-results-team-box">
                    <div className="financeQuest-question4-team-name">{index + 1}. {team.name}</div>
                    <div className={
                      `financeQuest-question4-results-team-answer ${teamAnswers[index] === correctAnswer ? 'financeQuest-question4-correct' : 'financeQuest-question4-incorrect'}`
                    }>
                      {teamAnswers[index] || '-'}
                    </div>
                    <div className="financeQuest-question4-results-team-points">
                      {teamAnswers[index] === correctAnswer ? 3 : 0} points
                    </div>
                  </div>
                ))}
              </div>
              <button className="financeQuest-question4-next-btn" onClick={nextQuestion}>NEXT</button>
            </div>
          )}
          {/* THE WHY Section */}
          {showResults && showWhy && (
            <div className="financeQuest-question4-why-section">
              <hr className="financeQuest-question4-why-divider" />
              <div className="financeQuest-question4-why-title">THE WHY</div>
              <div className="financeQuest-question4-why-text">
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
        <div className="financeQuest-question4-glossary-sidebar">
          <div className="financeQuest-question4-glossary-header">
            <h2>{glossaryTitle}</h2>
            <button className="financeQuest-question4-close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="financeQuest-question4-glossary-content">
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="financeQuest-question4-hint-modal-overlay">
          <div className="financeQuest-question4-hint-modal">
            <h3>Hint</h3>
            <p>Consider the risk and potential return of each investment option.</p>
            <button onClick={() => setShowHintModal(false)} className="financeQuest-question4-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="financeQuest-question4-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </>
  );
};

export default Question4; 