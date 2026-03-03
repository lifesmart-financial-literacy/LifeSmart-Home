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
    <div className="flex flex-col items-center min-h-screen justify-center bg-[rgba(13,0,33,0.92)] relative z-[1] py-12 max-[900px]:py-8">
      <h2 className="font-['Press_Start_2P',monospace] text-[2.1rem] text-[#FFD43B] mt-6 mb-8 tracking-[2px] text-center" style={{ textShadow: '0 2px 0 #0008' }}>🏆 Finance Quest Results 🏆</h2>
      <div className="flex flex-wrap gap-12 justify-center mt-6 mb-8 w-full z-[2] max-[900px]:flex-col max-[900px]:gap-6 max-[900px]:items-center">
        {sorted.map((team, idx) => (
          <div
            key={team.name}
            className={`bg-[#1C0032EE] border-4 rounded-[18px] min-w-[320px] max-w-[340px] min-h-[420px] p-8 flex flex-col items-center relative transition-all duration-200 font-['Montserrat',Arial,sans-serif] text-[#FFD43B] ${team.name === winner.name ? 'fq-results-fade-in border-[#FFD700] shadow-[0_0_32px_#FFD70099,0_0_0_8px_#FFD70044]' : 'fq-results-fade-in border-[#FFD43B] shadow-[0_8px_32px_#FFD43B55,0_0_0_6px_#CA70E344]'} max-[900px]:min-w-[90vw] max-[900px]:max-w-[98vw] max-[900px]:min-h-[340px] max-[900px]:text-[0.95rem]`}
          >
            <div className="font-['Press_Start_2P',monospace] text-[1.25rem] text-[#FFD43B] mb-[18px] flex items-center gap-2 tracking-[1px] font-bold" style={{ textShadow: '0 2px 0 #0008' }}>
              {team.name} {team.name === winner.name && <span title="Winner">🏆</span>}
            </div>
            {Object.keys(potNames).map(l => (
              <div key={l} className="flex justify-between items-center w-full text-[1.08rem] my-1.5 px-0.5 font-['Montserrat',Arial,sans-serif] text-[#FFD43B]">
                {/* Pot icon placeholder */}
                {potIcons[l] && potIcons[l]}
                <span className="font-bold">{potNames[l]}:</span>
                <span className="ml-2 font-bold" style={{ color: potColors[l] }}>
                  £{Math.round(team.final[l]).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="font-['Press_Start_2P',monospace] text-[1.5rem] text-[#FFD700] mt-[18px] mb-2 tracking-[1px]" style={{ textShadow: '0 2px 0 #0008' }}>
              Total: £{Math.round(team.final.total).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-12 mx-auto block font-['Press_Start_2P',monospace] text-[1.1rem] bg-[#FFD43B] text-[#1C0032] border-[3px] border-[#CA70E3] rounded-[10px] py-4 px-[38px] shadow-[0_2px_0_#FFD43B44] cursor-pointer transition-all duration-150 hover:bg-[#CA70E3] hover:text-[#FFD43B] hover:border-[#FFD43B] hover:scale-[1.04]" onClick={onRestart}>
        Return to Home
      </button>
    </div>
  );
};

export default FinanceQuestResultsScreen;
