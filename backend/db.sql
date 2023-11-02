CREATE TABLE IF NOT EXISTS Topics (
    Topic_id INT PRIMARY KEY AUTO_INCREMENT,
    Topic_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Questions (
    Question_id INT PRIMARY KEY AUTO_INCREMENT,
    Topic_id INT,
    Question TEXT NOT NULL,
    Option_1 TEXT NOT NULL,
    Option_2 TEXT,
    Option_3 TEXT,
    Option_4 TEXT,
    Correct_answer INT NOT NULL CHECK(Correct_answer >= 1 AND Correct_answer <= 4),
    FOREIGN KEY (Topic_id) REFERENCES Topics(Topic_id)
);


INSERT INTO Topics (Topic_name) VALUES
('Artificial Intelligence'),
('Capstone'),
('Data Science'),
('IBM Automation'),
('IBM Cloud'),
('IBM Engineering'),
('IBM Security'),
('IBM Z'),
('Power Systems'),
('Red Hat Academy'),
('IBM Quantum');


INSERT INTO Questions (Topic_id, Question, Option_1, Option_2, Option_3, Option_4, Correct_answer) VALUES

(1, 'What is the main algorithm behind deep learning models?', 'Backpropagation', 'Clustering', 'Decision Trees', 'Genetic Algorithm', 1),
(1, 'Which AI technique uses agents and environments?', 'Reinforcement Learning', 'Supervised Learning', 'Transfer Learning', 'Neural Networks', 1),
(2, 'What is the IBM capstone project?', 'A project focused on IBM\'s history.', 'A project that allows students to showcase their skills and knowledge...', 'A mandatory internship at IBM.','A programming competition.', 2),
(2, 'How does an IBM capstone project allow students to merge academic knowledge and showcase proficiency...', 'By giving theoretical exams.', 'By watching video lectures.', 'Students demonstrate their abilities...', 'By attending seminars.', 3),
(3, 'What does the Enterprise-grade AI course provide?', 'A tour of IBM facilities.', 'The foundations of Artificial Intelligence for business.', 'Basic computer skills.', 'A course on digital marketing.', 2),
(3, 'What topics does the Enterprise-grade AI course cover?', 'Cooking recipes.', 'AI Evolution, AI Industry Adoption Trends, Natural Language Processing...', 'Astronomy and space exploration.', 'Historical events.', 2),
(3, 'What is Enterprise Data Science?', 'A science fiction novel series.', 'IBM Enterprise Data Science uses AI, machine learning...', 'A new programming language.', 'A database management system.', 2),
(3, 'What does Enterprise Data Science provide?', 'Entertainment news.', 'A basic understanding of the foundations of Data Science.', 'A gardening guide.', 'Cooking tutorials.', 2),
(3, 'What topics does the Enterprise Data Science course cover?', 'Movie reviews.', 'Data Science Team Roles, Data Analysis Tools...', 'Fashion trends.', 'Automotive engineering.', 2),
(7, 'What is IBM threat intelligence and hunting?', 'A video game developed by IBM.', 'A proactive approach to identifying previously unknown threats...', 'A hunting club sponsored by IBM.', 'A documentary series.', 2),
(7, 'What does the IBM threat and intelligence course expose the learner to?', 'Wilderness survival skills.', 'Musical instruments.', 'Attack trends by geography, threat intelligence tools...', 'Documentary filmmaking techniques.', 3),
(5, 'What is the cloud for the enterprise?', 'A weather forecasting system.', 'A cloud-shaped office building.', 'A simpler way to centrally manage billing...', 'A painting technique.', 3),
(5, 'What does the cloud for the enterprise provide?', 'Wedding planning services.', 'Consumer applications, Enterprise adoption, Delivery models...', 'A book club subscription.', 'Interior design ideas.', 2),
(5, 'What can you create within the cloud enterprise?', 'Sculptures and paintings.', 'A multi-tiered hierarchy of accounts...', 'A new dance form.', 'A travel itinerary.', 2)
    ]