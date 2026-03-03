import React from 'react';

const potNames = {
  A: 'Training & Self-Development',
  B: 'Life-Experiences & Fun',
  C: 'Investment',
  D: 'Health & Well-being',
  E: 'Emergency',
};

const potColors = {
  A: '#4DD7FF',
  B: '#FF9524',
  C: '#FFD43B',
  D: '#CA70E3',
  E: '#E1551D',
};

// Placeholder for pot icons (replace with actual icon paths if available)
const potIcons = {
  A: null, // e.g. <img src={require('...')} alt="A" className="financeQuest-results-pot-icon" />
  B: null,
  C: null,
  D: null,
  E: null,
};

const FinanceQuestResultsScreen = ({ results, onRestart }) => {
  // results: [{ name, yearly: [ {A, B, C, D, E, total}, ... ] }]
  const finalResults = results.map(team => ({
    ...team,
    final: team.yearly[team.yearly.length - 1]
  }));
  const sorted = [...finalResults].sort((a, b) => b.final.total - a.final.total);
  const winner = sorted[0];

  return (
    <div className="financeQuest-results-root">
      <h2 className="financeQuest-results-title">🏆 Finance Quest Results 🏆</h2>
      <div className="financeQuest-results-cards">
        {sorted.map((team, idx) => (
          <div
            key={team.name}
            className={`financeQuest-results-card${team.name === winner.name ? ' winner' : ''}`}
          >
            <div className="financeQuest-results-team-name">
              {team.name} {team.name === winner.name && <span title="Winner">🏆</span>}
            </div>
            {Object.keys(potNames).map(l => (
              <div key={l} className="financeQuest-results-pot-row">
                {/* Pot icon placeholder */}
                {potIcons[l] && potIcons[l]}
                <span style={{ fontWeight: 700 }}>{potNames[l]}:</span>
                <span style={{ color: potColors[l], marginLeft: 8, fontWeight: 700 }}>
                  £{Math.round(team.final[l]).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="financeQuest-results-total">
              Total: £{Math.round(team.final.total).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <button className="financeQuest-results-return-btn" onClick={onRestart}>
        Return to Home
      </button>
    </div>
  );
};

export default FinanceQuestResultsScreen; 