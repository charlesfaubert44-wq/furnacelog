/**
 * SeasonalChecklist Component
 * UI for seasonal maintenance checklists (E5-T10)
 *
 * Features:
 * - Display current season checklist
 * - Checkbox for each item
 * - Progress bar
 * - Item detail modal with instructions
 * - Notes for each item
 * - Year-over-year comparison
 */

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './SeasonalChecklist.css';

const SEASONS = {
  'pre-freeze-up': {
    name: 'Pre-Freeze-Up',
    icon: '❄️',
    description: 'Prepare for winter (Sept-Oct)',
    color: '#f59e0b'
  },
  'winter': {
    name: 'Winter',
    icon: '🏔️',
    description: 'Winter operations (Nov-Mar)',
    color: '#3b82f6'
  },
  'break-up': {
    name: 'Break-Up',
    icon: '🌊',
    description: 'Spring thaw preparation (Apr-May)',
    color: '#10b981'
  },
  'summer': {
    name: 'Summer',
    icon: '☀️',
    description: 'Summer maintenance (Jun-Aug)',
    color: '#eab308'
  }
};

const SeasonalChecklist = ({ homeId }) => {
  const [checklists, setChecklists] = useState([]);
  const [currentChecklist, setCurrentChecklist] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 9 && month <= 10) return 'pre-freeze-up';
    if (month >= 11 || month <= 3) return 'winter';
    if (month >= 4 && month <= 5) return 'break-up';
    return 'summer';
  };

  // Fetch checklists
  useEffect(() => {
    const fetchChecklists = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ homeId, year: selectedYear });
        if (selectedSeason) params.append('season', selectedSeason);

        const response = await fetch(`/api/v1/maintenance/checklists/seasonal?${params}`);
        const data = await response.json();

        if (data.success) {
          setChecklists(data.data);

          // Set current checklist
          if (!selectedSeason) {
            const currentSeason = getCurrentSeason();
            const current = data.data.find(c => c.season === currentSeason && c.year === selectedYear);
            setCurrentChecklist(current);
            setSelectedSeason(currentSeason);
          } else {
            const current = data.data.find(c => c.season === selectedSeason && c.year === selectedYear);
            setCurrentChecklist(current);
          }
        }
      } catch (error) {
        console.error('Failed to fetch checklists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChecklists();
  }, [homeId, selectedYear, selectedSeason]);

  // Generate checklist if doesn't exist
  const handleGenerateChecklist = async () => {
    try {
      const response = await fetch('/api/v1/maintenance/checklists/seasonal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeId,
          season: selectedSeason,
          year: selectedYear
        })
      });

      const data = await response.json();

      if (data.success) {
        setCurrentChecklist(data.data);
        setChecklists([...checklists, data.data]);
      }
    } catch (error) {
      console.error('Failed to generate checklist:', error);
    }
  };

  // Update checklist item
  const handleItemUpdate = async (itemId, status, notes = '') => {
    if (!currentChecklist) return;

    try {
      const response = await fetch(
        `/api/v1/maintenance/checklists/seasonal/${currentChecklist._id}/item/${itemId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes })
        }
      );

      const data = await response.json();

      if (data.success) {
        setCurrentChecklist(data.data);
      }
    } catch (error) {
      console.error('Failed to update checklist item:', error);
    }
  };

  // Render loading state
  if (isLoading) {
    return <div className="loading-state">Loading seasonal checklists...</div>;
  }

  return (
    <div className="seasonal-checklist-container">
      <div className="checklist-header">
        <h2>Seasonal Maintenance Checklists</h2>

        {/* Season selector */}
        <div className="season-selector">
          {Object.entries(SEASONS).map(([key, season]) => (
            <button
              key={key}
              className={`season-button ${selectedSeason === key ? 'active' : ''}`}
              style={{ borderColor: season.color }}
              onClick={() => setSelectedSeason(key)}
            >
              <span className="season-icon">{season.icon}</span>
              <span className="season-name">{season.name}</span>
            </button>
          ))}
        </div>

        {/* Year selector */}
        <div className="year-selector">
          <button onClick={() => setSelectedYear(selectedYear - 1)}>◀</button>
          <span className="current-year">{selectedYear}</span>
          <button onClick={() => setSelectedYear(selectedYear + 1)}>▶</button>
        </div>
      </div>

      {/* Checklist content */}
      {currentChecklist ? (
        <div className="checklist-content">
          {/* Progress bar */}
          <div className="progress-section">
            <div className="progress-header">
              <h3>
                {SEASONS[currentChecklist.season].name} {currentChecklist.year}
              </h3>
              <span className="progress-percentage">{currentChecklist.progress}% Complete</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${currentChecklist.progress}%`,
                  backgroundColor: SEASONS[currentChecklist.season].color
                }}
              />
            </div>

            <div className="progress-dates">
              <span>Started: {moment(currentChecklist.startDate).format('MMM D, YYYY')}</span>
              <span>Target: {moment(currentChecklist.targetEndDate).format('MMM D, YYYY')}</span>
            </div>
          </div>

          {/* Checklist items */}
          <div className="checklist-items">
            {currentChecklist.items.map((item) => (
              <div
                key={item._id}
                className={`checklist-item status-${item.status}`}
              >
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={item.status === 'completed'}
                    onChange={(e) => {
                      const newStatus = e.target.checked ? 'completed' : 'pending';
                      handleItemUpdate(item._id, newStatus);
                    }}
                  />
                </div>

                <div className="item-content">
                  <div className="item-title">
                    {item.taskId?.name || item.customDescription}
                  </div>

                  {item.taskId?.description && (
                    <div className="item-description">
                      {item.taskId.description}
                    </div>
                  )}

                  {item.notes && (
                    <div className="item-notes">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}
                </div>

                <div className="item-actions">
                  <button
                    className="btn-icon"
                    onClick={() => setSelectedItem(item)}
                    title="View details"
                  >
                    ℹ️
                  </button>

                  {item.status !== 'completed' && (
                    <>
                      <button
                        className="btn-icon"
                        onClick={() => handleItemUpdate(item._id, 'skipped')}
                        title="Skip this item"
                      >
                        ⏭️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleItemUpdate(item._id, 'not-applicable')}
                        title="Mark as not applicable"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Year-over-year comparison */}
          <div className="year-comparison">
            <h4>Previous Years</h4>
            {checklists
              .filter(c => c.season === selectedSeason && c.year !== selectedYear)
              .sort((a, b) => b.year - a.year)
              .map(checklist => (
                <div key={checklist._id} className="comparison-item">
                  <span>{checklist.year}</span>
                  <div className="comparison-progress">
                    <div
                      className="comparison-fill"
                      style={{ width: `${checklist.progress}%` }}
                    />
                  </div>
                  <span>{checklist.progress}%</span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="no-checklist">
          <p>No checklist exists for {SEASONS[selectedSeason].name} {selectedYear}</p>
          <button
            className="btn btn-primary"
            onClick={handleGenerateChecklist}
          >
            Generate Checklist
          </button>
        </div>
      )}

      {/* Item detail modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleItemUpdate}
        />
      )}
    </div>
  );
};

// Item detail modal
const ItemDetailModal = ({ item, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(item.notes || '');

  const handleSaveNotes = () => {
    onUpdate(item._id, item.status, notes);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item.taskId?.name || item.customDescription}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {item.taskId?.description && (
            <div className="task-description">
              <h4>Description</h4>
              <p>{item.taskId.description}</p>
            </div>
          )}

          {item.taskId?.execution?.instructions && (
            <div className="task-instructions">
              <h4>Instructions</h4>
              <ol>
                {item.taskId.execution.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          {item.taskId?.execution?.safetyWarnings && (
            <div className="task-warnings">
              <h4>⚠️ Safety Warnings</h4>
              <ul>
                {item.taskId.execution.safetyWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="task-notes">
            <h4>Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this task..."
              rows="4"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleSaveNotes}>
            Save Notes
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeasonalChecklist;
