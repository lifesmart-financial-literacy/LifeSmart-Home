import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';
import Question4 from './questions/Question4';
import Question5 from './questions/Question5';
import Question6 from './questions/Question6';
import Leaderboard from './Leaderboard';
import FinanceQuestSimulation from '../financeQuest/FinanceQuestSimulation';

const BASE_FUNDS = 100000;

const FinancialQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allocations, setAllocations] = useState(null); // Store allocations from Q6

  const questions = [
    Question1,
    Question2,
    Question3,
    Question4,
    Question5,
    Question6
  ];

  const CurrentQuestionComponent = questions[currentQuestionIndex];
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  useEffect(() => {
    let teamsList = [];
    if (location.state && Array.isArray(location.state.teams)) {
      teamsList = location.state.teams.map(name => ({
        name,
        points: 0,
        taskScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      }));
    } else {
      const searchParams = new URLSearchParams(location.search);
      const teamsParam = searchParams.get('teams');
      if (teamsParam) {
        teamsList = teamsParam.split(',').map(name => ({
          name,
          points: 0,
          taskScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        }));
      }
    }
    if (teamsList.length > 0) {
      setTeams(teamsList);
    } else {
      navigate('/finance-quest');
    }
  }, [location, navigate]);

  const handleAnswer = (answer) => {
    console.log("Team answered:", answer);
  };

  const updateScores = (scores) => {
    setTeams(prevTeams => {
      return prevTeams.map((team, index) => {
        const currentTask = currentQuestionIndex + 1;
        return {
          ...team,
          points: team.points + (scores[index] || 0),
          taskScores: {
            ...team.taskScores,
            [currentTask]: scores[index] || 0
          }
        };
      });
    });
  };

  // Capture allocations from Question6 and move to simulation
  const handleQ6Submit = (allocs) => {
    setAllocations(allocs);
    setQuizComplete(true);
  };

  // After quiz is complete, show simulation
  if (quizComplete && allocations) {
    return (
      <FinanceQuestSimulation
        teams={teams}
        initialAllocations={allocations}
        baseFunds={BASE_FUNDS}
      />
    );
  }

  if (teams.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="financial-quiz">
      <main className="main-content">
        {showResults ? (
          <Leaderboard
            teams={sortedTeams}
            quizComplete={quizComplete}
            onNextQuestion={() => setShowResults(false)}
          />
        ) : (
          <CurrentQuestionComponent
            teams={teams}
            onAnswer={handleAnswer}
            onNextQuestion={
              currentQuestionIndex === 5
                ? (allocs) => handleQ6Submit(allocs)
                : () => {
                    setShowResults(true);
                    setCurrentQuestionIndex((prev) => prev + 1);
                  }
            }
            onAwardPoints={updateScores}
          />
        )}
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 Our App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FinancialQuiz;
