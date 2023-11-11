import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

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

function PopUp({ isOpen, onClose }) {
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    console.log('Selected Topics:', selectedTopics);
  }, [selectedTopics]);

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

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Select Topics">
      <h2>Select Question Topics</h2>
      <div>
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
      <button onClick={onClose}>Close</button>
    </Modal>
  );
}

export default PopUp;
