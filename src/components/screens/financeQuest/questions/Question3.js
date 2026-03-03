import React, { useState, useEffect, useRef } from 'react';
import QuestionHeader from './QuestionHeader';

const Question3 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));
  const [showWhy, setShowWhy] = useState(false);
  const whyRef = useRef(null);

  // Points mapping: A=1, B=4, C=0, D=3, E=2
  const pointsMapping = { A: 1, B: 4, C: 0, D: 3, E: 2 };
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

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => pointsMapping[answer] || 0);
    onAwardPoints(pointsArray);
  };

  const nextQuestion = () => {
    onNextQuestion();
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <>
    <QuestionHeader />
    <div className="financeQuest-question3-pixel-bg">
      {/* Floating Planets */}
      <img src="/financeQuest/celestialBodies/Earth.png" alt="Earth" className="financeQuest-question3-planet earth" />
      <img src="/financeQuest/celestialBodies/Moon.png" alt="Moon" className="financeQuest-question3-planet moon" />
      <img src="/financeQuest/celestialBodies/Mars.png" alt="Mars" className="financeQuest-question3-planet mars" />
      {/* Top Bar Row */}
      <div className="financeQuest-question3-topbar-row">
        <div className="financeQuest-question3-points-box">
          <img src="/financeQuest/icons/8bitLightning.png" alt="Lightning Bolt" className="financeQuest-question3-points-icon" />
          <span className="financeQuest-question3-points-label">4 points</span>
        </div>
        <div className="financeQuest-question3-challenge-title">CHALLENGE 3</div>
        <div className="financeQuest-question3-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="financeQuest-question3-timer-btn">
              <span className="financeQuest-question3-timer-label">
                {minutes}:{seconds < 10 ? '0' + seconds : seconds}
              </span>
              <img  src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question3-timer-icon" />
            </button>
          ) : (
            <div className="financeQuest-question3-timer-btn financeQuest-question3-timer-btn-disabled">
              <span className="financeQuest-question3-timer-label">
                {minutes}:{seconds < 10 ? '0' + seconds : seconds}
              </span>
              <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question3-timer-icon" />
            </div>
          )}
        </div>
      </div>

      {/* Main Card/Story Box */}
      <div className="financeQuest-question3-main-content">
        <div className="financeQuest-question3-story-box">
          <div className="financeQuest-question3-story-topbar">
            <span className="financeQuest-question3-story-ellipsis">&hellip;</span>
            <span className="financeQuest-question3-story-x">&#10005;</span>
          </div>
          <div className="financeQuest-question3-story-text">
            Zara wants to <b>buy her own Mars-Rover scooter (6,000 MC)</b>. She has <b>120 MC left over each month</b>, so it will take her years to save up.<br /><br />
            She thinks of <b>5 ideas</b> to help her reach the goal faster.
          </div>
        </div>

        <div className="financeQuest-question3-question-text">
          Which one is the <span className="financeQuest-question3-purple">smartest</span> and most <span className="financeQuest-question3-purple">realistic choice?</span>
        </div>

        {/* Choices */}
        <div className="financeQuest-question3-choices-list">
          <div className="financeQuest-question3-choice-card">
            <span className="financeQuest-question3-choice-letter">A</span>
            Stop spending on fun. Saves 180 MC/month.
          </div>
          {showResults ? (
            <>
              <div className="financeQuest-question3-choice-card-correct">
                <span className="financeQuest-question3-choice-letter-correct">B</span>
                <b>Pay 500 MC for a 2-month skills course that leads to a pay rise.</b>
              </div>
              <button className="financeQuest-question3-why-btn" onClick={() => {
                setShowWhy(true);
                setTimeout(() => {
                  if (whyRef.current) {
                    whyRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 50);
              }}>WANT TO KNOW WHY?</button>
            </>
          ) : (
            <div className="financeQuest-question3-choice-card">
              <span className="financeQuest-question3-choice-letter">B</span>
              Pay 500 MC for a 2-month skills course that leads to a pay rise.
            </div>
          )}
          <div className="financeQuest-question3-choice-card">
            <span className="financeQuest-question3-choice-letter">C</span>
            Borrow 3,000 MC from cousin to invest in risky RedDustCoin.
          </div>
          <div className="financeQuest-question3-choice-card">
            <span className="financeQuest-question3-choice-letter">D</span>
            Use weekends to earn 500 MC/month doing freelance tech support.
          </div>
          <div className="financeQuest-question3-choice-card">
            <span className="financeQuest-question3-choice-letter">E</span>
            Use weekends to earn 500 MC/month doing freelance tech support.
          </div>
        </div>

        {/* Team Answers */}
        {!showResults ? (
          <div className="financeQuest-question3-team-answers-section">
            <div className="financeQuest-question3-team-answers-title">
              Select your <span className="financeQuest-question3-purple">answers</span>
            </div>
            <div className="financeQuest-question3-team-answers-list">
              {teams.map((team, index) => (
                <div key={team.name} className="financeQuest-question3-team-answer-box">
                  <div className="financeQuest-question3-team-name">{index + 1}. {team.name}</div>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="financeQuest-question3-team-answer-select"
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
              className="financeQuest-question3-submit-btn" 
              onClick={submitAnswers}
              disabled={teamAnswers.some(answer => !answer)}
            >
              SUBMIT
            </button>
          </div>
        ) : (
          <div className="financeQuest-question3-results-section">
            <div className="financeQuest-question3-results-title">Correct Answer: B</div>
            <div className="financeQuest-question3-results-answer">Pay 500 MC for a 2-month skills course that leads to a pay rise.</div>
            <div className="financeQuest-question3-results-list">
              {teams.map((team, index) => (
                <div key={team.name} className="financeQuest-question3-results-team-box">
                  <div className="financeQuest-question3-team-name">{index + 1}. {team.name}</div>
                  <div className={
                    `financeQuest-question3-results-team-answer ${teamAnswers[index] === correctAnswer ? 'financeQuest-question3-correct' : 'financeQuest-question3-incorrect'}`
                  }>
                    {teamAnswers[index] || '-'}
                  </div>
                  <div className="financeQuest-question3-results-team-points">
                    {pointsMapping[teamAnswers[index]] || 0} points
                  </div>
                </div>
              ))}
            </div>
            <button className="financeQuest-question3-next-btn" onClick={nextQuestion}>NEXT</button>
          </div>
        )}
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question3-hint-modal-overlay">
          <div className="question3-hint-modal">
            <h3>Hint</h3>
            <p>Think about which option gives Zara a permanent, sustainable increase in her ability to save for her goal, without risky debt or extreme sacrifice.</p>
            <button onClick={() => setShowHintModal(false)} className="question3-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {showWhy && (
        <div ref={whyRef} className="financeQuest-question3-why-section">
          <div className="financeQuest-question3-why-title">THE&nbsp;WHY</div>
          <div className="financeQuest-question3-why-body">
            Option B wins because spending money on an up-skilling course creates a permanent pay-rise, giving Zara more income every month without risky debt or extreme lifestyle cuts. The other choices either rely on unsustainable sacrifice (A), high risk and borrowing (C), extra time and limited scale (D), or small savings that take longer to reach the goal (E).
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Question3; 