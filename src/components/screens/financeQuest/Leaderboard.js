import React, { useState, useEffect } from 'react';

const Leaderboard = ({ teams, quizComplete, onNextQuestion }) => {
  const [, setBarWidths] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [rankedTeams, setRankedTeams] = useState([]);
  const maxPoints = 23;

  // Calculate sorted and ranked teams
  useEffect(() => {
    if (!teams || teams.length === 0) return;

    // First sort the teams by points in descending order
    const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
    
    let currentRank = 1;
    let prevPoints = null;
    
    // Then calculate ranks, handling ties correctly
    const ranked = sortedTeams.map((team, index) => {
      // If this is the first team or has different points than previous team
      if (index === 0 || team.points !== prevPoints) {
        currentRank = index + 1;
      }
      
      prevPoints = team.points;
      return { ...team, rank: currentRank };
    });

    setRankedTeams(ranked);
  }, [teams]);

  const calculateBarWidth = (points) => {
    return (points / maxPoints) * 100;
  };

  const handleExpand = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  useEffect(() => {
    if (!rankedTeams || rankedTeams.length === 0) return;

    // Set initial widths to 0 for animation
    const initialWidths = {};
    rankedTeams.forEach(team => {
      initialWidths[team.name] = 0;
    });
    setBarWidths(initialWidths);

    // Animate bar widths with cascading delays
    setTimeout(() => {
      rankedTeams.forEach((team, index) => {
        setTimeout(() => {
          setBarWidths(prev => ({
            ...prev,
            [team.name]: calculateBarWidth(team.points)
          }));
        }, index * 300);
      });
    }, 200);
  }, [rankedTeams]);

  return (
    <div className="fq-leaderboard-bg min-h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="flex flex-row items-center justify-center mb-6 mt-8 w-full max-[700px]:mt-[18px]">
        <img src="/financeQuest/icons/8bitRedFlag.png" alt="flag" className="w-[54px] h-[54px] mr-[18px] [image-rendering:pixelated]" />
        <span className="text-[2.6rem] text-[#FFDF8C] tracking-[2px] font-['Press_Start_2P','VT323','Consolas',monospace] font-bold text-center mb-0" style={{ textShadow: '0 2px 0 #000, 0 0 8px #FFDF8C55' }}>LEADERBOARD</span>
      </div>
      <div className="bg-[#180237] border-[0.1rem] border-white rounded-[18px] shadow-[0_0_0_6px_#fff,0_8px_32px_#0008] w-[90vw] mx-auto py-8 relative flex flex-col items-center z-[2] max-[700px]:max-w-[99vw] max-[700px]:py-3 max-[700px]:py-8">
        <div className="w-full mx-auto flex justify-center">
          <table className="w-[90%] border-collapse border-spacing-0 max-[700px]:w-[99%] max-[700px]:text-[0.9rem]" style={{ borderSpacing: '0 18px', fontFamily: "'Press Start 2P', 'VT323', 'Consolas', monospace" }}>
            <tbody>
              {rankedTeams.map((team, idx) => [
                <tr key={team.name} className="bg-[#2B1A5A] rounded-xl shadow-[0_2px_0_#0008] text-white text-[1.25rem] h-16 transition-all duration-180 cursor-pointer hover:bg-[#3C2A6A] hover:shadow-[0_4px_12px_#FF9524aa] max-[700px]:text-[0.9rem] max-[700px]:h-11" onClick={() => handleExpand(team.name)} style={{ cursor: 'pointer' }}>
                  <td className="px-8 font-inherit text-[1.15rem] text-left align-middle w-12 max-[700px]:px-4">{idx + 1}.</td>
                  <td className="px-8 font-inherit text-[1.15rem] text-left align-middle w-[220px]">{team.name}</td>
                  <td className="px-8 font-inherit text-[1.15rem] text-right align-middle w-[120px]">{team.points} POINTS</td>
                </tr>,
                expandedTeam === team.name && (
                  <tr key={team.name + '-expanded'} className="[&>td]:p-0 [&>td]:bg-transparent [&>td]:border-none">
                    <td colSpan={3}>
                      <table className="w-full bg-[#1C0032] border-2 border-white rounded-[10px] mx-auto mb-3 font-['Press_Start_2P','VT323','Consolas',monospace] text-white text-[1.05rem] shadow-[0_2px_8px_#0008]">
                        <thead>
                          <tr>
                            <th className="text-[#FFDF8C] text-[1.1rem] uppercase tracking-[1px] py-2 px-[18px] text-left border-b border-white/20">Question</th>
                            <th className="text-[#FFDF8C] text-[1.1rem] uppercase tracking-[1px] py-2 px-[18px] text-left border-b border-white/20">Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.taskScores && Object.entries(team.taskScores).map(([q, pts]) => (
                            <tr key={q}>
                              <td className="py-2 px-[18px] text-left border-b border-white/20">Q{q}</td>
                              <td className="py-2 px-[18px] text-left border-b border-white/20">{pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )
              ])}
            </tbody>
          </table>
        </div>
        <img src="/financeQuest/icons/8bitStar.png" alt="star" className="fq-leaderboard-star absolute -bottom-6 -right-6 w-16 h-16 z-[3] max-[700px]:w-10 max-[700px]:h-10 max-[700px]:-bottom-3 max-[700px]:-right-3" />
      </div>
      <button className="fixed bottom-10 right-[60px] z-10 bg-[#180237] text-white border-[3px] border-white rounded-xl font-['Press_Start_2P','VT323','Consolas',monospace] text-[1.2rem] py-4 px-[38px] tracking-[2px] cursor-pointer shadow-[0_2px_0_#fff8,0_8px_32px_#0008] transition-all duration-180 hover:bg-white hover:text-[#180237] hover:border-[#FFDF8C] hover:shadow-[0_8px_24px_#FFDF8Caa,0_0_0_4px_#fff] max-[700px]:text-[0.9rem] max-[700px]:py-2 max-[700px]:px-[18px] max-[700px]:bottom-4 max-[700px]:right-3" style={{ textShadow: '0 2px 0 #fff8' }} onClick={onNextQuestion}>NEXT</button>
    </div>
  );
};

export default Leaderboard;
