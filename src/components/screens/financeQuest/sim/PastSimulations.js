import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/initFirebase';

const PastSimulations = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'simulations'));
      const simulationData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSimulations(simulationData);
      setLoading(false);
    } catch (err) {
      setError('Error fetching simulations: ' + err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this simulation?')) {
      try {
        await deleteDoc(doc(db, 'simulations', id));
        setSimulations(simulations.filter(sim => sim.id !== id));
      } catch (err) {
        setError('Error deleting simulation: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading simulations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="past-simulations">
      <h2>Past Simulations</h2>
      {simulations.length === 0 ? (
        <p>No simulations found.</p>
      ) : (
        <div className="simulations-grid">
          {simulations.map(simulation => (
            <div key={simulation.id} className="simulation-card">
              <h3>{simulation.name || 'Unnamed Simulation'}</h3>
              <p>Created: {new Date(simulation.createdAt?.toDate()).toLocaleDateString()}</p>
              <div className="simulation-details">
                <p>Portfolio Value: ${simulation.portfolioValue?.toLocaleString()}</p>
                <p>Number of Groups: {simulation.groups?.length || 0}</p>
              </div>
              <div className="simulation-actions">
                <button 
                  className="view-button"
                  onClick={() => window.location.href = `/simulation/${simulation.id}`}
                >
                  View Details
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(simulation.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastSimulations; 