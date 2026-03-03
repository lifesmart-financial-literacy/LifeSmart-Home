import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const SimulationControls = () => {
  const [years, setYears] = useState(1);
  const [assets] = useState(['Equity', 'Bonds', 'RealEstate', 'Commodities', 'Other']);
  const [quarters] = useState(['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec']);
  const [assetChanges, setAssetChanges] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [events, setEvents] = useState({});
  const [showEventList, setShowEventList] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    initializeAssetChanges(years);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initializeAssetChanges is stable
  }, [years]);

  const getNextSimulationIndex = async () => {
    const db = getFirestore();
    const simulationRef = collection(db, 'Quiz', 'Asset Market Simulations', 'Simulations');
    try {
      const snapshot = await getDocs(simulationRef);
      console.log(`Number of documents in collection 'Quiz':`, snapshot.size);
      return snapshot.size + 1;
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleEventFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      processEventUploadedData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const processEventUploadedData = (data) => {
    data.shift(); // Remove header row
    
    const newEvents = {};
    
    data.forEach(row => {
      const yearMatch = row[0].match(/\d+/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
      const quarter = quarters.find(q => row[1].includes(q));
      
      const eventName = row[2] ? row[2].toString().trim() : "";
      const eventDescription = row[3] ? row[3].toString().trim() : "";

      if (!eventName && !eventDescription) return;
      
      if (!newEvents[year]) newEvents[year] = {};
      if (!newEvents[year][quarter]) newEvents[year][quarter] = {};
      
      newEvents[year][quarter] = { name: eventName, description: eventDescription };
    });

    setEvents(newEvents);
  };

  const initializeAssetChanges = (years) => {
    const newAssetChanges = Array.from({ length: years }, () => {
      return quarters.reduce((acc, quarter) => {
        acc[quarter] = assets.reduce((acc, asset) => {
          acc[asset] = 0;
          return acc;
        }, {});
        return acc;
      }, {});
    });
    setAssetChanges(newAssetChanges);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const simulationIndex = await getNextSimulationIndex();
    console.log(`Simulation Index: ${simulationIndex}`);

    if (!simulationIndex) {
      console.error('Failed to fetch simulation index');
      showConfirmationModalWithMessage('Error: Failed to fetch simulation index');
      return;
    }

    const db = getFirestore();

    const mainDocRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${simulationIndex}`);
    const controlsDocRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${simulationIndex}`, 'Simulation Controls', 'Controls');

    const mainData = {
      createdAt: new Date()
    };

    const controlsData = {
      years,
      assetChanges,
      events
    };

    try {
      await setDoc(mainDocRef, mainData);
      await setDoc(controlsDocRef, controlsData);

      console.log('All changes, including events, have been saved to Firestore');
      showConfirmationModalWithMessage('Data has been successfully saved.');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
      showConfirmationModalWithMessage('Error: Failed to save data.');
    }
  };

  const showConfirmationModalWithMessage = (message) => {
    setConfirmationMessage(message);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const getColorForYear = (index) => {
    const hue = (index * 137) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      processUploadedData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const processUploadedData = (data) => {
    data.shift(); // Remove header row
    
    const uniqueYears = new Set();
    data.forEach(row => {
      const yearMatch = row[0].match(/\d+/);
      if (yearMatch) {
        uniqueYears.add(yearMatch[0]);
      }
    });
    const yearsCount = uniqueYears.size;

    if (years !== yearsCount) {
      setYears(yearsCount);
      setTimeout(() => {
        populateAssetChangesWithData(data);
      }, 0);
    } else {
      populateAssetChangesWithData(data);
    }
  };

  const populateAssetChangesWithData = (data) => {
    initializeAssetChanges(years);

    const newAssetChanges = [...assetChanges];
    data.forEach(row => {
      const yearMatch = row[0].match(/\d+/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : null;
      const quarter = quarters.includes(row[1]) ? row[1] : null;
      if (year === null || quarter === null) return;

      assets.forEach((asset, index) => {
        let value = row[index + 2];
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          newAssetChanges[year - 1][quarter][asset] = parseFloat(value);
        }
      });
    });
    setAssetChanges(newAssetChanges);
  };

  const quarterClicked = (yearIndex, quarter) => {
    setSelectedYear(yearIndex);
    setSelectedQuarter(quarter);
    setEventName('');
    setEventDescription('');
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
  };

  const saveEvent = () => {
    const newEvents = { ...events };
    if (!newEvents[selectedYear]) {
      newEvents[selectedYear] = {};
    }
    newEvents[selectedYear][selectedQuarter] = {
      name: eventName,
      description: eventDescription
    };

    setEvents(newEvents);
    console.log('Event added to local state');
    closeEventModal();
  };

  const generateRandomValues = () => {
    const newAssetChanges = assetChanges.map(yearData => {
      const newYearData = { ...yearData };
      Object.keys(newYearData).forEach(quarter => {
        newYearData[quarter] = { ...newYearData[quarter] };
        assets.forEach(asset => {
          newYearData[quarter][asset] = getRandomNumber();
        });
      });
      return newYearData;
    });
    setAssetChanges(newAssetChanges);
  };

  const getRandomNumber = () => {
    return parseFloat((Math.random() * 20 - 10).toFixed(2));
  };

  const toggleEventList = () => {
    setShowEventList(!showEventList);
  };

  const editEvent = (year, quarter) => {
    const event = events[year][quarter];
    if (event) {
      setSelectedYear(year);
      setSelectedQuarter(quarter);
      setEventName(event.name);
      setEventDescription(event.description);
      setShowEventModal(true);
    }
  };

  const deleteEvent = (year, quarter) => {
    setEventToDelete({ year, quarter });
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      const { year, quarter } = eventToDelete;
      const newEvents = { ...events };
      delete newEvents[year][quarter];
      if (Object.keys(newEvents[year]).length === 0) {
        delete newEvents[year];
      }
      setEvents(newEvents);
      console.log(`Event for ${quarter} of year ${year} deleted`);
      setShowDeleteConfirmation(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEventToDelete(null);
  };

  return (
    <div className="my-8 mx-auto py-10 px-10 bg-gradient-to-b from-white to-[#f5f7fa] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.05)] max-w-[1400px] w-[95%]">
      <h2 className="text-[2.5rem] font-bold text-[#1a1a1a] mb-8 text-center tracking-tight">Simulation Controls</h2>
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <label htmlFor="years" className="text-[1.1rem] font-medium text-[#4a5568] min-w-[100px]">Years:</label>
          <input
            type="number"
            id="years"
            className="w-[120px] py-3 px-3 border-2 border-[#e2e8f0] rounded-lg text-base text-[#2d3748] bg-white transition-all duration-200 text-center focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.15)] focus:outline-none"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="mb-6">
          <h3 className="text-[1.8rem] font-semibold text-[#2d3748] my-8 mx-0 mb-6 text-center">Quarterly Asset Changes</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-center mb-5 text-[#FFD700]">Year</th>
                <th className="text-center mb-5 text-[#FFD700]">Quarter</th>
                {assets.map(asset => (
                  <th key={asset} className="text-center mb-5 text-[#FFD700]">{asset}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: years }, (_, i) => i + 1).map(yearIndex => (
                quarters.map((quarter, qIndex) => (
                  <tr
                    key={`${yearIndex}-${quarter}`}
                    style={{ backgroundColor: getColorForYear(yearIndex) }}
                  >
                    {qIndex === 0 && (
                      <td rowSpan={quarters.length}>{yearIndex}</td>
                    )}
                    <td>
                      <button
                        type="button"
                        className="bg-transparent text-[#4299e1] font-semibold py-2 px-4 rounded-md transition-all duration-200 hover:bg-[#4299e1]/10"
                        onClick={() => quarterClicked(yearIndex, quarter)}
                      >
                        {quarter}
                      </button>
                    </td>
                    {assets.map(asset => (
                      <td key={`${yearIndex}-${quarter}-${asset}`}>
                        <input
                          type="number"
                          className="w-[120px] py-3 px-3 border-2 border-[#e2e8f0] rounded-lg text-base text-[#2d3748] bg-white transition-all duration-200 text-center focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.15)] focus:outline-none"
                          value={assetChanges[yearIndex - 1]?.[quarter]?.[asset] || 0}
                          onChange={(e) => {
                            const newAssetChanges = [...assetChanges];
                            newAssetChanges[yearIndex - 1][quarter][asset] = parseFloat(e.target.value);
                            setAssetChanges(newAssetChanges);
                          }}
                          step="0.01"
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={toggleEventList} className="bg-gradient-to-br from-[#4299e1] to-[#667eea] text-white py-4 px-8 rounded-xl text-base font-semibold border-none cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(66,153,225,0.2)] uppercase tracking-wide w-full hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(66,153,225,0.3)] hover:from-[#3182ce] hover:to-[#5a67d8]">
          {showEventList ? 'Hide Events' : 'Show Events'}
        </button>
        <button type="submit" className="bg-gradient-to-br from-[#48bb78] to-[#38a169] text-white border-none py-4 px-8 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(72,187,120,0.2)] mt-4 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(72,187,120,0.3)] hover:from-[#38a169] hover:to-[#2f855a]">Save</button>
        <button type="button" className="bg-[#0e335c] text-white border-none py-2.5 px-5 mt-2.5 rounded-md cursor-pointer transition-all duration-200 hover:bg-[#0056b3] hover:-translate-y-0.5 active:translate-y-px" onClick={generateRandomValues}>
          Generate Random Values
        </button>
        <label className="inline-flex items-center gap-2 py-4 px-8 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-xl cursor-pointer transition-all duration-300 font-semibold shadow-[0_4px_12px_rgba(102,126,234,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(102,126,234,0.3)] hover:from-[#5a67d8] hover:to-[#6b46c1]">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <span className="text-base">Upload File</span>
        </label>
        <label className="inline-flex items-center gap-2 py-4 px-8 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-xl cursor-pointer transition-all duration-300 font-semibold shadow-[0_4px_12px_rgba(102,126,234,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(102,126,234,0.3)] hover:from-[#5a67d8] hover:to-[#6b46c1] ml-2">
          <input
            type="file"
            className="hidden"
            onChange={handleEventFileUpload}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <span className="text-base">Upload Event File</span>
        </label>
      </form>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={closeConfirmationModal}>
          <div className="bg-white p-5 rounded-lg text-center max-w-[400px] w-full" onClick={e => e.stopPropagation()}>
            <h3>{confirmationMessage}</h3>
            <button onClick={closeConfirmationModal} className="bg-[#0e335c] text-white border-none py-2.5 px-5 mt-2.5 rounded-md cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[5px] flex items-center justify-center z-[10]" onClick={closeEventModal}>
          <div className="bg-white rounded-[20px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.2)] w-[90%] max-w-[600px] z-[11]" onClick={e => e.stopPropagation()}>
            <h3 className="m-0 mb-5">Add Event for {selectedYear} - {selectedQuarter}</h3>
            <label htmlFor="eventName" className="block my-2.5">Event Name:</label>
            <input
              type="text"
              id="eventName"
              className="w-full py-4 px-4 border-2 border-[#e2e8f0] rounded-lg text-base my-2 mx-0 mb-6 transition-all duration-200 focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.15)] focus:outline-none"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            
            <label htmlFor="eventDescription" className="block my-2.5">Description:</label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="w-full py-4 px-4 border-2 border-[#e2e8f0] rounded-lg text-base my-2 mx-0 mb-6 transition-all duration-200 resize-y h-[100px] focus:border-[#4299e1] focus:shadow-[0_0_0_3px_rgba(66,153,225,0.15)] focus:outline-none"
            />
            
            <button onClick={saveEvent} className="py-2.5 px-5 mr-2.5 border-none rounded-md cursor-pointer bg-[#FFD700] text-[#000080] transition-all duration-300 hover:scale-105 active:scale-95">Save Event</button>
            <button onClick={closeEventModal} className="py-2.5 px-5 border-none rounded-md cursor-pointer bg-[#0e335c] text-white">Cancel</button>
          </div>
        </div>
      )}

      {showEventList && (
        <div className="bg-gradient-to-br from-[#2d3748] to-[#1a202c] border-l-none py-8 px-8 w-[400px] shadow-[-10px_0_30px_rgba(0,0,0,0.2)] text-white fixed right-0 top-0 bottom-0 overflow-y-auto transition-[right] duration-300 z-[1000] max-lg:w-[300px] max-md:w-full">
          <h3>Active Events</h3>
          <ul className="p-0">
            {Object.entries(events).map(([year, yearEvents]) => (
              <li key={year} className="bg-white/5 rounded-xl py-4 px-4 mb-4 backdrop-blur-[10px] border border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:translate-x-1">
                <h4 className="mt-4 mb-2.5 text-[1.2em] border-b border-[#FFD700] pb-1.5">Year {year}</h4>
                <ul>
                  {Object.entries(yearEvents).map(([quarter, event]) => (
                    <li key={quarter}>
                      {quarter}: {event.name}
                      <span className="text-white/70 text-[0.9rem] mt-2 block leading-normal"> - {event.description}</span>
                      <button className="bg-transparent border-none py-2 px-4 rounded cursor-pointer mt-2 hover:scale-105 active:scale-95" onClick={() => editEvent(year, quarter)}>Edit</button>
                      <button className="bg-transparent border-none py-2 px-4 rounded cursor-pointer mt-2 hover:scale-105 active:scale-95" onClick={() => deleteEvent(year, quarter)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={handleCancelDelete}>
          <div className="bg-white p-5 rounded-lg text-center max-w-[400px] w-full" onClick={e => e.stopPropagation()}>
            <h3>Delete Event</h3>
            <p className="my-4 text-center text-[#333]">Are you sure you want to delete the event for {eventToDelete?.quarter} of year {eventToDelete?.year}?</p>
            <div className="flex justify-center gap-2.5 mt-5">
              <button onClick={handleConfirmDelete} className="bg-transparent border-none py-2 px-4 rounded cursor-pointer min-w-[100px] hover:scale-105 active:scale-95">Delete</button>
              <button onClick={handleCancelDelete} className="bg-[#0e335c] text-white border-none py-2 px-4 rounded cursor-pointer min-w-[100px]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationControls;
