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
    <div className="fq-team-bg min-h-screen w-screen flex items-center justify-center relative overflow-hidden">
      <div className="flex flex-col items-center justify-center min-w-[350px] py-12 px-8 max-[600px]:min-w-0 max-[600px]:py-6 max-[600px]:px-2" style={{ background: 'none', borderRadius: 0, boxShadow: 'none', marginBottom: 0 }}>
        <div className="font-['Press_Start_2P',monospace] text-[#ffd43b] text-[2.5rem] tracking-[3px] mb-10 text-center max-[600px]:text-[1.3rem]">START GAME</div>
        <form onSubmit={handleSubmit} className="w-full mb-10">
          {[...Array(teamCount)].map((_, idx) => (
            <div className={`flex items-center mb-6 transition-transform duration-250 ease-in-out ${idx === selectedTeam ? 'translate-x-[18px]' : ''}`} key={idx} style={{ alignItems: 'center' }}>
              <div className="flex items-center min-w-[120px]">
                {idx === selectedTeam && (
                  <span className="text-[1.2rem] text-[#ff2d2d] mr-[18px] font-['Press_Start_2P',monospace] transition-all duration-250 ease-in-out" style={{ textShadow: '2px 2px 0 #2d1a4d' }}>▶</span>
                )}
                <span className={`font-['Press_Start_2P',monospace] text-white text-[1.1rem] mr-6 min-w-[120px] tracking-[1px] max-[600px]:text-[0.8rem] max-[600px]:min-w-[60px]`} style={{ textShadow: '2px 2px 0 #2d1a4d' }}>
                  Team {idx + 1}
                </span>
              </div>
              <div className="fq-input-pixel-wrapper relative inline-block w-full bg-[#090316] border-4 border-[#3E0B6E] mb-5 mx-3 box-border">
                <input
                  className="bg-transparent text-[#ccc] font-['Press_Start_2P',monospace] text-[1.1rem] border-none outline-none py-[1.1rem] px-[2.8rem] w-full box-border z-[1] text-center max-[600px]:text-[0.8rem] max-[600px]:py-2 max-[600px]:px-3 placeholder:text-white placeholder:opacity-70 disabled:bg-[#2d1a4d] disabled:text-[#aaa] disabled:opacity-70"
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
              className="block mx-auto mb-6 font-['Press_Start_2P',monospace] bg-[#181818] text-white text-base border-[3px] border-white rounded-none py-[0.7rem] px-10 cursor-pointer shadow-[0_2px_0_#2d1a4d] transition-all duration-150 hover:bg-[#333] hover:shadow-[0_4px_0_#2d1a4d] hover:scale-[1.04] active:bg-black active:shadow-[0_1px_0_#2d1a4d] active:scale-[0.98] tracking-[2px]"
              onClick={increaseTeams}
            >
              + ADD TEAM
            </button>
          )}
          {teamCount > 1 && (
            <button
              type="button"
              className="block mx-auto mb-6 font-['Press_Start_2P',monospace] bg-[#181818] text-white text-base border-[3px] border-white rounded-none py-[0.7rem] px-10 cursor-pointer shadow-[0_2px_0_#2d1a4d] transition-all duration-150 hover:bg-[#333] hover:shadow-[0_4px_0_#2d1a4d] hover:scale-[1.04] active:bg-black active:shadow-[0_1px_0_#2d1a4d] active:scale-[0.98] tracking-[2px]"
              onClick={decreaseTeams}
            >
              - REMOVE TEAM
            </button>
          )}
          <button
            type="submit"
            className="font-['Press_Start_2P',monospace] bg-[#181818] text-white text-[1.1rem] border-[3px] border-white rounded-none py-4 px-14 mt-6 cursor-pointer shadow-[0_4px_0_#2d1a4d] transition-all duration-150 hover:bg-[#333] hover:shadow-[0_8px_0_#2d1a4d] hover:scale-[1.04] active:bg-black active:shadow-[0_2px_0_#2d1a4d] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed tracking-[2px] block max-[600px]:text-[0.8rem] max-[600px]:py-[0.7rem] max-[600px]:px-6"
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
