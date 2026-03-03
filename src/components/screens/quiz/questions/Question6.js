/* eslint-disable no-unused-vars -- showHintModal reserved for future hint feature */
import React, { useState, useEffect } from 'react';
import equitiesIcon from '../../../../assets/icons/equities.png';
import bondsIcon from '../../../../assets/icons/bonds.png';
import realEstateIcon from '../../../../assets/icons/real_estate.png';
import commoditiesIcon from '../../../../assets/icons/commodities.png';
import otherIcon from '../../../../assets/icons/other.png';
import graphImage from '../../../../assets/icons/graphimage.png';

const Question6 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [timer, setTimer] = useState(600); // 10-minute timer
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [expandedAssets, setExpandedAssets] = useState(Array(5).fill(false));

  const assets = [
    {
      name: "Equities",
      icon: "📈",
      image: equitiesIcon,
      definition: "Equities are shares of ownership in a company. Investing in equities can offer high returns but comes with higher risk.",
    },
    {
      name: "Bonds",
      icon: "💵",
      image: bondsIcon,
      definition: "Bonds are loans to a company or government. They provide lower returns compared to stocks but are considered safer.",
    },
    {
      name: "Real Estate",
      icon: "🏠",
      image: realEstateIcon,
      definition: "Real estate involves investing in property. It can provide steady income through rent and long-term appreciation.",
    },
    {
      name: "Commodities",
      icon: "⛏️",
      image: commoditiesIcon,
      definition: "Commodities include raw materials like gold, oil, and agricultural products. These are often used as a hedge against inflation.",
    },
    {
      name: "Alternative Investments",
      icon: "📊",
      image: otherIcon,
      definition: "Alternative investments include assets like hedge funds, private equity, and cryptocurrencies. They are less traditional but can offer diversification.",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer > 0) {
        setTimer(prev => prev - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const progressBarWidth = (timer / 600) * 100;

  const toggleAsset = (index) => {
    setExpandedAssets(prev => prev.map((expanded, i) => i === index ? !expanded : false));
  };

  const nextQuestion = () => {
    onNextQuestion();
  };

  return (
    <div className="p-10 mx-auto font-[Arial,sans-serif] bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-[1200px] min-h-[90vh] flex flex-col md:p-5">
      {/* Header and Progress Bar */}
      <div className="flex justify-between items-center mb-8 px-5">
        <div className="w-[80%] h-2 bg-gray-200 rounded-[10px] relative overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-[10px] transition-[width] duration-300 ease-in-out" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        <div className="quiz-q6-timer text-[1.8rem] font-bold text-slate-800 flex items-center gap-2">
          {minutes}:{seconds < 10 ? '0' + seconds : seconds}
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-[-4px_0_20px_rgba(0,0,0,0.1)] z-[1000] p-8 overflow-y-auto transition-transform duration-300 ease-in-out md:w-full">
          <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-slate-200">
            <h2 className="text-[1.8rem] text-slate-800 font-bold">📖 Glossary</h2>
            <button className="bg-slate-100 border-none w-10 h-10 rounded-full text-[1.2rem] cursor-pointer text-slate-500 flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-slate-200 hover:text-slate-800" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Assets</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">Things you own that are worth money. For example, if you have a bicycle, some books, or a little money in a piggy bank, those are all your assets.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Liabilities</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">Money you owe to someone else. If you borrowed money from your friend to buy a new game and you have to give it back, that money is a liability.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Income Tax</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Tax Rates</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">This tells you how much income tax you need to pay. It&apos;s like a rule that says how much money you give to the government based on how much money you make.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Mortgage</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Cryptocurrency</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">A type of money you can use on a computer but can&apos;t touch like coins or bills. It&apos;s made using special computer codes and you can use it to buy things online.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Stocks Fund Portfolio</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn&apos;t do well, others in the basket might still grow!</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">S&P 500</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you&apos;re buying a little piece of each of those 500 companies.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Interest</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">If you save your money in a bank, the bank pays you extra money for letting them keep it there. This extra money is called interest.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Compound Interest</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">This is when you get interest on both the money you saved and the extra money (interest) you earned before. It&apos;s like your money making more money because the interest starts earning interest too!</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Annual Return</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">This is how much money you make or lose from an investment in a year. It tells you how good or bad the investment did.</p>
            <h3 className="text-[1.4rem] text-blue-500 font-semibold mt-6 mb-2.5">Credit Rating</h3>
            <p className="text-[1.1rem] text-slate-500 leading-relaxed mb-5">A score that everyone has, that tells banks how good you are at paying back money. If you have a high score, banks think you&apos;re good at paying back and are more likely to lend you money.</p>
          </div>
        </div>
      )}

      {/* Task Description */}
      <div className="flex flex-col items-start my-8 px-5 md:my-8">
        <h3 className="text-[2.5rem] text-slate-800 font-extrabold mb-4 md:text-[2rem]">Challenge 6</h3>
        <div className="flex gap-2.5 mb-4">
          <button className="bg-slate-50 border-2 border-slate-200 text-slate-800 font-semibold text-[1.1rem] py-3 px-6 rounded-[25px] cursor-pointer transition-all duration-300 ease-in-out flex items-center gap-2 hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5" onClick={() => setShowGlossary(true)}>
            📖 Glossary
          </button>
        </div>
        <p className="text-slate-500 text-[1.4rem] leading-relaxed mb-4 md:text-[1.2rem]">
          So now for the final round and the investment challenge to decide the ultimate winner. Ben has £100,000 in savings and wants to build a diversified portfolio of different asset classes.
        </p>
        <p className="text-slate-500 text-[1.4rem] leading-relaxed mb-4 md:text-[1.2rem]">Each team will get a bonus £200 for each point they scored in the previous rounds.</p>
      </div>

      {/* Asset Allocation Section */}
      <div className="text-center my-10 px-5">
        <p className="text-[1.6rem] text-slate-800 font-semibold mb-2.5">Decide how to allocate the money between these 5 asset classes.</p>
      </div>

      {/* Asset Classes */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 p-5 my-5 md:grid-cols-1">
        {assets.map((asset, index) => (
          <div key={asset.name} className="bg-white rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
            <button className="flex items-center gap-4 p-5 bg-slate-50 border-none rounded-[15px] cursor-pointer transition-colors duration-300 ease-in-out w-full hover:bg-slate-100" onClick={() => toggleAsset(index)}>
              <img src={asset.image} alt={asset.name} className="w-[50px] h-[50px] object-contain bg-white p-2.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)]" />
              <span className="text-[1.3rem] font-semibold text-slate-800">{asset.name}</span>
            </button>
            {expandedAssets[index] && (
              <div className="p-5 bg-white rounded-b-[15px] border-t border-slate-200">
                <p className="text-slate-500 text-[1.1rem] leading-relaxed">{asset.definition}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Asset Classes Breakdown Graph */}
      <img src={graphImage} alt="Asset Allocation Graph" className="w-full max-w-[800px] my-10 mx-auto p-5 bg-white rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)]" />

      {/* Next Button */}
      <button className="w-[200px] bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none py-4 px-8 rounded-[30px] text-[1.2rem] font-semibold cursor-pointer my-10 mx-auto block transition-all duration-300 ease-in-out shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]" onClick={nextQuestion}>Next</button>
    </div>
  );
};

export default Question6;
