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
    return <div className="text-center py-10 text-[1.2em] text-[#666]">Loading simulations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-[#f44336] text-[1.2em]">{error}</div>;
  }

  return (
    <div className="p-5 max-w-[1200px] mx-auto">
      <h2 className="text-center text-[#333] mb-8">Past Simulations</h2>
      {simulations.length === 0 ? (
        <p>No simulations found.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 p-5 max-md:grid-cols-1 max-md:p-2.5">
          {simulations.map(simulation => (
            <div key={simulation.id} className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)] max-md:my-2.5">
              <h3 className="text-[#333] m-0 mb-2.5 text-[1.2em]">{simulation.name || 'Unnamed Simulation'}</h3>
              <p className="text-[#666] my-1">Created: {new Date(simulation.createdAt?.toDate()).toLocaleDateString()}</p>
              <div className="my-4 py-2.5 border-t border-b border-gray-200">
                <p className="text-[#666] my-1">Portfolio Value: ${simulation.portfolioValue?.toLocaleString()}</p>
                <p className="text-[#666] my-1">Number of Groups: {simulation.groups?.length || 0}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  className="py-2 px-4 border-none rounded cursor-pointer transition-colors duration-200 bg-[#4CAF50] text-white hover:bg-[#45a049]"
                  onClick={() => window.location.href = `/simulation/${simulation.id}`}
                >
                  View Details
                </button>
                <button 
                  className="py-2 px-4 border-none rounded cursor-pointer transition-colors duration-200 bg-[#f44336] text-white hover:bg-[#da190b]"
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
