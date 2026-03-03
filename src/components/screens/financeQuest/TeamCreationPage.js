import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeamCreationPage = () => {
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState(['', '']);
  const [selectedTeam, setSelectedTeam] = useState(0);
  const maxTeams = 8;
  const navigate = useNavigate();

  const increaseTeams = () => {
    if (teamCount < maxTeams) {
      setTeamCount(prev => prev + 1);
      setTeams(prev => [...prev, '']);
    }
  };

  const decreaseTeams = () => {
    if (teamCount > 1) {
      setTeamCount(prev => prev - 1);
      setTeams(prev => prev.slice(0, -1));
      if (selectedTeam >= teamCount - 1) setSelectedTeam(teamCount - 2);
    }
  };

  const handleTeamNameChange = (index, value) => {
    setTeams(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleFocus = idx => setSelectedTeam(idx);

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamNames = teams.slice(0, teamCount).map(name => encodeURIComponent(name)).join(',');
    navigate(`/finance-quest-quiz?teams=${teamNames}`);
  };

  return (
    <div className="financeQuest-teamCreation-background">
      <div className="financeQuest-teamCreation-container" style={{ background: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
        <div className="financeQuest-teamCreation-title">START GAME</div>
        <form onSubmit={handleSubmit} className="financeQuest-teamCreation-teams">
          {[...Array(teamCount)].map((_, idx) => (
            <div className={
              'financeQuest-teamCreation-team-row' + (idx === selectedTeam ? ' selected' : '')
            } key={idx} style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                {idx === selectedTeam && (
                  <span className="financeQuest-teamCreation-arrow">▶</span>
                )}
                <span className={
                  'financeQuest-teamCreation-team-label' + (idx === selectedTeam ? ' selected' : '')
                }>
                  Team {idx + 1}
                </span>
              </div>
              <div className="financeQuest-teamCreation-input-pixel-wrapper">
                <input
                  className="financeQuest-teamCreation-input"
                  type="text"
                  placeholder="ENTER TEAM NAME"
                  value={teams[idx]}
                  onChange={e => handleTeamNameChange(idx, e.target.value)}
                  onFocus={() => handleFocus(idx)}
                  required
                />
              </div>
            </div>
          ))}
          {teamCount < maxTeams && (
            <button
              type="button"
              className="financeQuest-teamCreation-add-btn"
              onClick={increaseTeams}
            >
              + ADD TEAM
            </button>
          )}
          {teamCount > 1 && (
            <button
              type="button"
              className="financeQuest-teamCreation-remove-btn"
              onClick={decreaseTeams}
            >
              - REMOVE TEAM
            </button>
          )}
          <button
            type="submit"
            className="financeQuest-teamCreation-submit"
            disabled={teams.slice(0, teamCount).some(name => !name.trim())}
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamCreationPage;
