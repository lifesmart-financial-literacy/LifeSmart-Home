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
    <div className="question6-container">
      {/* Header and Progress Bar */}
      <div className="question6-progress-bar-container">
        <div className="question6-progress-bar">
          <div className="question6-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        <div className="question6-timer">
          {minutes}:{seconds < 10 ? '0' + seconds : seconds}
        </div>
      </div>

      {/* Glossary Sidebar */}
      {showGlossary && (
        <div className="question6-glossary-sidebar">
          <div className="question6-glossary-header">
            <h2>📖 Glossary</h2>
            <button className="question6-close-button" onClick={() => setShowGlossary(false)}>X</button>
          </div>
          <div className="question6-glossary-content">
            <h3>Assets</h3>
            <p>Things you own that are worth money. For example, if you have a bicycle, some books, or a little money in a piggy bank, those are all your assets.</p>
            <h3>Liabilities</h3>
            <p>Money you owe to someone else. If you borrowed money from your friend to buy a new game and you have to give it back, that money is a liability.</p>
            <h3>Income Tax</h3>
            <p>A portion of the money that people earn from their jobs or other places, which they need to give to the government. This money helps pay for things like schools, roads, and hospitals.</p>
            <h3>Tax Rates</h3>
            <p>This tells you how much income tax you need to pay. It's like a rule that says how much money you give to the government based on how much money you make.</p>
            <h3>Mortgage</h3>
            <p>A special kind of loan that people use to buy a house. They borrow money from a bank and pay it back every month for many years. While they are paying it back, they can live in the house.</p>
            <h3>Cryptocurrency</h3>
            <p>A type of money you can use on a computer but can't touch like coins or bills. It's made using special computer codes and you can use it to buy things online.</p>
            <h3>Stocks Fund Portfolio</h3>
            <p>A basket of different companies that are all put together. When you buy a part of the basket, you own a small piece of all the companies in it. This helps spread the risk because if one company doesn't do well, others in the basket might still grow!</p>
            <h3>S&P 500</h3>
            <p>A list of the 500 biggest and most important companies in America. If you invest in the S&P 500, you're buying a little piece of each of those 500 companies.</p>
            <h3>Interest</h3>
            <p>If you save your money in a bank, the bank pays you extra money for letting them keep it there. This extra money is called interest.</p>
            <h3>Compound Interest</h3>
            <p>This is when you get interest on both the money you saved and the extra money (interest) you earned before. It's like your money making more money because the interest starts earning interest too!</p>
            <h3>Annual Return</h3>
            <p>This is how much money you make or lose from an investment in a year. It tells you how good or bad the investment did.</p>
            <h3>Credit Rating</h3>
            <p>A score that everyone has, that tells banks how good you are at paying back money. If you have a high score, banks think you're good at paying back and are more likely to lend you money.</p>
          </div>
        </div>
      )}

      {/* Task Description */}
      <div className="question6-task-header">
        <h3>Challenge 6</h3>
        <div className="question6-button-container">
          <button className="question6-glossary-button" onClick={() => setShowGlossary(true)}>
            📖 Glossary
          </button>
        </div>
        <p>
          So now for the final round and the investment challenge to decide the ultimate winner. Ben has £100,000 in savings and wants to build a diversified portfolio of different asset classes.
        </p>
        <p>Each team will get a bonus £200 for each point they scored in the previous rounds.</p>
      </div>

      {/* Asset Allocation Section */}
      <div className="question6-allocation-header">
        <p>Decide how to allocate the money between these 5 asset classes.</p>
      </div>

      {/* Asset Classes */}
      <div className="question6-asset-classes-container">
        {assets.map((asset, index) => (
          <div key={asset.name} className="question6-asset-class">
            <button className="question6-asset-button" onClick={() => toggleAsset(index)}>
              <img src={asset.image} alt={asset.name} className="question6-asset-icon" />
              <span>{asset.name}</span>
            </button>
            {expandedAssets[index] && (
              <div className="question6-asset-definition">
                <p>{asset.definition}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Asset Classes Breakdown Graph */}
      <img src={graphImage} alt="Asset Allocation Graph" className="question6-allocation-graph" />

      {/* Next Button */}
      <button className="question6-submit-button" onClick={nextQuestion}>Next</button>
    </div>
  );
};

export default Question6;