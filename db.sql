CREATE DATABASE  IF NOT EXISTS `login` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `login`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: login
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `descuento`
--

DROP TABLE IF EXISTS `descuento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `descuento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `tipo_descuento` enum('porcentaje','monto') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `estado` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuento`
--

LOCK TABLES `descuento` WRITE;
/*!40000 ALTER TABLE `descuento` DISABLE KEYS */;
INSERT INTO `descuento` VALUES (1,'Oferta del mes','monto',10.00,1),(2,'Oferta de invierno','monto',50.00,0),(3,'Oferta de invierno','monto',15.00,1);
/*!40000 ALTER TABLE `descuento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sesiones`
--

DROP TABLE IF EXISTS `sesiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesiones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `fecha_expiracion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesiones`
--

LOCK TABLES `sesiones` WRITE;
/*!40000 ALTER TABLE `sesiones` DISABLE KEYS */;
INSERT INTO `sesiones` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlc3RlZmFueXQzMTAxQGdtYWlsLmNvbSIsImlhdCI6MTcwODIwNTY5NSwiZXhwIjoxNzA4MjA5Mjk1fQ.g-ZRPE_SeU9-G8DohnTR7ZPCLhpDzYvvdjCRwkoCMmg','2024-02-17 17:34:55'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlc3RlZmFueXQzMTAxQGdtYWlsLmNvbSIsImlhdCI6MTcwODIwNjA4MiwiZXhwIjoxNzA4MjA5NjgyfQ.zFIQ0AK3SOGugW6vO2sXoP8WA89gZO6oFiu32G8cbh4','2024-02-17 17:41:22'),(3,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJwZXAwN0BnbWFpbC5jb20iLCJpYXQiOjE3MDgyMDY0NTEsImV4cCI6MTcwODIxMDA1MX0.8Pwhok33ssnoTkzfCEIWgrAY7KpRGNwYsfNypppB_Ck','2024-02-17 17:47:31'),(4,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJtYXJpYTA4QGdtYWlsLmNvbSIsImlhdCI6MTcwODM0ODU1NCwiZXhwIjoxNzA4MzUyMTU0fQ.dcJJA23ZHSeL4P8ullYdlknrLbrZyxoOq2TjdoADJ8E','2024-02-19 09:15:54'),(5,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJwZXAwN0BnbWFpbC5jb20iLCJpYXQiOjE3MDgzNDg3MjQsImV4cCI6MTcwODM1MjMyNH0.QfWF0VSfvwHYzLsCGU8QzyEmkyljS8KYT_L_o4-uQX8','2024-02-19 09:18:44'),(6,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJlc3RlZnl0b3JyZXM4QGdtYWlsLmNvbSIsImlhdCI6MTcwODk2MTA1OCwiZXhwIjoxNzA4OTY0NjU4fQ.dZDOTUq6-ChrqpU1fEIFREQfdscv-peuieE-9B_RMwA','2024-02-26 11:24:18'),(7,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJwZXAwN0BnbWFpbC5jb20iLCJpYXQiOjE3MDg5NjEzNzcsImV4cCI6MTcwODk2NDk3N30.Yu9xi5sIwOcABmJoqHjs2m2st0WHvm-9eGobMNCBghU','2024-02-26 11:29:37'),(8,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ2bWNydXpyMzRAZ21haWwuY29tIiwiaWF0IjoxNzA5MTI5NDQ2LCJleHAiOjE3MDkxMzMwNDZ9.HipbT1peO-NLy_f6gDQ4MRp_Yjj-BkHPWUEWCRAb1xU','2024-02-28 10:10:46'),(9,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ2bWNydXpyMzRAZ21haWwuY29tIiwiaWF0IjoxNzA5MTMzNzAyLCJleHAiOjE3MDkxMzczMDJ9.AnwNKw0c40ykeZepANpw6qgJXK73H7snpaPuPOY5kEw','2024-02-28 11:21:42'),(10,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJ2bWNydXpyMzRAZ21haWwuY29tIiwiaWF0IjoxNzA5MTM4MDE0LCJleHAiOjE3MDkxNDE2MTR9.n4XYvX9N8V2gvuc0UHzgpYGSnBEPwG4p0idWR0LdusU','2024-02-28 12:33:34'),(11,2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJwZXAwN0BnbWFpbC5jb20iLCJpYXQiOjE3MDkyMTU5NDksImV4cCI6MTcwOTIxOTU0OX0.wl7BUBXHiqO0Gfh5pLyHVGkFCVod-uwac_eQVtj0XXA','2024-02-29 10:12:29'),(12,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlc3RlZmFueXQzMTAxQGdtYWlsLmNvbSIsImlhdCI6MTcwOTIxNjY2NywiZXhwIjoxNzA5MjIwMjY3fQ.T6yxWOQM12YsVl7-KN91HS_xOd9iA2B_1nbVQK9mzVw','2024-02-29 10:24:27');
/*!40000 ALTER TABLE `sesiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pais` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Estefany Torres','estefanyt3101@gmail.com','$2b$10$mX8KDMAa03aldrQbmK3JpObY6v0WyVZ/eerze7R2wCvemT6/eeYEm','Peru'),(2,'Pepe Lopez','pep07@gmail.com','$2b$10$WrN2N328jeFxyvezGT1KDuBjAulk0U8dET.KuSjs9nKhsOLsskOaO','Peru'),(3,'Maria Llosa','maria08@gmail.com','$2b$10$2z6wd8Wcpd/pR18QRKtuqe0yp03ZCN8pSC5aVAZ9rPidPZNw6fCeG','Peru'),(4,'Estefany Torres','estefytorres8@gmail.com','$2b$10$.WAzhodQZilYMrsNWoP5mOMt7gUVQmnfiPzJh7KsXy5BVMpgHR3/S','Peru'),(5,'Manuel Cruz','vmcruzr34@gmail.com','$2b$10$bh3feeXZXKVrDqwkxaF4ZO7y8cKoRp2iLhUtUqTsMJYHas4BBk.82','Peru');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-29  9:37:20
