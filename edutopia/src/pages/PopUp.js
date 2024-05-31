import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../pages/Game.css';
import NotificationManager from '../pages/game/NotificationManager';
import sounds from './game/sounds/soundImports.js';

Modal.setAppElement('#root'); 

// Number of question topics
const totalCheckboxes = 11;

// Names of question topics
const checkboxLabels = [
  'Artificial Intelligence',
  'Capstone',
  'Data Science',
  'IBM Automation',
  'IBM Cloud',
  'IBM Engineering',
  'IBM Security',
  'IBM Z',
  'Power Systems',
  'Red Hat Academy',
  'IBM Quantum',
];

function PopUp({ isOpen, onClose, onTopicsChange }) {
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    console.log('Selected Topics:', selectedTopics);
    // Notify parent component about the change in topics
    onTopicsChange(selectedTopics);
  }, [selectedTopics, onTopicsChange]);


  const toggleTopic = (topicNumber) => {
    setSelectedTopics((prevTopics) => {
      const isTopicSelected = prevTopics.includes(topicNumber);
  
      if (isTopicSelected) {
        // If the genre is already selected, remove it from the list
        return prevTopics.filter((selectedTopic) => selectedTopic !== topicNumber);
      } else {
        // If the genre is not selected, add it to the list
        return [...prevTopics, topicNumber];
      }
    });
  };

  const handleClose = () => {
    onTopicsChange(selectedTopics);
    if(selectedTopics.length === 0){
      NotificationManager.showSuccessNotification("Please select at least one topic!")
      sounds[0].play();
    }
    else{
      sounds[0].play();
      onClose();
    }
    // Export the current state of selectedTopics when the modal is closed
  
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Select Topics" className="topicsModal">
      <h2>Select Question Topics</h2>
      <div className='checkboxCont'>
        {[...Array(totalCheckboxes)].map((_, index) => (
          <div key={index + 1}>
            <label>
              <input
                type="checkbox"
                value={index + 1}
                checked={selectedTopics.includes(index + 1)}
                onChange={() => toggleTopic(index + 1)}
              />
              {checkboxLabels[index]}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleClose} className='topicCloseButton'>Confirm</button>
    </Modal>
  );
}

export default PopUp; 
