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
    <div className="simulationcontrols-container">
      <h2>Simulation Controls</h2>
      <form onSubmit={onSubmit}>
        <div className="simulationcontrols-input-group">
          <label htmlFor="years">Years:</label>
          <input
            type="number"
            id="years"
            className="simulationcontrols-input"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            min="1"
          />
        </div>
        <div className="simulationcontrols-quarterly-changes">
          <h3>Quarterly Asset Changes</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Quarter</th>
                {assets.map(asset => (
                  <th key={asset}>{asset}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: years }, (_, i) => i + 1).map(yearIndex => (
                quarters.map((quarter, qIndex) => (
                  <tr
                    key={`${yearIndex}-${quarter}`}
                    className={`simulationcontrols-year-${yearIndex}`}
                    style={{ backgroundColor: getColorForYear(yearIndex) }}
                  >
                    {qIndex === 0 && (
                      <td rowSpan={quarters.length}>{yearIndex}</td>
                    )}
                    <td>
                      <button
                        type="button"
                        className="simulationcontrols-quarter-button"
                        onClick={() => quarterClicked(yearIndex, quarter)}
                      >
                        {quarter}
                      </button>
                    </td>
                    {assets.map(asset => (
                      <td key={`${yearIndex}-${quarter}-${asset}`}>
                        <input
                          type="number"
                          className="simulationcontrols-input"
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
        <button onClick={toggleEventList} className="simulationcontrols-toggle-event-list-button">
          {showEventList ? 'Hide Events' : 'Show Events'}
        </button>
        <button type="submit" className="simulationcontrols-save-button">Save</button>
        <button type="button" className="simulationcontrols-modern-button" onClick={generateRandomValues}>
          Generate Random Values
        </button>
        <label className="simulationcontrols-custom-file-upload">
          <input
            type="file"
            className="simulationcontrols-input"
            onChange={handleFileUpload}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: 'none' }}
          />
          <span>Upload File</span>
        </label>
        <label className="simulationcontrols-custom-file-upload">
          <input
            type="file"
            className="simulationcontrols-input"
            onChange={handleEventFileUpload}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: 'none' }}
          />
          <span>Upload Event File</span>
        </label>
      </form>

      {showConfirmationModal && (
        <div className="simulationcontrols-modal-overlay" onClick={closeConfirmationModal}>
          <div className="simulationcontrols-modal-content" onClick={e => e.stopPropagation()}>
            <h3>{confirmationMessage}</h3>
            <button onClick={closeConfirmationModal}>Close</button>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="simulationcontrols-event-modal-overlay" onClick={closeEventModal}>
          <div className="simulationcontrols-event-modal" onClick={e => e.stopPropagation()}>
            <h3>Add Event for {selectedYear} - {selectedQuarter}</h3>
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              className="simulationcontrols-input"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            
            <label htmlFor="eventDescription">Description:</label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            
            <button onClick={saveEvent}>Save Event</button>
            <button onClick={closeEventModal}>Cancel</button>
          </div>
        </div>
      )}

      {showEventList && (
        <div className="simulationcontrols-event-list-container">
          <h3>Active Events</h3>
          <ul className="simulationcontrols-event-list">
            {Object.entries(events).map(([year, yearEvents]) => (
              <li key={year}>
                <h4>Year {year}</h4>
                <ul>
                  {Object.entries(yearEvents).map(([quarter, event]) => (
                    <li key={quarter}>
                      {quarter}: {event.name}
                      <span className="simulationcontrols-event-description"> - {event.description}</span>
                      <button className="simulationcontrols-edit-button" onClick={() => editEvent(year, quarter)}>Edit</button>
                      <button className="simulationcontrols-delete-button" onClick={() => deleteEvent(year, quarter)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="simulationcontrols-modal-overlay" onClick={handleCancelDelete}>
          <div className="simulationcontrols-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Event</h3>
            <p>Are you sure you want to delete the event for {eventToDelete?.quarter} of year {eventToDelete?.year}?</p>
            <div className="simulationcontrols-modal-actions">
              <button onClick={handleConfirmDelete} className="simulationcontrols-delete-button">Delete</button>
              <button onClick={handleCancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationControls; 