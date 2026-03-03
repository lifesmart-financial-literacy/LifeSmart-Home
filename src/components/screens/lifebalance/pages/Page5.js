import React from 'react';

const MONEY_ACTIONS = [
  { area: 'Health & Well-being', action: 'See if you can set aside some money within your budget to spend on better nutrition and exercise.' },
  { area: 'Family & Connections', action: 'Create a "relationship fund" for trips, shared meals or meaningful gifts. Schedule one experience this month and pay for it upfront so it really happens.' },
  { area: 'Career & Income', action: 'Invest in a skill course, mentor or certification that advances you toward a role you truly want. Treat it as a high-return asset, not an expense.' },
  { area: 'Lifestyle, Spending & Fun', action: 'Pre-plan fun experiences (concert, adventure day) instead of impulse buys to ensure lasting happiness.' },
  { area: 'Housing, Safety & Security', action: 'Build or top-up an emergency fund (3-6 months expenses) or pay down high-interest debt. This single move reduces financial anxiety quickly.' },
  { area: 'Giving & Contribution', action: 'Automate a monthly donation or set up a giving-pot for spontaneous causes. Align with values so generosity becomes a habit, not an after-thought.' },
  { area: 'Personal Growth & Purpose', action: 'Allocate a "growth pot" for books, courses or retreats that stretch your mind. Commit to one paid learning experience in the next quarter.' },
];

const TIME_ACTIONS = [
  { area: 'Health & Well-being', action: 'Block 3×30-minute exercise or meditation sessions into your calendar this week. Protect them like appointments.' },
  { area: 'Family & Connections', action: 'Schedule a weekly device-free meal or call with loved ones. Consistency matters more than extravagant plans.' },
  { area: 'Career & Income', action: 'Dedicate one evening a week to career reflection, networking or portfolio projects that align with long-term goals.' },
  { area: 'Lifestyle, Spending & Fun', action: 'Reserve at least half a day each month for a low-cost hobby or local adventure you keep postponing.' },
  { area: 'Housing, Safety & Security', action: 'Use a weekend block to review insurance, create a household emergency plan, or declutter to make your home feel safer.' },
  { area: 'Giving & Contribution', action: 'Pledge two hours a month to a cause you care about (mentoring, community clean-up). Put the first date in your calendar now.' },
  { area: 'Personal Growth & Purpose', action: 'Book a regular "learning hour" each week for reading, journaling or an online course to keep purpose front-of-mind.' },
];

const Page5 = ({ averages = { now: '6.1', money: '7.8', time: '7.3' }, biggestMoney = { area: 'Health & Well-being', value: 3.0 }, biggestTime = { area: 'Health & Well-being', value: 2.5 }, onSubmit }) => {
  const moneyAction = MONEY_ACTIONS.find((a) => a.area === biggestMoney.area)?.action || '';
  const timeAction = TIME_ACTIONS.find((a) => a.area === biggestTime.area)?.action || '';

  return (
    <div className="flex flex-col items-center gap-10 pb-10 text-white w-full">
      <h2 className="text-3xl font-semibold text-center mb-2">
        Here's your <span className="text-[#97A1FF] italic">Personal Snapshot</span>
      </h2>
      <p className="text-xl text-center mb-0">On an average, here's how you rate your life</p>

      <div className="flex justify-center items-stretch gap-0 min-w-[360px] max-w-[500px] bg-[rgba(25,21,58,0.7)] border border-[#39395A] rounded-2xl overflow-hidden shadow-lg mb-9">
        <div className="flex-1 flex flex-col items-center justify-center py-4 relative min-w-0">
          <div className="text-[#64FFD0] text-lg font-medium mb-1">Now</div>
          <div className="text-2xl font-bold text-white">{averages.now}/10</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-4 relative min-w-0 border-l border-[#39395A]">
          <div className="text-[#64FFD0] text-lg font-medium mb-1">with $$$</div>
          <div className="text-2xl font-bold text-white">{averages.money}/10</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-4 relative min-w-0 border-l border-[#39395A]">
          <div className="text-[#64FFD0] text-lg font-medium mb-1">with Time</div>
          <div className="text-2xl font-bold text-white">{averages.time}/10</div>
        </div>
      </div>

      <div className="flex justify-center items-stretch gap-9 mb-9 flex-wrap">
        <div className="border border-[#39395A] rounded-xl min-w-[220px] p-4 flex flex-col items-center shadow-lg">
          <div className="text-white text-lg font-semibold mb-2">
            Biggest jump with <span className="text-[#FFB398]">money</span>
          </div>
          <div className="text-white text-xl font-medium text-center">{biggestMoney.area}</div>
        </div>
        <div className="border border-[#39395A] rounded-xl min-w-[220px] p-4 flex flex-col items-center shadow-lg">
          <div className="text-white text-lg font-semibold mb-2">
            Biggest jump with <span className="text-[#FFB398]">time</span>
          </div>
          <div className="text-white text-xl font-medium text-center">{biggestTime.area}</div>
        </div>
      </div>

      <div className="w-full max-w-[700px] flex items-center my-9">
        <div className="flex-1 h-px bg-[#39395a] mx-5" />
        <span className="text-[#90caf9] text-2xl font-semibold whitespace-nowrap">What can you do now?</span>
        <div className="flex-1 h-px bg-[#39395a] mx-5" />
      </div>
      <div className="flex justify-center items-stretch gap-9 mb-9 flex-wrap">
        <div className="border border-[#39395A] rounded-xl min-w-[280px] max-w-[350px] p-5 text-white text-xl leading-8 text-center font-medium shadow-lg">
          {moneyAction}
        </div>
        <div className="border border-[#39395A] rounded-xl min-w-[280px] max-w-[350px] p-5 text-white text-xl leading-8 text-center font-medium shadow-lg">
          {timeAction}
        </div>
      </div>

      <div className="w-full max-w-[700px] flex items-center my-9">
        <div className="flex-1 h-px bg-[#39395a] mx-5" />
        <span className="text-[#90caf9] text-2xl font-semibold whitespace-nowrap">Key Takeaway</span>
        <div className="flex-1 h-px bg-[#39395a] mx-5" />
      </div>
      <div className="border border-[#39395A] rounded-xl p-6 text-white text-xl leading-8 text-center font-medium max-w-[900px] shadow-lg mb-6">
        Money is only a tool – its real power is the freedom and security it can buy. Yet time is a resource you can never earn back. This exercise shows where extra cash or extra hours would truly change your life, so you can aim for independence and contentment instead of simply chasing more money at the cost of other things.
      </div>

      <button
        onClick={onSubmit}
        className="bg-gradient-to-b from-[#B79BFF] to-[#4E3BD3] hover:from-[#c4afff] hover:to-[#5e4bdd] text-white font-semibold px-12 py-4 rounded-xl border border-[#8872C6] shadow-md hover:-translate-y-0.5 transition-all"
      >
        Done
      </button>
    </div>
  );
};

export default Page5;
