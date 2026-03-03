import React, { useState, useEffect } from 'react';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import blueCash from '../../../../assets/icons/bluecash.png';

const Question3 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(480);
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
  const [detailsVisible, setDetailsVisible] = useState({
    A: false,
    B: false,
    C: false,
    D: false,
    E: false
  });

  const pointsMapping = {
    A: 7,
    B: 10,
    C: 8,
    D: 6,
    E: 4
  };

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
  const progressBarWidth = (timer / 480) * 100;

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
    if (term === 'mortgage') {
      setGlossaryTitle('Mortgage');
      setGlossaryContent('A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.');
    } else if (term === 'cryptocurrency') {
      setGlossaryTitle('Cryptocurrency');
      setGlossaryContent('A type of money you can use on a computer but can\'t touch like coins or bills. It\'s made using special computer codes, and you can use it to buy things online.');
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    const pointsArray = teamAnswers.map(answer => pointsMapping[answer] || 0);
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  const toggleDetails = (option) => {
    setDetailsVisible(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  const getPoints = (answer) => {
    return pointsMapping[answer] || 0;
  };

  const getPointsColor = (points) => {
    const minPoints = 0;
    const maxPoints = 10;
    const coldColor = [0, 0, 255]; // Cold: Blue (RGB)
    const warmColor = [0, 255, 0];   // Warm: Green (RGB)

    const ratio = (points - minPoints) / (maxPoints - minPoints);

    const r = Math.round(coldColor[0] + ratio * (warmColor[0] - coldColor[0]));
    const g = Math.round(coldColor[1] + ratio * (warmColor[1] - coldColor[1]));
    const b = Math.round(coldColor[2] + ratio * (warmColor[2] - coldColor[2]));

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="question3-container">
      {/* Header and Progress Bar */}
      <div className="question3-progress-bar-container">
        <div className="question3-progress-bar">
          <div className="question3-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question3-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question3-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question3-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question3-task-header">
        <div className="question3-top-layer">
          <div className="question3-points-section">
            <h3>Challenge 3</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question3-lightning-bolt" />
            <p className="question3-points">10 points</p>
          </div>
          <div className="question3-button-container">
            <button className="question3-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question3-task-header-question">
          <p>Ben inherits a £20,000 gift from an old uncle. He has several options on what to do with the money.</p>
          <img src={blueCash} alt="Task 3 scenario" className="question3-task-image" />
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="question3-glossary-sidebar">
          <div className="question3-glossary-header">
            <h2>{glossaryTitle}</h2>
            <button className="question3-close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="question3-glossary-content">
            <p>{glossaryContent}</p>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question3-hint-modal-overlay">
          <div className="question3-hint-modal">
            <h3>Hint</h3>
            <p>Net worth = Total Assets – Total Liabilities</p>
            <button onClick={() => setShowHintModal(false)} className="question3-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Assets and Liabilities Section */}
      <div className="question3-assets-liabilities-wrapper">
        <div className="question3-assets-liabilities">
          <div className="question3-card">
            <h4>Assets</h4>
            <ul>
              <li>
                <span className="question3-asset-icon">🏠 House</span>
                <span className="question3-asset-value">£200,000</span>
              </li>
              <li>
                <span className="question3-asset-icon">🚗 Car</span>
                <span className="question3-asset-value">£50,000</span>
              </li>
              <li>
                <span className="question3-asset-icon">💵 Cash</span>
                <span className="question3-asset-value">£20,000</span>
              </li>
            </ul>
          </div>
          <div className="question3-card">
            <h4>Liabilities</h4>
            <ul>
              <li>
                <span className="question3-asset-icon">🏠 
                  <span className="question3-clickable-term"
                        onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                        onMouseLeave={hideHoverModal}>
                    <strong>Mortgage</strong>
                  </span> 
                  (6%)
                </span>
                <span className="question3-asset-value">£150,000</span>
              </li>
              <li>
                <span className="question3-asset-icon">🚗 Car Loan (10%)</span>
                <span className="question3-asset-value">£20,000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Conditionally display answer options or result section */}
      {!showResults ? (
        <div>
          {/* Question and Points Section */}
          <div className="question3-question-section">
            <p>What should he do with the money?</p>
          </div>

          {/* Options List Before Submission */}
          <div className="question3-options-list-before">
            <ol>
              <li>A. Pay off some of his
                <span className="question3-clickable-term"
                      onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                      onMouseLeave={hideHoverModal}>
                  <strong>Mortgage</strong>
                </span>
                (house loan)
              </li>
              <li>B. Pay off his car loan</li>
              <li>C. Spend the money on a training and self-development course</li>
              <li>
                <span className="question3-option-text">D. Invest in a new 
                  <span className="question3-clickable-term"
                        onMouseOver={(e) => showHoverModal('Cryptocurrency', 'A type of money you can use on a computer but can\'t touch like coins or bills. It\'s made using special computer codes, and you can use it to buy things online.', e)}
                        onMouseLeave={hideHoverModal}>
                    <strong>cryptocurrency</strong>
                  </span> 
                  coin his friend has just bought (Skibidicoin)
                </span>
              </li>
              <li>E. Put the money in a savings account (paying 3% interest)</li>
            </ol>
          </div>

          {/* Team Answer Section */}
          <div className="question3-team-answer-section">
            <h4>Your answers</h4>
            <div className="question3-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question3-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question3-answer-select"
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
          <button className="question3-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question3-result-section">
          <h4>Points Breakdown:</h4>
          <p className="question3-points-breakdown">Here's how many points each option scores:</p>

          {/* Options List After Submission */}
          <div className="question3-options-list-after">
            <ol>
              {['A', 'B', 'C', 'D', 'E'].map((option) => (
                <li key={option} onClick={() => toggleDetails(option)}>
                  <div className="question3-top">
                    <span className="question3-option-text">
                      {option === 'A' && `A. Pay off some of his `}
                      {option === 'A' && (
                        <span className="question3-clickable-term"
                              onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                              onMouseLeave={hideHoverModal}>
                          <strong>Mortgage</strong>
                        </span>
                      )}
                      {option === 'A' && ` (house loan)`}
                      {option === 'B' && 'B. Pay off his car loan'}
                      {option === 'C' && 'C. Spend the money on a training and self-development course'}
                      {option === 'D' && (
                        <>
                          D. Invest in a new{' '}
                          <span className="question3-clickable-term"
                                onMouseOver={(e) => showHoverModal('Cryptocurrency', 'A type of money you can use on a computer but can\'t touch like coins or bills. It\'s made using special computer codes, and you can use it to buy things online.', e)}
                                onMouseLeave={hideHoverModal}>
                            <strong>cryptocurrency</strong>
                          </span>
                          {' '}coin his friend has just bought (Skibidicoin)
                        </>
                      )}
                      {option === 'E' && 'E. Put the money in a savings account (paying 3% interest)'}
                    </span>
                    <span className="question3-points-display">
                      <img src={lightningBolt} alt="Lightning Bolt" className="question3-lightning-bolt" />
                      {pointsMapping[option]} points
                    </span>
                  </div>
                  {detailsVisible[option] && (
                    <div className="question3-details-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Assets</th>
                            <th>Liabilities</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>House £200,000</td>
                            <td>
                              <span className="question3-clickable-term"
                                    onMouseOver={(e) => showHoverModal('Mortgage', 'A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.', e)}
                                    onMouseLeave={hideHoverModal}>
                                <strong>Mortgage</strong>
                              </span>
                              £150,000
                            </td>
                          </tr>
                          <tr>
                            <td>Car £50,000</td>
                            <td>Car Loan £20,000</td>
                          </tr>
                          <tr>
                            <td>Cash £{option === 'A' ? '28,000' : option === 'B' ? '35,000' : option === 'C' ? '50,000' : option === 'D' ? '25,000' : '45,000'}</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td><strong>Total: £{option === 'A' ? '278,000' : option === 'B' ? '285,000' : option === 'C' ? '300,000' : option === 'D' ? '275,000' : '275,000'}</strong></td>
                            <td><strong>Total: £{option === 'B' ? '150,000' : '170,000'}</strong></td>
                          </tr>
                          <tr>
                            <td colSpan="2"><strong>Net Worth = £{option === 'A' ? '128,000' : option === 'B' ? '135,000' : option === 'C' ? '130,000' : option === 'D' ? '105,000' : '125,000'}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Team Answers with Points */}
          <div className="question3-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question3-team-answer-box">
                <p>{team.name}</p>
                <div className="question3-points-earned" style={{ backgroundColor: getPointsColor(getPoints(teamAnswers[index])) }}>
                  {getPoints(teamAnswers[index])} points
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button className="question3-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question3-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question3; 