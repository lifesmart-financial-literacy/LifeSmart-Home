import React, { useState, useEffect, useRef } from 'react';
import QuestionHeader from './QuestionHeader';

const Question2 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const whyRef = useRef(null);

  const correctAnswer = 'A';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
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
    // Scoring: 3 points for A, 2 for B, 1 for C, 0 for D/E
    const pointsArray = teamAnswers.map(answer => {
      if (answer === 'A') return 3;
      if (answer === 'B') return 2;
      if (answer === 'C') return 1;
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
      {/* Topbar */}
      <div className="financeQuest-question2-topbar-row">
        <div className="financeQuest-question2-points-box">
          <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="financeQuest-question2-points-icon" />
          <span className="financeQuest-question2-points-label">3 points</span>
        </div>
        <div className="financeQuest-question2-challenge-title">CHALLENGE 2</div>
        <div className="financeQuest-question2-timer-container">
          <button
            className="financeQuest-question2-timer-btn"
            aria-label="Start timer"
            onClick={() => { if (!timerStarted) startTimer(); }}
            style={{ cursor: timerStarted ? 'default' : 'pointer' }}
            disabled={timerStarted}
          >
            <div className="financeQuest-question2-timer-box">
              <span className="financeQuest-question2-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
            </div>
            <img
              src="/financeQuest/icons/8bitAlarm.png"
              alt="timer"
              className="financeQuest-question2-timer-icon"
            />
          </button>
        </div>
      </div>
      <div className="financeQuest-question2-pixel-bg">
        <div className="financeQuest-question2-main-card">
          {/* Story Section */}
          <div className="financeQuest-question2-story-box">
            <div className="financeQuest-question2-story-topbar">
              <span className="financeQuest-question2-story-ellipsis">&hellip;</span>
              <span className="financeQuest-question2-story-x">&#10005;</span>
            </div>
            <div className="financeQuest-question2-story-text">
              <span className="financeQuest-question2-story-year">Two months later, Zara lands her <b>first job</b> as a junior rover-tech. She earns <b>4,000 Mars Credits (MC) per month</b> after the mandatory "Oxygen-tax" has already been taken out.</span><br /><br />
              Below are her planned <b>monthly costs (all in MC):</b>
              <div className="financeQuest-question2-cost-table-wrapper">
                <table className="financeQuest-question2-cost-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Cost (MC)</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Habitat pod rent</td><td>Includes air-recycling fee</td><td>1150</td><td>Need</td></tr>
                    <tr><td>Life Support</td><td>Food, water, basic utilities</td><td>900</td><td>Need</td></tr>
                    <tr><td>Colony Data plan</td><td>Communicator & holo-net</td><td>210</td><td>Want</td></tr>
                    <tr><td>Exploration & Fun</td><td>Holo-games subscription, eating out with friends</td><td>580</td><td>Want</td></tr>
                    <tr><td>Safety Fund auto-transfer</td><td>Emergency Savings (20% of income target)</td><td>?</td><td>Savings</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Question Section */}
          <div className="financeQuest-question2-question-section">
            <span className="financeQuest-question2-question-title">How much money does she have <span style={{ color: '#A084F3' }}>left over</span> after all her expenses - including the safety fund?</span>
          </div>
          {/* Choices Section */}
          <div className="financeQuest-question2-choices-pixel-row">
            <div className={`financeQuest-question2-choice-modern-card${showResults ? ' financeQuest-question2-choice-correct' : ''}`}>
              <span className="financeQuest-question2-choice-circle"><span className="financeQuest-question2-choice-letter" style={{ fontFamily: 'Thertole, sans-serif' }}>A</span></span>
              <span className="financeQuest-question2-choice-value">120 MC</span>
            </div>
            <div className="financeQuest-question2-choice-modern-card">
              <span className="financeQuest-question2-choice-circle"><span className="financeQuest-question2-choice-letter" style={{ fontFamily: 'Thertole, sans-serif' }}>B</span></span>
              <span className="financeQuest-question2-choice-value">200 MC</span>
            </div>
            <div className="financeQuest-question2-choice-modern-card">
              <span className="financeQuest-question2-choice-circle"><span className="financeQuest-question2-choice-letter" style={{ fontFamily: 'Thertole, sans-serif' }}>C</span></span>
              <span className="financeQuest-question2-choice-value">360 MC</span>
            </div>
            <div className="financeQuest-question2-choice-modern-card">
              <span className="financeQuest-question2-choice-circle"><span className="financeQuest-question2-choice-letter" style={{ fontFamily: 'Thertole, sans-serif' }}>D</span></span>
              <span className="financeQuest-question2-choice-value">800 MC</span>
            </div>
            <div className="financeQuest-question2-choice-modern-card">
              <span className="financeQuest-question2-choice-circle"><span className="financeQuest-question2-choice-letter" style={{ fontFamily: 'Thertole, sans-serif' }}>E</span></span>
              <span className="financeQuest-question2-choice-value">3640 MC</span>
            </div>
          </div>
          {showResults && (
            <button className="financeQuest-question2-why-btn" onClick={() => whyRef.current && whyRef.current.scrollIntoView({ behavior: 'smooth' })}>
              WANT TO KNOW WHY?
            </button>
          )}
          {/* Team Answer Section */}
          <div className="financeQuest-question2-team-answer-section">
            <span className="financeQuest-question2-select-answers">Select your <span className="financeQuest-question2-answers-highlight">answers</span></span>
            <div className="financeQuest-question2-team-dropdowns">
              {teams.map((team, idx) => (
                <div className="financeQuest-question2-team-dropdown" key={team.name}>
                  <span className="financeQuest-question2-team-label">{idx + 1}. <b>{team.name}</b></span>
                  {showResults ? (
                    <div className={`financeQuest-question2-team-answer-box ${teamAnswers[idx] === correctAnswer ? 'financeQuest-question2-team-answer-correct' : 'financeQuest-question2-team-answer-incorrect'}`}>{teamAnswers[idx]}</div>
                  ) : (
                    <select
                      value={teamAnswers[idx]}
                      onChange={e => handleTeamAnswerChange(idx, e.target.value)}
                      className="financeQuest-question2-team-select"
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
              <button className="financeQuest-question2-submit-pixel" onClick={submitAnswers} disabled={teamAnswers.some(a => !a)}>SUBMIT</button>
            ) : (
              <button className="financeQuest-question2-submit-pixel" onClick={onNextQuestion}>NEXT QUESTION</button>
            )}
          </div>
          {showResults && (
            <div className="financeQuest-question2-why-section" ref={whyRef}>
              <div className="financeQuest-question2-why-title">KEY CALCULATIONS</div>
              <div className="financeQuest-question2-why-body">
                <ul style={{ marginLeft: 0, paddingLeft: 24 }}>
                  <li>
                    <strong>Safety Fund: 20% of 4,000 MC = 800 MC</strong>
                  </li>
                  <li>
                    <strong>Total Costs: 1,150 + 900 + 210 + 580 + 800 = 3,880 MC</strong>
                  </li>
                  <li>
                    <strong>Leftover: 4,000 - 3,880 = 120 MC</strong>
                  </li>
                </ul>
                <p style={{ marginTop: 18 }}>
                  The correct answer is <strong>120 MC</strong> (Option A). This is the money left after all expenses, including the safety fund auto-transfer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Question2;