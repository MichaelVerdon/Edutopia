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
  `option_one` varchar(45) NOT NULL,
  `option_two` varchar(45) NOT NULL,
  `option_three` varchar(45) NOT NULL,
  `option_four` varchar(45) NOT NULL,
  `correct` varchar(45) NOT NULL,
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
INSERT INTO `topic_questions` VALUES 
(1, 'What is the main algorithm behind deep learning models?', 'Backpropagation', 'Clustering', 'Decision Trees', 'Genetic Algorithm', 'Backpropagation'),
(1, 'Which AI technique uses agents and environments?', 'Reinforcement Learning', 'Supervised Learning', 'Transfer Learning', 'Neural Networks', 'Reinforcement Learning'),
(2, 'What is the IBM capstone project?', 'A project focused on IBMs history.', 'A project that allows students to showcase their skills and knowledge...', 'A mandatory internship at IBM.','A programming competition.', 'A project that allows students to showcase their skills and knowledge...'),
(2, 'How does an IBM capstone project allow students to merge academic knowledge and showcase proficiency...', 'By giving theoretical exams.', 'By watching video lectures.', 'Students demonstrate their abilities...', 'By attending seminars.', 'Students demonstrate their abilities...'),
(3, 'What does the Enterprise-grade AI course provide?', 'A tour of IBM facilities.', 'The foundations of Artificial Intelligence for business.', 'Basic computer skills.', 'A course on digital marketing.', 'The foundations of Artificial Intelligence for business.'),
(3, 'What topics does the Enterprise-grade AI course cover?', 'Cooking recipes.', 'AI Evolution, AI Industry Adoption Trends, Natural Language Processing...', 'Astronomy and space exploration.', 'Historical events.', 'AI Evolution, AI Industry Adoption Trends, Natural Language Processing...'),
(3, 'What is Enterprise Data Science?', 'A science fiction novel series.', 'IBM Enterprise Data Science uses AI, machine learning...', 'A new programming language.', 'A database management system.', 'IBM Enterprise Data Science uses AI, machine learning...'),
(3, 'What does Enterprise Data Science provide?', 'Entertainment news.', 'A basic understanding of the foundations of Data Science.', 'A gardening guide.', 'Cooking tutorials.', 'A basic understanding of the foundations of Data Science.'),
(3, 'What topics does the Enterprise Data Science course cover?', 'Movie reviews.', 'Data Science Team Roles, Data Analysis Tools...', 'Fashion trends.', 'Automotive engineering.', 'Data Science Team Roles, Data Analysis Tools...'),
(7, 'What is IBM threat intelligence and hunting?', 'A video game developed by IBM.', 'A proactive approach to identifying previously unknown threats...', 'A hunting club sponsored by IBM.', 'A documentary series.', 'A proactive approach to identifying previously unknown threats...'),
(7, 'What does the IBM threat and intelligence course expose the learner to?', 'Wilderness survival skills.', 'Musical instruments.', 'Attack trends by geography, threat intelligence tools...', 'Documentary filmmaking techniques.', 'Attack trends by geography, threat intelligence tools...'),
(5, 'What is the cloud for the enterprise?', 'A weather forecasting system.', 'A cloud-shaped office building.', 'A simpler way to centrally manage billing...', 'A painting technique.', 'A simpler way to centrally manage billing...'),
(5, 'What does the cloud for the enterprise provide?', 'Wedding planning services.', 'Consumer applications, Enterprise adoption, Delivery models...', 'A book club subscription.', 'Interior design ideas.', 'Consumer applications, Enterprise adoption, Delivery models...'),
(5, 'What can you create within the cloud enterprise?', 'Sculptures and paintings.', 'A multi-tiered hierarchy of accounts...', 'A new dance form.', 'A travel itinerary.', 'A multi-tiered hierarchy of accounts...');

