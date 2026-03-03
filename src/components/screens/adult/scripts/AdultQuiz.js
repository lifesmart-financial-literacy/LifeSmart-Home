import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaLightbulb } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Startquiz from './Startquiz';
import GlossaryModal from './GlossaryModal';

const AdultQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [points, setPoints] = useState(0);
  const [selected, setSelected] = useState(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const questions = [
    { id: 1, category: 'High Interest Debt', question: 'You owe £4000 on a 19% card and £1200 on a 5% loan. You can pay an extra £150/mo. Which is the best action?', options: ['Pay the loan first, it has the smallest balance', 'Pay the 19% card first', 'Split £75/£75', 'Smallest balance first'], correctAnswer: 'Pay the 19% card first', explanation: 'Paying off the 19% card first will reduce your interest charges more than paying off the loan first. This is because the 19% card has a higher interest rate, so paying it off first will reduce the amount of interest you owe on the loan.' },
    { id: 2, category: 'High Interest Debt', question: "You normally put about £1,000 on your credit card each month and pay it off in full, avoiding any interest. This month you buy a laptop for £3,500 but can't clear that extra amount from your salary. What's the smartest move?", options: ['Pay your usual £1,000 plus a little extra each month until the balance is gone.', 'Use savings and aim to clear the £3,500 within six months so the payments feel manageable and there is a plan.', 'Shift the £3,500 to a 0% purchase or balance transfer card and set automatic payments to clear it before the promo period ends, while still paying off new spending in full on the original card.', "Open a second credit card; at month end transfer the balance to get another 30days interest free."], correctAnswer: 'Shift the £3,500 to a 0% purchase or balance transfer card and set automatic payments to clear it before the promo period ends, while still paying off new spending in full on the original card.', explanation: 'Shifting the £3,500 to a 0% purchase or balance transfer card will allow you to clear the balance before the promo period ends, while still paying off new spending in full on the original card.' },
    { id: 3, category: 'High Interest Debt', question: 'Which action is most likely to improve your credit score?', options: ['Closing your oldest credit card to reduce the number of open accounts', 'Hitting your full credit limit each month and paying it off on the due date', 'Registering yourself on the electoral roll at your current address', 'Making only the minimum payment so lenders see you use available credit'], correctAnswer: 'Registering yourself on the electoral roll at your current address', explanation: 'Registering yourself on the electoral roll at your current address will help you build a good credit history and improve your credit score.' },
    { id: 4, category: 'High Interest Debt', question: 'You have £30k saved. Option 1: buy a £250k home with a 10% deposit and a 25 year mortgage at 5% fixed for 2years, then variable. Option 2: keep renting for £1,100/month. What\'s the smartest financial consideration?', options: ['Renting is always cheaper unless you have a 20% deposit and don\'t face repairs or housing price drops.', 'Mortgage payments stay fixed for 25 years, so buying is always cheaper long term.', 'Buying needs a £25k deposit plus ≈ £5k fees. The mortgage starts near £1,170/month (slightly above rent) and could jump after the 2 year fix; you\'ll also pay for repairs and insurance, though you build equity.', 'Your £30k covers everything; but better to wait until rates fall, then buying will be better than renting.'], correctAnswer: 'Buying needs a £25k deposit plus ≈ £5k fees. The mortgage starts near £1,170/month (slightly above rent) and could jump after the 2 year fix; you\'ll also pay for repairs and insurance, though you build equity.', explanation: "Buying a home requires a larger upfront investment, but it can be a more cost-effective long-term option compared to renting. The mortgage payments are fixed for 25 years, so you know exactly what your housing costs will be. However, you'll also need to pay for repairs and insurance, which can add to your monthly expenses." },
    { id: 5, category: 'Savings and budgeting', question: 'You earn £3,100 net. Needs are £1,900. What\'s the best way to use the £1,200 left? ', options: ['Spend it all on wants and save leftovers', '50% wants / 50% savings', 'Save as much as possible, trim wants', 'Save one third (£400) and enjoy the rest (£800)'], correctAnswer: 'Save one third (£400) and enjoy the rest (£800)', explanation: 'Saving one third of your income will help you build a solid emergency fund and still have money left for wants. This approach allows you to enjoy some of your income while still saving for the future.' },
    { id: 6, category: 'Savings and budgeting', question: 'Whats the best way to organise savings', options: ['One big fund', 'Individual fund for every goal', 'Layered funds: Emergency→Sinking→Goal', 'Split by short  vs long term goals'], correctAnswer: 'Layered funds: Emergency→Sinking→Goal', explanation: 'Layered funds: Emergency→Sinking→Goal is a good way to organise savings because it allows you to save for emergencies first, then save for sinking funds, and finally save for goals. This approach helps you build a solid financial foundation and achieve your long-term goals.' },
    { id: 7, category: 'Savings and budgeting', question: 'From your salary of £3,000, 50% is spent on your Needs, 40% on your wants and you save 10% each month. Whats the minimm you should have in an emergency fund? ', options: ['£3000', '£4500', '£9000', '£18000'], correctAnswer: '£4500', explanation: 'Having an emergency fund of £4,500 will give you a buffer to cover unexpected expenses, such as a car repair or medical emergency. This amount is typically recommended to provide a three to six months\' worth of living expenses.' },
    { id: 8, category: 'Savings and budgeting', question: 'Which action most boosts saving success? ', options: ['Transferring leftovers at month end', 'Pay yourself first, standing order after payday', 'Manual transfer whenever you have extra money', 'Put extra into the savings and dip back in when needed to encourage higher savings'], correctAnswer: 'Pay yourself first, standing order after payday', explanation: 'Paying yourself first, standing order after payday, ensures that you save a portion of your income before you spend it. This approach helps you build a consistent savings habit and ensures that you save a portion of your income each month.' },
    { id: 9, category: 'Investing & Growth', question: "You have £10,000 you don't need that you put into a savings account generating 3%. After 3 years you decide to spend it. If the inflation rate has been 5%, which of the following is not correct:", options: ['You now have approximately £11,000 in the account', 'Your purchasing power (the amount you can buy) with the £10,000 has decreased.', 'Your money has had a real inflation adjusted return of -2%', 'Over a short time period like 3 years, the purchasing power will not be affected'], correctAnswer: 'Over a short time period like 3 years, the purchasing power will not be affected', explanation: 'Statement d is wrong: with inflation at 5% and savings at 3%, purchasing power does fall—even over just three years. The real return is roughly -2% a year.' },
    { id: 10, category: 'Investing & Growth', question: 'What is the best long term fund type for a newbie?', options: ['Low cost index fund', 'Actively managed fund', 'ETF for day trading', 'Hedge fund'], correctAnswer: 'Low cost index fund', explanation: 'A low-cost index fund gives instant diversification, tracks the market without expensive manager fees, and has outperformed most active funds after costs—ideal for a new long-term investor' },
    { id: 11, category: 'Investing & Growth', question: 'Adam is 30 and can leave £10,000 untouched for at least ten years. Which mix suits his growth at medium risk strategy best?', options: ['50% equity fund • 20% Real Estate •10% Gold • 10% cash equivalent • 10% alternatives (crypto)', '100% 3.5% savings account', '80% crypto • 20% stocks', '50% gold • 50% cash'], correctAnswer: '50% equity fund • 20% Real Estate •10% Gold • 10% cash equivalent • 10% alternatives (crypto)', explanation: 'The 60% global equity + 20% gold + 10% cash + 10% crypto mix is the best option here as it balances growth (equities) with hedges (gold, cash) and a small speculative slice (crypto)— delivering medium risk suitable for a 5-plus-year horizon.' },
    { id: 12, category: 'Investing & Growth', question: 'Maria has a has diversified portfolio for many years. As she nears retirement, which asset class should she increase in her allocation to?', options: ['Developed market equities', 'Emerging market equities', 'Cryptocurrency', 'Investment grade bonds and cash like instruments'], correctAnswer: 'Investment grade bonds and cash like instruments', explanation: 'As retirement nears, its recommended to shift into lower risk and more liquid investments as her investment time horizon shrinks; she is closer to her withdrawals and needs to focus more on capital protection.' },
    { id: 13, category: 'Investing & Growth', question: 'Why should you put an index fund investment into a Stocks & Shares ISA before a normal account?', options: ['Higher interest', 'Gains & dividends are tax free', 'ISA returns are usually higher', 'You can withdraw tax free before 55'], correctAnswer: 'Gains & dividends are tax free', explanation: 'Inside a Stocks&Shares ISA, capital gains and dividends are tax-free, so any income and capital gains is yours to keep without any tax due.' },
    { id: 14, category: 'Investing & Growth', question: 'Which feature in an online investment advert is NOT a red flag?', options: ['Guaranteed 10% monthly return', 'No mention of risks', '5 year verified returns to justify guaranteed results', 'Management and transaction fees'], correctAnswer: 'Management and transaction fees', explanation: 'It is perfectly normal for investment managers to charge management and/or transaction fees. The other items (guaranteed returns, no risk language, past returns being used to guarantee future performance) are not allowed and are likely to be unregulated or an outright scam.' },
    { id: 15, category: 'Retirement & Tax Efficiency', question: 'You earn £30,000 salary at a company offering a standard auto-enrolment workplace pension scheme.  What\'s the total minimum contribution and what does it cost you?', options: ['£900 from your salary (3%) + £900 extra from your employer for a total £1,800', '£1,500 from your salary (5%); employer £0', '£1,500 from your salary (5%) + £900 extra from your employer (3%) for a total of £2,400', '£1,500 (5%) + £900 (3%) employer contribution, but both come out of your salary'], correctAnswer: '£1,500 from your salary (5%) + £900 extra from your employer (3%) for a total of £2,400', explanation: 'UK auto-enrolment rules set minimum contributions at 8% of earnings: 5% from the employee (including basic-rate tax relief) and 3% from the employer. When you put in 5% (£1,500), your company must add 3% (£900). With tax relief, every £1 of take-home you give up becomes £1.60 in your pension—a 60% boost of "free money" plus tax perks, all while meeting the legal minimum. You can still keep adding more than 5% of your salary and get the 20% tax relief, but the employer doesn\'t have to contribute past their 3%.' },
    { id: 16, category: 'Retirement & Tax Efficiency', question: 'You earn £60,000 and put £4,000 of take home pay into a Self Invested Personal Pension (SIPP). After tax relief, what lands in your pension, and what does it really cost you?', options: ['£5,000 in the pot after the 20% basic-rate tax relief; costs you £4,000', '£5,000 in the pot (20% uplift) and you reclaim another £1,000 via your tax return, so it costs you £3,000', '£6,000 in the pot because your employer matches 50% of your contribution, costs you £4,000', '£5,600 in the pot after 40% relief added directly to the SIPP; cost still £4,000'], correctAnswer: '£5,000 in the pot (20% uplift) and you reclaim another £1,000 via your tax return, so it costs you £3,000', explanation: 'How pension tax relief works: 1. You add £4,000 into SIPP. 2. Your account provider claims 20% basic-rate relief from HMRC, so £4,000 ÷ 0.8 = £5,000 lands in the SIPP (an extra £1,000 is added automatically). 3.Because you\'re a higher-rate (40%) taxpayer, you can reclaim a further 20% of the gross amount via your tax return- another £1,000 back to you as a rebate or reduced tax bill. Net cost = £4,000 - £1,000=£3,000 for £5,000 invested—a 67% uplift. (Within the £60k annual allowance, no extra tax applies.)' },
    { id: 17, category: 'Retirement & Tax Efficiency', question: 'You earn £49,000, just below the 40% band that starts at £50,270. Your employer gives you a £3,000 raise (new salary £52,000). How much extra tax will you pay on that £3,000?', options: ['About £950 - the first £1,270 of the raise is taxed at 20% and the remainder at 40%', '£1,200 - the whole £3,000 is now in the higher rate band, so it\'s all taxed at 40%', '£600 - the whole raise is still taxed at 20% because you haven\'t hit £55k yet', 'Nothing extra - only bonuses trigger more tax, not basic salary increases'], correctAnswer: 'About £950 - the first £1,270 of the raise is taxed at 20% and the remainder at 40%', explanation: 'Only the slice of income above each threshold moves to the higher rate. On a £3,000 raise: £1,270 taxed at 20% (£254) + £1,730 at 40% (£692) ≈ £946 extra. That\'s the marginal system, not a flat 40% on everything.' },
    { id: 18, category: 'Estate Planning', question: 'Ben is 32, married, two young kids, house £250k (with mortgage), £20k savings. Should he set up both a will and a financial Lasting Power of Attorney (LPA)?', options: ['Everything already passes to his spouse tax free so only a LPA is needed.', 'A will lets you name guardians and choose who gets what; an LPA lets a trusted person pay the mortgage, bills and access savings if you lose mental capacity', 'The estate is small, so neither is needed at the moment', 'Setting up a will should ensure his kids pay no inheritance tax, LPA not needed as his spouse can automatically act for him if he loses mental capacity'], correctAnswer: 'A will lets you name guardians and choose who gets what; an LPA lets a trusted person pay the mortgage, bills and access savings if you lose mental capacity', explanation: 'Will: names guardians for children and directs who inherits—without it, intestacy rules apply and courts decide guardianship. Financial LPA: lets a chosen person keep bills, mortgage and accounts running if you lose capacity; spouses cannot automatically act. Having both gives legal control and prevents costly delays' },
    { id: 19, category: 'Estate Planning', question: "Sam—married, two children, total estate £800k (family home + other assets). Sam's will leaves everything directly to the kids. What inheritance tax (IHT) bill will the family face, and what is one way to reduce it?", options: ['First £500k is tax free (£325k nil rate + £175k residence band). The remaining £300k is taxed at 40% → £120k IHT. Sam could reduce this by gifting during life or leaving 10% to charity.', 'No IHT because assets are split between the two children, each below £500k threshold.', 'Full £800k taxed at 40% (£320k) because nothing passes to the spouse; Sam can reduce avoid this by putting everything into a trust.', 'Parents can pass up to £1m tax free if it only includes a primary/ family home, so no tax at all'], correctAnswer: 'First £500k is tax free (£325k nil rate + £175k residence band). The remaining £300k is taxed at 40% → £120k IHT. Sam could reduce this by gifting during life or leaving 10% to charity.', explanation: 'Key rules: 1. Each person gets a £325k nil-rate band. 2. Passing a main home to direct descendants adds £175 k residence band. 3. Anything above those bands is taxed at 40%. Sam\'s £800k  - £500k bands = £300k taxable → £120k IHT. Charity gifts ≥ 10% of the estate or 7-year lifetime gifts can cut this bill.', },
  ];

  const handleSelect = (option) => {
    if (!answered) setSelected(option);
  };

  const handleSubmitAnswer = () => {
    if (selected == null) return;
    const isCorrect = selected === questions[currentQuestion].correctAnswer;
    setAnswers({ ...answers, [currentQuestion]: selected });
    setAnswered(true);
    setWasCorrect(isCorrect);
    if (isCorrect && !answers[currentQuestion]) setPoints(points + 100);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setWasCorrect(false);
      setSelected(null);
    } else {
      setShowResults(true);
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount++;
    });
    setScore(correctCount);
  };

  const handleSubmit = () => navigate('/select');

  if (!quizStarted) return <Startquiz onStartQuiz={() => setQuizStarted(true)} />;

  if (showResults) {
    let level = '';
    let levelDesc = '';
    if (score >= 16) {
      level = 'Expert';
      levelDesc = 'You have excellent financial knowledge!';
    } else if (score >= 11) {
      level = 'Intermediate';
      levelDesc = 'You have a good grasp of financial concepts, but there is room to grow.';
    } else {
      level = 'Beginner';
      levelDesc = 'Keep learning and practicing to improve your financial skills!';
    }
    const levelClass = level === 'Expert' ? 'bg-[#38e07d] text-white' : level === 'Intermediate' ? 'bg-[#ffb347] text-[#222]' : 'bg-[#e74c3c] text-white';
    return (
      <div className="min-h-screen bg-gradient-to-b from-black/70 to-[rgba(10,33,55,0.8)] flex flex-col items-center justify-center relative">
        <div className="absolute w-[420px] h-[380px] -top-[120px] left-[calc(100vw-120px)] bg-[rgba(84,255,41,1)] blur-[200px] opacity-50 rounded-full rotate-[87.72deg] pointer-events-none z-[1]" />
        <div className="w-full max-w-[1200px] mx-auto px-8 pt-[5.5rem] pb-8 text-white flex flex-col items-center">
          <div className="fixed top-0 left-0 w-screen z-[100] flex items-center justify-between py-3 px-[2.5vw] shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
            <img src={process.env.PUBLIC_URL + '/logo/LifeSmartSessionsWhite.png'} alt="LifeSmart Logo" className="w-[300px] h-[100px]" />
            <div className="flex-1 h-2.5 bg-[#222] rounded-lg mx-4 overflow-hidden">
              <div className="h-full bg-[rgba(115,228,138,1)] rounded-lg transition-[width] duration-300" style={{ width: '100%' }} />
            </div>
          </div>
          <div className="mx-auto p-10 bg-[rgba(10,33,55,0.85)] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] text-white max-w-[700px] flex flex-col items-center mt-10">
            <h2 className="text-[2.4rem] font-bold mb-6 text-[#38e07d] text-center">Quiz Results</h2>
            <div className="mb-6 text-center">
              <h3>Your Level: <span className={`font-bold text-[1.5em] py-[0.2em] px-[0.7em] rounded-[18px] ml-2 ${levelClass}`}>{level}</span></h3>
              <p>{levelDesc}</p>
              <p>You scored {score} out of {questions.length}.</p>
            </div>
            <Button onClick={handleSubmit} className="mt-10 bg-gradient-to-r from-[#73E48A] to-[#00A120] text-white text-[1.4rem] font-bold rounded-[32px] py-[1.1rem] px-14 shadow-[0_4px_24px_rgba(30,215,96,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(30,215,96,0.3)]">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const percent = Math.min(points / (questions.length * 100), 1);

  const PointsGauge = () => (
    <div className="fixed top-1/2 right-10 -translate-y-1/2 flex flex-col items-center z-[200] max-[900px]:right-2.5 max-[900px]:top-auto max-[900px]:bottom-[30px] max-[900px]:translate-y-0">
      <div className="text-white text-[1.3rem] font-semibold mb-2 tracking-wide">Points</div>
      <div className="relative w-[22px] h-[220px] bg-white rounded-xl border-[3px] border-orange shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-2 flex items-end overflow-hidden">
        <div className="absolute left-0 bottom-0 w-full bg-orange rounded-b-xl transition-[height] duration-300 ease-in-out" style={{ height: `${percent * 100}%` }} />
      </div>
      <div className="text-orange text-[1.4rem] font-bold">{points}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/70 to-[rgba(10,33,55,0.8)] flex flex-col items-center justify-center relative">
      <div className="absolute w-[420px] h-[380px] -top-[120px] left-[calc(100vw-120px)] bg-[rgba(84,255,41,1)] blur-[200px] opacity-50 rounded-full rotate-[87.72deg] pointer-events-none z-[1]" />
      <div className="w-full max-w-[1200px] mx-auto px-8 pt-[5.5rem] pb-8 text-white flex flex-col items-center">
        <div className="fixed top-0 left-0 w-screen z-[100] flex items-center justify-between py-3 px-[2.5vw] shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
          <img src={process.env.PUBLIC_URL + '/logo/LifeSmartSessionsWhite.png'} alt="LifeSmart Logo" className="w-[300px] h-[100px]" />
          <div className="flex-1 h-2.5 bg-[#222] rounded-lg mx-4 overflow-hidden">
            <div className="h-full bg-[rgba(115,228,138,1)] rounded-lg transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="bg-[rgba(254,214,214,0.25)] text-[rgba(115,228,138,1)] text-[2.1rem] font-bold rounded-[50px] py-2 px-9 mx-auto mb-6 text-center">
          {questions[currentQuestion].category}
        </div>
        <div className="flex gap-4 justify-center mb-6">
          <Button variant="outline" onClick={() => setGlossaryOpen(true)} className="border-2 border-white text-white rounded-[24px] py-2 px-6 text-[1.3rem] font-semibold flex items-center gap-2.5 hover:border-[#38e07d] hover:text-[#38e07d] bg-transparent">
            <FaBookOpen /> Glossary
          </Button>
          <Button variant="outline" className="border-2 border-white text-white rounded-[24px] py-2 px-6 text-[1.3rem] font-semibold flex items-center gap-2.5 hover:border-[#38e07d] hover:text-[#38e07d] bg-transparent">
            <FaLightbulb /> Hint
          </Button>
        </div>
        <div className="text-center text-[1.45rem] mb-8 leading-normal w-[45%]">{questions[currentQuestion].question}</div>
        <div className="flex flex-col gap-4 w-[40%]">
          {questions[currentQuestion].options.map((option, idx) => {
            let optionClass = 'rounded-[24px] bg-[#23272f] text-white border-none py-[1.1rem] px-6 text-[1.3rem] font-medium cursor-pointer text-left transition-colors ';
            if (answered) {
              if (option === questions[currentQuestion].correctAnswer) optionClass += '!bg-[#38e07d] !text-white border-2 border-[#38e07d]';
              else if (option === selected) optionClass += '!bg-[#e74c3c] !text-white border-2 border-[#e74c3c]';
            } else if (selected === option) optionClass += 'bg-[#393536] text-[#38e07d]';
            else optionClass += 'hover:bg-[#393536] hover:text-[#38e07d]';
            return (
              <button key={idx} className={optionClass} onClick={() => handleSelect(option)} disabled={answered}>
                {String.fromCharCode(97 + idx)}) {option}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`mt-10 mx-auto p-8 rounded-[18px] max-w-[600px] text-[1.35rem] text-center shadow-[0_4px_24px_rgba(30,215,96,0.1)] border-2.5 ${wasCorrect ? 'bg-[#f5f5f5] text-[#222] border-[#38e07d]' : 'bg-[#f5f5f5] text-[#222] border-[#e74c3c]'}`}>
            <div className="font-bold text-[1.38rem] mb-2 text-[#222]">
              {wasCorrect ? 'Correct!' : 'Incorrect.'} <span className="font-medium italic">Answer Explanation:</span>
            </div>
            <div className="text-[#222] text-[1.28rem]">{questions[currentQuestion].explanation}</div>
          </div>
        )}
        {!answered ? (
          <Button onClick={handleSubmitAnswer} disabled={selected == null} className="mt-9 mx-auto block bg-gradient-to-r from-[#73E48A] to-[#00A120] text-white text-[1.4rem] font-bold rounded-[32px] py-[1.1rem] px-14 shadow-[0_4px_24px_rgba(30,215,96,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(30,215,96,0.3)]">
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="mt-9 mx-auto block bg-gradient-to-r from-[#73E48A] to-[#00A120] text-white text-[1.4rem] font-bold rounded-[32px] py-[1.1rem] px-14 shadow-[0_4px_24px_rgba(30,215,96,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(30,215,96,0.3)]">
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
          </Button>
        )}
      </div>
      <PointsGauge />
      <GlossaryModal open={glossaryOpen} onClose={() => setGlossaryOpen(false)} title="Glossary">
        <strong>{questions[currentQuestion].category}</strong> — This is a sample glossary entry for the current category. You can replace this with real glossary content.
      </GlossaryModal>
    </div>
  );
};

export default AdultQuiz;
