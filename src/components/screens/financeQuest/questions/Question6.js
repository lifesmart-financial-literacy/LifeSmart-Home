/* eslint-disable no-unused-vars -- Icon imports reserved for future UI enhancements */
import React, { useState, useEffect } from 'react';
import { FaBook, FaSmile, FaChartLine, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';
import potIcon from '../../../../assets/icons/piggy_bank.png';
import QuestionHeader from './QuestionHeader';

const DEV_MODE = true; // Set to false to hide dev features

const PLANET_EARTH = '/financeQuest/celestialBodies/Earth.png';
const PLANET_MOON = '/financeQuest/celestialBodies/Moon.png';
const PLANET_MARS = '/financeQuest/celestialBodies/Mars.png';

const BASE_FUNDS = 10000;
const POINTS_MULTIPLIER = 1000;

const pots = [
  {
    letter: 'A',
    name: 'Training & Self-Development Pot',
    description: 'Money for building skills and learning.',
    icon: <FaBook color="#4DD7FF" size={24} />,
    color: '#4DD7FF',
  },
  {
    letter: 'B',
    name: 'Life-Experiences & Fun Pot',
    description: 'Money for hobbies, travel, and enjoyment.',
    icon: <FaSmile color="#FF9524" size={24} />,
    color: '#FF9524',
  },
  {
    letter: 'C',
    name: 'Investment Pot',
    description: 'Money to grow wealth over time.',
    icon: <FaChartLine color="#FFD43B" size={24} />,
    color: '#FFD43B',
  },
  {
    letter: 'D',
    name: 'Health & Well-being Pot',
    description: 'Money for fitness, health, and self-care.',
    icon: <FaHeartbeat color="#CA70E3" size={24} />,
    color: '#CA70E3',
  },
  {
    letter: 'E',
    name: 'Emergency Pot',
    description: 'Money for unexpected problems.',
    icon: <FaExclamationTriangle color="#E1551D" size={24} />,
    color: '#E1551D',
  }
];

function randomAllocation() {
  // Returns {A, B, C, D, E} with values summing to 100
  let remaining = 100;
  const vals = [];
  for (let i = 0; i < 4; i++) {
    const max = remaining - (4 - i);
    const val = Math.floor(Math.random() * (max + 1));
    vals.push(val);
    remaining -= val;
  }
  vals.push(remaining);
  // Shuffle
  for (let i = vals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [vals[i], vals[j]] = [vals[j], vals[i]];
  }
  return { A: vals[0], B: vals[1], C: vals[2], D: vals[3], E: vals[4] };
}

const Question6 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [teamAllocations, setTeamAllocations] = useState(
    teams.map(() => ({ A: '', B: '', C: '', D: '', E: '' }))
  );
  const [errors, setErrors] = useState(Array(teams.length).fill(''));

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

  const getTotalFunds = (team) => BASE_FUNDS + (team.points || 0) * POINTS_MULTIPLIER;

  const handleAllocationChange = (teamIdx, potLetter, value) => {
    let val = value.replace(/[^0-9]/g, '');
    if (val.length > 3) val = val.slice(0, 3);
    if (val !== '' && (parseInt(val) < 0 || parseInt(val) > 100)) return;
    setTeamAllocations(prev => {
      const updated = [...prev];
      updated[teamIdx] = { ...updated[teamIdx], [potLetter]: val };
      return updated;
    });
  };

  const getTotalPercent = (alloc) => {
    return pots.reduce((sum, pot) => sum + (parseInt(alloc[pot.letter]) || 0), 0);
  };

  const handleSubmit = () => {
    let hasError = false;
    const newErrors = teamAllocations.map((alloc, idx) => {
      const total = getTotalPercent(alloc);
      if (total !== 100) {
        hasError = true;
        return `Total must be 100% (currently ${total}%)`;
      }
      return '';
    });
    setErrors(newErrors);
    if (!hasError) {
      if (typeof onNextQuestion === 'function') {
        onNextQuestion(teamAllocations);
      }
    }
  };

  const randomizeAll = () => {
    setTeamAllocations(teams.map(() => randomAllocation()));
  };

  return (
    <>
      <QuestionHeader />
      <div className="financeQuest-question6-pixel-bg">
        {/* Floating Planets */}
        <img src={PLANET_EARTH} alt="Earth" className="financeQuest-question6-planet earth" />
        <img src={PLANET_MOON} alt="Moon" className="financeQuest-question6-planet moon" />
        <img src={PLANET_MARS} alt="Mars" className="financeQuest-question6-planet mars" />
        {/* Top Bar Row */}
        <div className="financeQuest-question6-topbar-row">
          <div className="financeQuest-question6-points-box">
            <img src="/financeQuest/icons/8bitLightning.png" alt="points" className="financeQuest-question6-points-icon" />
            <span className="financeQuest-question6-points-label">3 points</span>
          </div>
          <div className="financeQuest-question6-challenge-title">GRAND FINALE</div>
          <div className="financeQuest-question6-timer-container">
            {!timerStarted ? (
              <button onClick={startTimer} className="financeQuest-question6-timer-btn">
                <span className="financeQuest-question6-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question6-timer-icon" />
              </button>
            ) : (
              <div className="financeQuest-question6-timer-btn financeQuest-question6-timer-btn-disabled">
                <span className="financeQuest-question6-timer-label">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                <img src="/financeQuest/icons/8bitAlarm.png" alt="Timer" className="financeQuest-question6-timer-icon" />
              </div>
            )}
          </div>
        </div>
        <div className="financeQuest-question6-main-content">
          {/* Story Card */}
          <div className="financeQuest-question6-story-box">
            <div className="financeQuest-question6-story-topbar">
              <span className="financeQuest-question6-story-ellipsis">&hellip;</span>
              <span className="financeQuest-question6-story-x">&#10005;</span>
            </div>
            <div className="financeQuest-question6-story-text">
              Zara just got <b>extra money from her family on Earth</b>.<br />
              She wants to <b>grow her net worth over the next <span className="financeQuest-question6-purple">7 years</span></b> and you need to help her.<br /><br />
              <span className="financeQuest-question6-purple">The team with the highest net worth wins!</span><br /><br />
              <span className="financeQuest-question6-white">Use your team's score from earlier as your starting amount.</span>
            </div>
          </div>
          <hr className="financeQuest-question6-divider" />
          {/* Task/Goal Section */}
          <div className="financeQuest-question6-task-text">
            <span className="financeQuest-question6-task-bold">TASK</span> - Allocate your team's funds across these pots. You can split your money however you like, but the total must add up to 100%.
            <br /><br />
            <span className="financeQuest-question6-task-italic">Choose wisely - surprises are coming over the next 7 years!</span>
          </div>
          {/* Pots Display */}
          <div className="financeQuest-question6-pots-grid">
            {pots.map((pot) => (
              <div key={pot.letter} className="financeQuest-question6-pot-card">
                <img src={potIcon} alt="Pot" className="financeQuest-question6-pot-icon" />
                <div className="financeQuest-question6-pot-title">{pot.name}</div>
                <div className="financeQuest-question6-pot-desc">{pot.description}</div>
              </div>
            ))}
          </div>
          <hr className="financeQuest-question6-divider" />
          {/* Team Allocations */}
          <div className="financeQuest-question6-team-answers-section">
            <div className="financeQuest-question6-team-answers-title">
              Allocate your funds (total must be 100%)
            </div>
            {DEV_MODE && (
              <button className="financeQuest-question6-dev-randomize-btn" onClick={randomizeAll}>
                Randomize All (DEV)
              </button>
            )}
            <div className="financeQuest-question6-team-answers-list">
              {teams.map((team, teamIdx) => {
                const alloc = teamAllocations[teamIdx];
                const total = getTotalPercent(alloc);
                const funds = getTotalFunds(team);
                return (
                  <div key={team.name} className="financeQuest-question6-team-answer-box">
                    <div className="financeQuest-question6-team-name">{teamIdx + 1}. {team.name}</div>
                    <div className="financeQuest-question6-allocation-cards">
                      {pots.map((pot) => (
                        <div key={pot.letter} className="financeQuest-question6-allocation-pot-row">
                          <span className="financeQuest-question6-allocation-pot-icon">{pot.icon}</span>
                          <span className="financeQuest-question6-allocation-pot-label" style={{ color: pot.color }}>{pot.name}</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={alloc[pot.letter]}
                            onChange={e => handleAllocationChange(teamIdx, pot.letter, e.target.value)}
                            className="financeQuest-question6-allocation-input"
                          />
                          <span className="financeQuest-question6-allocation-percent">%</span>
                          <span className="financeQuest-question6-allocation-amount">
                            (£{((parseInt(alloc[pot.letter]) || 0) * funds / 100).toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className={`financeQuest-question6-allocation-total${total !== 100 ? ' error' : ''}`}>Total: {total}%</div>
                    {errors[teamIdx] && <div className="financeQuest-question6-allocation-error">{errors[teamIdx]}</div>}
                  </div>
                );
              })}
            </div>
            <button 
              className="financeQuest-question6-submit-btn" 
              onClick={handleSubmit}
              disabled={teamAllocations.some(alloc => getTotalPercent(alloc) !== 100)}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Question6; 