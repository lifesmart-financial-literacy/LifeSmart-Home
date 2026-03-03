import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';
import Question4 from './questions/Question4';
import Question5 from './questions/Question5';
import Question6 from './questions/Question6';
import ResultsScreen from './ResultsScreen';

const FinancialQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [uid, setUid] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  const questions = [Question1, Question2, Question3, Question4, Question5, Question6];
  const CurrentQuestionComponent = questions[currentQuestionIndex];
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUid(currentUser.uid);
    } else {
      console.error('No user is logged in.');
      navigate('/');
    }

    const searchParams = new URLSearchParams(location.search);
    const teamsParam = searchParams.get('teams');

    if (teamsParam) {
      const teamsList = teamsParam.split(',').map((name) => ({
        name,
        points: 0,
        taskScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      }));
      setTeams(teamsList);
    } else {
      navigate('/quiz-landing');
    }
  }, [location.search, navigate, auth.currentUser]);

  const handleAnswer = (answer) => {
    console.log('Team answered:', answer);
  };

  const updateScores = (scores) => {
    setTeams((prev) =>
      prev.map((team, index) => ({
        ...team,
        points: team.points + (scores[index] || 0),
        taskScores: {
          ...team.taskScores,
          [currentQuestionIndex + 1]: scores[index] || 0,
        },
      }))
    );
  };

  const nextQuestion = () => {
    setShowResults(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizComplete(true);
      saveResultsAndShowResults();
    }
  };

  const saveResultsAndShowResults = async () => {
    if (!uid) {
      alert('No user is logged in. Please sign in.');
      navigate('/');
      return;
    }

    const teamsCollectionRef = collection(db, uid, 'Quiz Simulations', 'Teams');

    try {
      const snapshot = await getDocs(teamsCollectionRef);
      await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));

      await Promise.all(
        sortedTeams.map((team) =>
          setDoc(doc(teamsCollectionRef, team.name), {
            name: team.name,
            points: team.points,
            taskScores: team.taskScores,
          })
        )
      );

      setShowResults(true);
    } catch (error) {
      console.error('Error during saving results to Firebase:', error);
      setShowResults(true);
    }
  };

  if (teams.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-[#003F91]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa]">
      <main className="flex-1">
        {showResults ? (
          <ResultsScreen teams={sortedTeams} quizComplete={quizComplete} onNextQuestion={nextQuestion} />
        ) : (
          <CurrentQuestionComponent
            teams={teams}
            onAnswer={handleAnswer}
            onNextQuestion={() => setShowResults(true)}
            onAwardPoints={updateScores}
          />
        )}
      </main>
      <footer className="py-4 text-center text-sm text-zinc-400">
        <p>© 2024 Our App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FinancialQuiz;
