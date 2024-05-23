-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: questions
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `topic_questions`
--

DROP TABLE IF EXISTS `topic_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic_questions` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `question_text` varchar(255) NOT NULL,
  `option_one` varchar(100) NOT NULL,
  `option_two` varchar(100) NOT NULL,
  `option_three` varchar(100) NOT NULL,
  `option_four` varchar(100) NOT NULL,
  `correct` varchar(100) NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `topic_id` (`topic_id`),
  CONSTRAINT `topic_questions_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`topic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic_questions`
--

LOCK TABLES `topic_questions` WRITE;
/*!40000 ALTER TABLE `topic_questions` DISABLE KEYS */;
INSERT INTO `topic_questions` (topic_id, question_text, option_one, option_two, option_three, option_four, correct)
VALUES 
  (1, 'What is the main algorithm behind deep learning models?', 'Backpropagation', 'Clustering', 'Decision Trees', 'Genetic Algorithm', 'Backpropagation'),
  (1, 'Which AI technique uses agents and environments?', 'Reinforcement Learning', 'Supervised Learning', 'Transfer Learning', 'Neural Networks', 'Reinforcement Learning'),
  (2, 'What is the IBM capstone project?', 'A project focused on IBMs history.', 'A project that allows students to showcase their skills and knowledge...', 'A mandatory internship at IBM.','A programming competition.', 'A project that allows students to showcase their skills and knowledge...'),
  (2, 'How does an IBM capstone project allow students to merge academic knowledge and showcase proficiency...', 'By giving theoretical exams.', 'By watching video lectures.', 'Students demonstrate their abilities...', 'By attending seminars.', 'Students demonstrate their abilities...'),
  (2, 'What skills are covered in the EDT Practitioner Course?', 'Data analysis', 'Accounting principles', 'Marketing Tactics', 'Advanced programming techniques', 'Accounting principles'),
  (2, 'Which resource helps in increasing the accessibility of your product regardless of role or expertise?', 'EDT Co-Creator', 'IBM Design Equal Access Toolkit', 'Garage Method', 'Globalization Pipeline', 'IBM Design Equal Access Toolkit'),
  (2, 'What principles is the Garage Method built on?', 'Agile principles', 'Design research', 'Enterprise Design Thinking', 'Continuous Integration/Continuous Deployment (CI/CD) principles', 'Agile principles'),
  (2, 'What methods are focused on in the EDT Co-Creator activities?', 'Design synthesis techniques', 'Product marketing strategies', 'Identifying stakeholders', 'User experience design', 'Identifying stakeholders'),
  (2, 'Which course provides a baseline of Enterprise Design Thinking skills?', 'Garage Method', 'IBM Design Equal Access Toolkit', 'EDT Practitioner', 'Cognitive Systems Engineering', 'EDT Practitioner');
  (3, 'What does the Enterprise-grade AI course provide?', 'A tour of IBM facilities.', 'The foundations of Artificial Intelligence for business.', 'Basic computer skills.', 'A course on digital marketing.', 'The foundations of Artificial Intelligence for business.'),
  (3, 'What topics does the Enterprise-grade AI course cover?', 'Cooking recipes.', 'AI Evolution, AI Industry Adoption Trends, Natural Language Processing...', 'Astronomy and space exploration.', 'Historical events.', 'AI Evolution, AI Industry Adoption Trends, Natural Language Processing...'),
  (3, 'What is Enterprise Data Science?', 'A science fiction novel series.', 'IBM Enterprise Data Science uses AI, machine learning...', 'A new programming language.', 'A database management system.', 'IBM Enterprise Data Science uses AI, machine learning...'),
  (3, 'What does Enterprise Data Science provide?', 'Entertainment news.', 'A basic understanding of the foundations of Data Science.', 'A gardening guide.', 'Cooking tutorials.', 'A basic understanding of the foundations of Data Science.'),
  (3, 'What topics does the Enterprise Data Science course cover?', 'Movie reviews.', 'Data Science Team Roles, Data Analysis Tools...', 'Fashion trends.', 'Automotive engineering.', 'Data Science Team Roles, Data Analysis Tools...'),
  (4, 'The LIFO concept, meaning Last-in-first-out, means “The last in is first out”, relates to which type of collection?', 'Stack', 'List', 'Queue', 'None', 'Stack'),
  (4, 'By clicking on the left side of the command line in the Designer interface, it is defined:', 'Commands', 'Breakpoints', 'Subroutines', 'Variables', 'Breakpoints'),
  (4, 'In the WDG Automation Studio tool, the construction of the script done by drag-and-drop functionality is done in which interface?', 'Script', 'Call Graph', 'Variables', 'Designer', 'Designer'),
  (4, 'Which the command has as one of its functions to print an output message?', 'Log Message', 'Write to File', 'Concatenate Texts', 'Replace Text', 'Log Message'),
  (4, 'If there are two text variables "WDG Automation" and "IBM Robotic Process Automation", if you use the Replace Text (replaceText) command to replace the first variable with the second variable, what is the expected result?', 'WDG AutomationIBM Robotic Process Automation', 'WDG Robotic Process Automation', 'WDG Automation', 'IBM Robotic Process Automation', 'IBM Robotic Process Automation'),
  (4, 'What command is used to assign a value to a specific field in an editable PDF file?', 'Set Variable', 'Merge PDFs', 'Open PDF File', 'Assign Value to PDF', 'Assign Value to PDF'),
  (4, 'What the Add row (addRow) command does?', 'Deletes a column from a data table.', 'Allows you to add a new row of values to a Data Table, even if the table contains values.', 'Copies the values of one or more specific rows from one table to another.', 'Writes a table of data to a text file.', 'Allows you to add a new row of values to a Data Table, even if the table contains values.'),
  (4, 'What is the command used to export an asset to use in the script?', 'Export Asset', 'Write to File', 'Import File', 'Move File', 'Export Asset'),
  (4, 'What are the asset options available in WDG Automation Studio?', 'Audio, Subroutines, and Commands.', 'Variables, Subroutines, and Commands.', 'File, Audio, Image, Web Service, and Grammar.', 'File, Variables, Subroutines, and Commands.', 'File, Audio, Image, Web Service, and Grammar.'),
  (4, 'What command is used to terminate the database connection?', 'Run SQL Command', 'SQLite Connection', 'Connect to SQL Server', 'Terminate SQL Connection', 'Terminate SQL Connection'),
  (4, 'What are parameters within the WDG Automation context?', 'They are Text type variables defined in the Web Client.', 'These are variables defined in WDG Automation Studio.', 'These are subroutines defined in WDG Automation Studio.', 'These are assets imported into WDG Automation Studio.', 'They are Text type variables defined in the Web Client.')
  (5, 'What is the cloud for the enterprise?', 'A weather forecasting system.', 'A cloud-shaped office building.', 'A simpler way to centrally manage billing...', 'A painting technique.', 'A simpler way to centrally manage billing...'),
  (5, 'What does the cloud for the enterprise provide?', 'Wedding planning services.', 'Consumer applications, Enterprise adoption, Delivery models...', 'A book club subscription.', 'Interior design ideas.', 'Consumer applications, Enterprise adoption, Delivery models...'),
  (5, 'What can you create within the cloud enterprise?', 'Sculptures and paintings.', 'A multi-tiered hierarchy of accounts...', 'A new dance form.', 'A travel itinerary.', 'A multi-tiered hierarchy of accounts...');
  (5, 'What does IBM Cloud offer?', 'A platform with basic AI tools', 'A platform for public, private, and hybrid environments', 'A platform only for public cloud environments', 'Specialized services for blockchain development', 'A platform for public, private, and hybrid environments'),
  (5, 'What are the benefits of Cloud Computing mentioned in the text?', 'Quick application deployment', 'Dependence on physical infrastructure', 'Limited scalability', 'Enhanced data security and compliance', 'Quick application deployment'),
  (5, 'What knowledge does the "Journey to Cloud: Envisioning Your Solution" credential demonstrate?', 'Development of software programs', 'Understanding of traditional IT infrastructure', 'Understanding of digital transformation drivers made possible by cloud technologies and services', 'Expertise in cloud service management', 'Understanding of digital transformation drivers made possible by cloud technologies and services'),
  (5, 'How is Cloud Computing contributing to business innovation?', 'By relying solely on traditional IT infrastructure', 'By limiting access to the latest technology', 'By serving as the foundation for business innovation', 'By reducing the need for IT staff', 'By serving as the foundation for business innovation'),
  (5, 'Which course covers advanced concepts related to the adoption of Cloud Computing within the enterprise?', 'Cloud Computing Fundamentals', 'DevOps for Enterprise Business Agility', 'Journey to Cloud: Orchestrating Your Solution', 'Cloud Security Best Practices', 'Journey to Cloud: Orchestrating Your Solution'),
  (5, 'What does the "Journey to Cloud: Transforming Your Culture" course focus on?', 'Traditional IT infrastructure models', 'Cultural transformation in the context of cloud adoption', 'Cloud infrastructure maintenance techniques', 'Strategic leadership and decision-making', 'Cultural transformation in the context of cloud adoption'),
  (5, 'Which topic is covered in the course "DevOps for Enterprise Business Agility"?', 'DevOps, agile culture, and pipelines', 'Traditional IT infrastructure management', 'Agile software development practices', 'Advanced project management methodologies', 'DevOps, agile culture, and pipelines'),
  (5, 'What is the strategic value of Cloud Computing according to the text?', 'Competitive advantage by providing innovative technology', 'Increased infrastructure maintenance costs', 'Limited access to technology', 'Streamlining business operations', 'Competitive advantage by providing innovative technology'),
  (5, 'What does the course "Journey to Cloud: Orchestrating Your Solution" aim to assist individuals with?', 'Understanding of software development practices', 'Understanding of basic IT concepts', 'Understanding of advanced cloud computing concepts within the enterprise', 'Implementation of cloud-based solutions across industries', 'Understanding of advanced cloud computing concepts within the enterprise'),
  (5, 'How can users benefit from Cloud Computing in terms of efficiency?', 'Fast application deployment without worrying about underlying infrastructure costs or maintenance', 'Increased infrastructure maintenance costs', 'Slow application deployment', 'Access to a global network of data centres', 'Fast application deployment without worrying about underlying infrastructure costs or maintenance');
  (6, 'What does IBM Engineering Lifecycle Management (ELM) cover in the engineering lifecycle?', 'All of the above', 'Only system and software modelling', 'Only requirements management', 'Only workflow management', 'All of the above'),
  (6, 'How does IBM Engineering utilize artificial intelligence (AI) and analytics in the development process?', 'To ignore industry standards', 'To limit access to data', 'To slow down the development process', 'To hinder team collaboration', 'To hinder team collaboration'),
  (6, 'In which industries is IBM Engineering commonly used?', 'Retail', 'Food and beverage', 'Aerospace and Defense (A&D), automotive, medical devices, and financial services markets', 'Technology startups', 'Aerospace and Defense (A&D), automotive, medical devices, and financial services markets'),
  (6, 'Which of the following is a key feature of IBM Engineering Lifecycle Management?', 'Limited traceability of requirements', 'Lack of support for industry standards', 'Full lifecycle traceability of all requirements, design and test data', 'Constantly changing team development', 'Full lifecycle traceability of all requirements, design and test data'),
  (6, 'How does IBM Engineering support continuous improvement?', 'By promoting best practices automation', 'By isolating data analysis', 'By avoiding change impact assessment', 'By discouraging automation', 'By promoting best practices automation'),
  (6, 'What is the purpose of enabling extensibility through open standards such as OSLC in IBM Engineering?', 'To support integration with other solutions', 'To hinder customization', 'To restrict data access', 'To limit reporting capabilities', 'To support integration with other solutions'),
  (6, 'Which aspect of development does IBM Engineering focus on optimizing early in the process?', 'Design and architectures', 'Testing phase', 'Requirements gathering', 'Post-launch feedback', 'Design and architectures'),
  (6, 'What is a benefit of using IBM Engineering for managing the development lifecycle?', 'Full change impact assessment and management from requirements through testing', 'Limited customization options', 'Reduced collaboration opportunities', 'Lack of decision-making resources', 'Full change impact assessment and management from requirements through testing'),
  (6, 'How does IBM Engineering promote team collaboration?', 'By ignoring industry standards and regulatory requirements', 'By supporting implementation of industry standards and regulatory requirements into the development process', 'By enabling customizable reporting and dashboards', 'By not supporting geographically distributed teams', 'By supporting implementation of industry standards and regulatory requirements into the development process'),
  (6, 'In which areas does IBM Engineering use AI to enhance the development process?', 'Visual modelling only', 'All of the above', 'Simulation and testing only', 'Reporting and dashboards only', 'All of the above');
  (7, 'What is IBM threat intelligence and hunting?', 'A video game developed by IBM.', 'A proactive approach to identifying previously unknown threats...', 'A hunting club sponsored by IBM.', 'A documentary series.', 'A proactive approach to identifying previously unknown threats...'),
  (7, 'What does the IBM threat and intelligence course expose the learner to?', 'Wilderness survival skills.', 'Musical instruments.', 'Attack trends by geography, threat intelligence tools...', 'Documentary filmmaking techniques.', 'Attack trends by geography, threat intelligence tools...'),
  (10, 'What is the main goal of Red Hat Academy?', 'To provide no-cost access to Red Hat Training curriculum', 'To provide a generic distribution-agnostic Linux curriculum', 'To provide paid access to Red Hat Training Curriculum', 'To facilitate industry certifications in IT security', 'To provide no-cost access to Red Hat Training curriculum'),
  (10, 'Which technology is the Red Hat Academy curriculum based on?', 'Ubuntu Linux', 'Windows Server', 'Red Hat Enterprise Linux', 'Cloud Computing Essentials', 'Red Hat Enterprise Linux'),
  (11, 'What has transformed quantum computing from theory to reality over the past 50 years?', 'Mathematical, materials science and computer science advances', 'Advances in electronics', 'Progress in quantum physics', 'Developments in computer networks', 'Mathematical, materials science and computer science advances'),
  (11, 'How can real quantum computers be accessed today?', 'By purchasing a specific device', 'Through physical laboratories only', 'Through the cloud', 'Only by quantum physicists', 'Through the cloud'),
  (11, 'What disciplines could benefit from breakthroughs provided by quantum computers?', 'Forestry and wildlife conservation', 'Materials and drug discovery, complex systems optimization, and artificial intelligence', 'Agriculture and farming', 'Space exploration', 'Materials and drug discovery, complex systems optimization, and artificial intelligence'),
  (11, 'Why is it important to reimagine information processing when it comes to quantum computing?', 'To make computers more affordable', 'To make quantum computers widely useable and accessible', 'To ensure high security in data transmission', 'To make computers faster', 'To make quantum computers widely useable and accessible'),
  (11, 'What problem cant be solved on a classical computer according to the context?', 'Determining basic arithmetic calculations', 'Challenges above a certain size and complexity', 'Solving simple logic puzzles', 'Achieving faster internet speeds', 'Challenges above a certain size and complexity'),
  (11, 'Why do we need a new kind of computing for solving complex problems?', 'To have exponential computational power that scales with system size growth', 'To reduce energy consumption', 'To increase data storage capacities', 'To make computers more user-friendly', 'To have exponential computational power that scales with system size growth'),
  (11, 'How does the computational power of the new kind of computing scale?', 'Logarithmically', 'Linearly', 'Exponentially', 'Quadratically', 'Exponentially'),
  (11, 'Which field could potentially benefit the most from quantum computing breakthroughs?', 'Nanotechnology', 'Materials science', 'Healthcare industry', 'Electrical engineering', 'Materials science'),
  (11, 'What is a potential limitation of current classical computer systems mentioned in the text?', 'Lack of software updates', 'Slow processing speeds', 'Inadequate computational power for complex problems', 'Limited memory storage', 'Inadequate computational power for complex problems'),
  (11, 'What is required to make quantum computers widely useable and accessible according to the text?', 'Better cooling systems', 'Reimagining information processing and the machines that do it', 'Enhanced data security measures', 'Lower production costs', 'Reimagining information processing and the machines that do it');