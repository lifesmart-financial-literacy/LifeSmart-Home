/* eslint-disable no-unused-vars -- Question has placeholder state for future glossary/hint features */
import React, { useState, useEffect, useRef } from 'react';
import QuestionHeader from './QuestionHeader';

const PLANET_EARTH = '/financeQuest/celestialBodies/Earth.png';
const PLANET_MOON = '/financeQuest/celestialBodies/Moon.png';
const PLANET_MARS = '/financeQuest/celestialBodies/Mars.png';
const ALARM_CLOCK = '/financeQuest/icons/8bitAlarm.png';

const Question1 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverTerm, setHoverTerm] = useState(null);
  const [hoverContent, setHoverContent] = useState('');
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const [showHoverModal, setShowHoverModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
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
  const progressBarWidth = (timer / 180) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
      setTimer(180);
    }
  };

  const showModal = (term, event) => {
    if (term === 'assets') {
      setModalTitle('Assets');
      setModalContent('Assets are things you own that have monetary value, such as cash, property, or investments.');
    } else if (term === 'liabilities') {
      setModalTitle('Liabilities');
      setModalContent('Liabilities are things you owe, such as debts or financial obligations.');
    }
    setShowHoverModal(true);

    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY - 60,
      left: rect.left + window.scrollX + 20,
    });
  };

  const hideModal = () => {
    setShowHoverModal(false);
  };

  const showDefinition = (term, event) => {
    setHoverTerm(term);
    if (term === 'assets') {
      setHoverContent('Things you own that are worth money.');
    } else if (term === 'liabilities') {
      setHoverContent('Money you owe to someone else.');
    }
    const rect = event.target.getBoundingClientRect();
    setBubblePosition({
      top: rect.top + window.scrollY - 40,
      left: rect.left + window.scrollX + 10
    });
  };

  const hideDefinition = () => {
    setHoverTerm(null);
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => {
      if (answer === 'A') return 3;
      if (answer === 'B') return 2;
      if (answer === 'E') return 1;
      // C and D give 0
      return 0;
    });
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
      <div className="financeQuest-question1-topbar-row">
        <div className="financeQuest-question1-points-box">
          <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="financeQuest-question1-points-icon" />
          <span className="financeQuest-question1-points-label">3 points</span>
        </div>
        <div className="financeQuest-question1-challenge-title">CHALLENGE 1</div>
        <div className="financeQuest-question1-timer-container">
          <button
            className="financeQuest-question1-timer-btn"
            aria-label="Start timer"
            onClick={() => { if (!timerStarted) startTimer(); }}
            style={{ cursor: timerStarted ? 'default' : 'pointer' }}
            disabled={timerStarted}
          >
            <div className="financeQuest-question1-timer-box">
              <span className="financeQuest-question1-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
            </div>
            <img
              src="/financeQuest/icons/8bitAlarm.png"
              alt="timer"
              className="financeQuest-question1-timer-icon"
            />
          </button>
        </div>
      </div>
      <div className="financeQuest-question1-pixel-bg">
        {/* Floating Planets */}
        <img src={PLANET_EARTH} alt="Earth" className="financeQuest-question1-planet earth" />
        <img src={PLANET_MOON} alt="Moon" className="financeQuest-question1-planet moon" />
        <img src={PLANET_MARS} alt="Mars" className="financeQuest-question1-planet mars" />
        {/* Main Content Card */}
        <div className="financeQuest-question1-main-card">
          {/* Story Section */}
          <div className="financeQuest-question1-story-box">
            <div className="financeQuest-question1-story-topbar">
              <span className="financeQuest-question1-story-ellipsis">&hellip;</span>
              <span className="financeQuest-question1-story-x">&#10005;</span>
            </div>
            <div className="financeQuest-question1-story-text">
              <span className="financeQuest-question1-story-year">The year is <b>2150</b>.</span><br />
              Zara, 18-years-old, has just move to the New Horizon city on <b>Mars</b>. She's given 10,000 Mars Credits (MC) to start her new life.<br /><br />
              She has to <b>split the money</b> across <b>four categories</b>:<br />
              <span className="financeQuest-question1-story-categories">
                <span className="financeQuest-question1-story-category">
                  <img src="/financeQuest/icons/8bitPotion.png" alt="Habitat Icon" className="financeQuest-question1-story-icon" />
                  <b>Habitat</b> (life pod, air recycling)
                </span><br />
                <span className="financeQuest-question1-story-category">
                  <img src="/financeQuest/icons/8bitPinkHeart.png" alt="Life-Support Icon" className="financeQuest-question1-story-icon" />
                  <b>Life-Support</b> (food, water, utilities)
                </span><br />
                <span className="financeQuest-question1-story-category">
                  <img src="/financeQuest/icons/8bitDiamond.png" alt="Safety Fund Icon" className="financeQuest-question1-story-icon" />
                  <b>Safety Fund</b> (unexpected repairs)
                </span><br />
                <span className="financeQuest-question1-story-category">
                  <img src="/financeQuest/icons/8bitStoneSword.png" alt="Exploration & Fun Icon" className="financeQuest-question1-story-icon" />
                  <b>Exploration & Fun</b> (holo-games, rover trips)
                </span>
              </span>
            </div>
          </div>
          {/* Question Section */}
          <div className="financeQuest-question1-question-section">
            <span className="financeQuest-question1-question-title">Decide the <span className="financeQuest-question1-best-split">best split</span> for her money</span>
          </div>
          {/* Choices Section */}
          <div className="financeQuest-question1-choices-pixel-grid">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={showResults ? "/financeQuest/pieCharts/correctPieChartA.png" : "/financeQuest/pieCharts/drawnPieChartA.png"} alt="A" className="financeQuest-question1-choice-pie" />
              {showResults && (
                <button className="financeQuest-question1-why-btn" onClick={() => whyRef.current && whyRef.current.scrollIntoView({ behavior: 'smooth' })}>
                  WANT TO KNOW WHY?
                </button>
              )}
            </div>
            <img src="/financeQuest/pieCharts/drawnPieChartB.png" alt="B" className="financeQuest-question1-choice-pie" />
            <img src="/financeQuest/pieCharts/drawnPieChartC.png" alt="C" className="financeQuest-question1-choice-pie" />
            <img src="/financeQuest/pieCharts/drawnPieChartD.png" alt="D" className="financeQuest-question1-choice-pie" />
            <img src="/financeQuest/pieCharts/drawnPieChartE.png" alt="E" className="financeQuest-question1-choice-pie" />
          </div>
          {/* Team Answer Section */}
          <div className="financeQuest-question1-team-answer-section">
            <span className="financeQuest-question1-select-answers">Select your <span className="financeQuest-question1-answers-highlight">answers</span></span>
            <div className="financeQuest-question1-team-dropdowns">
              {teams.map((team, idx) => (
                <div className="financeQuest-question1-team-dropdown" key={team.name}>
                  <span className="financeQuest-question1-team-label">{idx + 1}. <b>{team.name}</b></span>
                  {showResults ? (
                    <div className={`financeQuest-question1-team-answer-box ${teamAnswers[idx] === 'A' ? 'financeQuest-question1-team-answer-correct' : 'financeQuest-question1-team-answer-incorrect'}`}>{teamAnswers[idx]}</div>
                  ) : (
                    <select
                      value={teamAnswers[idx]}
                      onChange={e => handleTeamAnswerChange(idx, e.target.value)}
                      className="financeQuest-question1-team-select"
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
              <button className="financeQuest-question1-submit-pixel" onClick={submitAnswers} disabled={teamAnswers.some(a => !a)}>SUBMIT</button>
            ) : (
              <button className="financeQuest-question1-submit-pixel" onClick={onNextQuestion}>NEXT QUESTION</button>
            )}
          </div>
          {showResults && (
            <div className="financeQuest-question1-why-section" ref={whyRef}>
              <div className="financeQuest-question1-why-title">THE WHY</div>
              <div className="financeQuest-question1-why-body">
                <ul style={{ marginLeft: 0, paddingLeft: 24 }}>
                  <li>
                    <strong>Follows the 50 / 30 / 20 rule.</strong>
                    <ul style={{ marginTop: 8, marginBottom: 8 }}>
                      <li><strong>Needs (Habitat + Life-Support): ≈50 %</strong> – keeps Zara safe and healthy.</li>
                      <li><strong>Savings (Safety Fund): ≈20 %</strong> – builds an emergency cushion for Mars mishaps.</li>
                      <li><strong>Wants (Exploration & Fun): ≈30 %</strong> – leaves room for enjoyment without derailing her budget.</li>
                    </ul>
                  </li>
                </ul>
                <p style={{ marginTop: 18 }}>
                  Allocations that push <strong>too much into Wants</strong> or <strong>too little into Savings</strong> score fewer points because they increase the risk of running short when an unexpected repair or expense hits.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Question1; 