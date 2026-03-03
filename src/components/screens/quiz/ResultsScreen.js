import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import crownIcon from '../../../assets/icons/crown.png';

const ResultsScreen = ({ teams, quizComplete, onNextQuestion }) => {
  const [barWidths, setBarWidths] = useState({});
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [rankedTeams, setRankedTeams] = useState([]);
  const navigate = useNavigate();
  const maxPoints = 23;

  useEffect(() => {
    if (!teams || teams.length === 0) return;
    const sorted = [...teams].sort((a, b) => b.points - a.points);
    const ranked = sorted.reduce((acc, team, index) => {
      const rank = index === 0 || team.points !== sorted[index - 1].points ? index + 1 : acc[index - 1].rank;
      return [...acc, { ...team, rank }];
    }, []);
    setRankedTeams(ranked);
  }, [teams]);

  const calculateBarWidth = (points) => (points / maxPoints) * 100;
  const toggleTeamExpansion = (name) => setExpandedTeam(expandedTeam === name ? null : name);

  useEffect(() => {
    if (!rankedTeams.length) return;
    setBarWidths(Object.fromEntries(rankedTeams.map((t) => [t.name, 0])));
    const t = setTimeout(() => {
      rankedTeams.forEach((team, index) => {
        setTimeout(() => {
          setBarWidths((prev) => ({ ...prev, [team.name]: calculateBarWidth(team.points) }));
        }, index * 300);
      });
    }, 200);
    return () => clearTimeout(t);
  }, [rankedTeams]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-10 rounded-[20px] overflow-hidden box-border bg-[linear-gradient(135deg,#1a2a6c,#b21f1f,#fdbb2d)] bg-[length:400%_400%] animate-[gradientBG_15s_ease_infinite] shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-[fadeIn_1s_ease-out]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px] z-[1]" />
      <Button
        onClick={() => navigate('/')}
        className="absolute top-8 left-10 z-[1000] py-4 px-8 bg-white/90 text-[#1a2a6c] rounded-[25px] font-semibold text-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:bg-white min-w-[150px]"
      >
        Go to Home
      </Button>
      <h2 className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] py-4 px-8 bg-white/90 rounded-[15px] text-3xl text-[#1a2a6c] font-bold shadow-[0_4px_15px_rgba(0,0,0,0.2)] animate-[slideDown_0.5s_ease-out]">
        Scoreboard
      </h2>

      <div className="relative z-[2] flex flex-col items-center justify-center w-full h-[calc(100%-120px)] overflow-y-auto py-10 mt-5">
        <div className="flex flex-col items-center gap-6 w-full max-w-[900px] p-5 mx-auto">
          {rankedTeams.map((team, index) => (
            <div
              key={team.name}
              onClick={() => toggleTeamExpansion(team.name)}
              className={`flex flex-col w-full min-h-[70px] p-6 rounded-[15px] cursor-pointer transition-all duration-300 border border-white/20 backdrop-blur-[5px] overflow-hidden
                ${expandedTeam === team.name ? 'min-h-[320px] bg-white/20 pb-8' : 'bg-white/10'}
                ${team.rank === 1 ? 'bg-[#C5FF9A]' : ''}
                hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:bg-white/15`}
              style={{ backgroundColor: team.rank === 1 ? '#C5FF9A' : undefined, color: team.rank === 1 ? 'black' : undefined }}
            >
              <div className="flex items-center justify-between gap-4 w-full">
                <p className="flex-1 text-2xl font-semibold text-white truncate pr-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" style={{ color: team.rank === 1 ? 'black' : 'white' }}>
                  {team.rank}. {team.name}
                  {team.rank === 1 && <img src={crownIcon} alt="Crown" className="inline-block w-[30px] h-[60px] ml-2.5 align-middle animate-[shine_2s_infinite]" />}
                </p>
                <div className="flex-[2] h-6 bg-white/20 rounded-[25px] overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                  <div
                    className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] rounded-[25px] transition-[width] duration-1500 ease-in-out shadow-[0_0_20px_rgba(79,172,254,0.5)]"
                    style={{ width: `${barWidths[team.name] || 0}%`, transitionDelay: `${index * 0.2}s` }}
                  />
                </div>
                <div className="flex items-center gap-2.5 min-w-[100px]">
                  <p className="text-[1.6rem] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" style={{ color: team.rank === 1 ? 'black' : 'white' }}>
                    ⚡ {team.points}
                  </p>
                </div>
              </div>

              {expandedTeam === team.name && (
                <div className="mt-8 w-[calc(100%-40px)] mx-auto p-5 bg-white/5 rounded-[10px] animate-[fadeIn_0.3s_ease-out]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="py-5 px-5 text-left text-white text-xl font-semibold uppercase tracking-wider bg-white/20">Task</th>
                        <th className="py-5 px-5 text-left text-white text-xl font-semibold uppercase tracking-wider bg-white/20">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(team.taskScores || {}).map(([task, points]) => (
                        <tr key={task} className="border-b border-white/10 hover:bg-white/15 transition-colors">
                          <td className="py-4 px-5 text-white text-xl">Task {task}</td>
                          <td className="py-4 px-5 text-white text-xl">{points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          <div className="w-full flex justify-center mt-10 py-8">
            <Button
              onClick={() => !quizComplete && onNextQuestion()}
              className="font-semibold text-[#1a2a6c] bg-white/90 rounded-[30px] py-5 px-12 text-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:bg-white min-w-[200px]"
            >
              {quizComplete ? 'See Results' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
