import React, { useState, useEffect } from 'react';
import QuestionHeader from './QuestionHeader';

const PLANET_EARTH = '/financeQuest/celestialBodies/Earth.png';
const PLANET_MOON = '/financeQuest/celestialBodies/Moon.png';
const PLANET_MARS = '/financeQuest/celestialBodies/Mars.png';

const Question5 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));

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

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => (answer === correctAnswer ? 3 : 0));
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const choices = [
    {
      letter: 'A',
      text: 'Spend all 1,000 MC on fun (more holo-games and trips)'
    },
    {
      letter: 'B',
      text: 'Use 50/30/20 rule: 500 MC to needs, 300 MC to fun, 200 MC to savings'
    },
    {
      letter: 'C',
      text: 'Save all 1,000 MC – keep lifestyle the same'
    },
    {
      letter: 'D',
      text: 'Upgrade pod – new rent would cost the full 1,000 MC more'
    },
    {
      letter: 'E',
      text: 'Mix of fun and savings – spend 500 MC, save the other 500 MC'
    }
  ];

  return (
    <>
    <QuestionHeader />
    <div className="financeQuest-question5-pixel-bg">
      {/* Floating Planets */}
      <img src={PLANET_EARTH} alt="Earth" className="financeQuest-question5-planet earth" />
      <img src={PLANET_MOON} alt="Moon" className="financeQuest-question5-planet moon" />
      <img src={PLANET_MARS} alt="Mars" className="financeQuest-question5-planet mars" />
      {/* Top Bar Row */}
      <div className="financeQuest-question5-topbar-row">
        <div className="financeQuest-question5-points-box">
          <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="financeQuest-question5-points-icon" />
          <span className="financeQuest-question5-points-label">3 points</span>
        </div>
        <div className="financeQuest-question5-challenge-title">CHALLENGE 5</div>
        <div className="financeQuest-question5-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="financeQuest-question5-timer-btn">
              <span className="financeQuest-question5-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
              <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question5-timer-icon" />
            </button>
          ) : (
            <div className="financeQuest-question5-timer-btn financeQuest-question5-timer-btn-disabled">
              <span className="financeQuest-question5-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
              <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question5-timer-icon" />
            </div>
          )}
        </div>
      </div>
      <div className="financeQuest-question5-main-content">
        {/* Story Card */}
        <div className="financeQuest-question5-story-box">
          <div className="financeQuest-question5-story-topbar">
            <span className="financeQuest-question5-story-ellipsis">&hellip;</span>
            <span className="financeQuest-question5-story-x">&#10005;</span>
          </div>
          <div className="financeQuest-question5-story-text">
            Zara just got a <b>1,000 MC monthly pay rise</b>.<br />Her costs stay the same.<br /><br />
            How should she <b>use the extra money in a smart, balanced way?</b>
          </div>
          <div className="financeQuest-question5-cost-table-wrapper">
            <table className="financeQuest-question5-cost-table">
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
        <div className="financeQuest-question5-question-text">
          <span className="financeQuest-question5-goal">Goal</span> – decide the <span className="financeQuest-question5-purple">smartest way</span> to use the extra <b>1,000 MC</b> she will get every month, while <span className="financeQuest-question5-purple">guarding against lifestyle inflation</span>.
        </div>
        {/* Choices */}
        <div className="financeQuest-question5-choices-list">
          {choices.map((choice, idx) => {
            const isCorrect = choice.letter === correctAnswer && showResults;
            return (
              <div
                key={choice.letter}
                className={`financeQuest-question5-choice-card${isCorrect ? ' financeQuest-question5-choice-correct' : ''}`}
                style={isCorrect ? { background: '#023B35', color: '#fff', fontWeight: 'bold', border: '2px solid #1DE782' } : {}}
              >
                <span className={`financeQuest-question5-choice-letter${isCorrect ? ' financeQuest-question5-choice-letter-correct' : ''}`}>{choice.letter}</span>{choice.text}
              </div>
            );
          })}
        </div>
        {/* WANT TO KNOW WHY Button */}
        {showResults && !showWhy && (
          <button
            className="financeQuest-question5-why-btn"
            onClick={() => setShowWhy(true)}
            style={{ margin: '32px auto 0 auto', display: 'block' }}
          >
            WANT TO KNOW WHY?
          </button>
        )}
        {/* Team Answers/Results */}
        {!showResults ? (
          <div className="financeQuest-question5-team-answers-section">
            <div className="financeQuest-question5-team-answers-title">
              Select your <span className="financeQuest-question5-purple">answers</span>
            </div>
            <div className="financeQuest-question5-team-answers-list">
              {teams.map((team, index) => (
                <div key={team.name} className="financeQuest-question5-team-answer-box">
                  <div className="financeQuest-question5-team-name">{index + 1}. {team.name}</div>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="financeQuest-question5-team-answer-select"
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
              className="financeQuest-question5-submit-btn" 
              onClick={submitAnswers}
              disabled={teamAnswers.some(answer => !answer)}
            >
              SUBMIT
            </button>
          </div>
        ) : (
          <div className="financeQuest-question5-results-section">
            <div className="financeQuest-question5-results-title">Correct Answer: B</div>
            <div className="financeQuest-question5-results-answer">Use 50/30/20 rule: 500 MC to needs, 300 MC to fun, 200 MC to savings</div>
            <div className="financeQuest-question5-results-list">
              {teams.map((team, index) => (
                <div key={team.name} className="financeQuest-question5-results-team-box">
                  <div className="financeQuest-question5-team-name">{index + 1}. {team.name}</div>
                  <div className={
                    `financeQuest-question5-results-team-answer ${teamAnswers[index] === correctAnswer ? 'financeQuest-question5-correct' : 'financeQuest-question5-incorrect'}`
                  }>
                    {teamAnswers[index] || '-'}
                  </div>
                  <div className="financeQuest-question5-results-team-points">
                    {teamAnswers[index] === correctAnswer ? 3 : 0} points
                  </div>
                </div>
              ))}
            </div>
            <button className="financeQuest-question5-next-btn" onClick={nextQuestion}>NEXT</button>
          </div>
        )}
        {/* THE WHY Section */}
        {showResults && showWhy && (
          <div className="financeQuest-question5-why-section">
            <hr className="financeQuest-question5-why-divider" />
            <div className="financeQuest-question5-why-title">THE WHY</div>
            <div className="financeQuest-question5-why-text">
              <p>The 50/30/20 rule is a classic way to balance needs, wants, and savings. It helps Zara enjoy her raise, avoid lifestyle inflation, and build long-term security.</p>
              <p><b>50% Needs</b>: 500 MC<br/>
              <b>30% Fun</b>: 300 MC<br/>
              <b>20% Savings</b>: 200 MC</p>
              <p>This way, she gets to enjoy some of her extra money now, but also saves for the future!</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Question5; 