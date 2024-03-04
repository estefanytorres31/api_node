CREATE DATABASE  IF NOT EXISTS `sistema_venta` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_venta`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sistema_venta
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
  `tipo_descuento` enum('%','$') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `valor_calculado` decimal(10,2) NOT NULL,
  `estado` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuento`
--

LOCK TABLES `descuento` WRITE;
/*!40000 ALTER TABLE `descuento` DISABLE KEYS */;
INSERT INTO `descuento` VALUES (1,'Oferta de invierno','%',20.00,0.20,1),(2,'Oferta de invierno','$',40.00,40.00,1),(3,'Oferta de invierno','$',100.00,100.00,1),(4,'Oferta de invierno','$',70.00,70.00,1),(5,'Oferta de invierno','%',70.00,0.70,1),(6,'Oferta de invierno','%',70.00,0.70,1),(7,'Oferta de invierno','%',45.00,0.45,1),(8,'Oferta de invierno','%',45.00,0.45,1);
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
  `expiracion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesiones`
--

LOCK TABLES `sesiones` WRITE;
/*!40000 ALTER TABLE `sesiones` DISABLE KEYS */;
INSERT INTO `sesiones` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlc3RlZmFueXQzMTAxQGdtYWlsLmNvbSIsImlhdCI6MTcwOTU4MDI3NiwiZXhwIjoxNzA5NjY2Njc2fQ.siQvEFEpA_3x7nlqgQGPecSeHz0UCmt9UFaEgDujafI','2024-03-05 14:24:36'),(2,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJlc3QzMUBnbWFpbC5jb20iLCJpYXQiOjE3MDk1ODAzMDksImV4cCI6MTcwOTY2NjcwOX0.M4h8bt0qq6aN884VEnX6kP2ACa_SDIx_PtBCz4jfo2U','2024-03-05 14:25:09');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Estefany Torres','estefanyt3101@gmail.com','$2b$10$cQBmiREDv3ezyt2woMCFh.C071.VlwJL0QXHDzfjqvUp0.4cfrZ3q','Peru'),(2,'Pepe Lopez','pep07@gmail.com','$2b$10$WrN2N328jeFxyvezGT1KDuBjAulk0U8dET.KuSjs9nKhsOLsskOaO','Peru'),(3,'Maria Llosa','maria08@gmail.com','$2b$10$2z6wd8Wcpd/pR18QRKtuqe0yp03ZCN8pSC5aVAZ9rPidPZNw6fCeG','Peru'),(4,'Estefany Torres','estefytorres8@gmail.com','$2b$10$Tj9scwkrM5VUG5nLLKNd8OjgJwovci35mEwsejaqDqFVn9XarVvhS','Peru'),(5,'Xiomara Trujillo','xiomara@gmail.com','$2b$10$DKoyl9sesD97vBwJJg/QO.mSSurkDesUKRTYVNltyxuB.wa2SmHHu','Peru'),(6,'Estefany','estefa@gmail.com','$2b$10$lCs57NQp/eXQEMcOwnP/E.0ZxK2sRvT1x.MfEYEpT88mvkNAmKr5m','Perú'),(7,'Pepe Lopez','lola@gmail.com','$2b$10$WUR7Ukqo4XdM5CBS87RQqu4f.0jc3Bxtg635fJVKVapaqHQZKVMSy','Perú'),(8,'Estefany','holiwis@gmail.com','$2b$10$7GO6OCFQsN7DhqvV5dQw0OPGFS312smy3/bym4vga.ng9J9dM23m.','Perú'),(9,'Estefany','est31@gmail.com','$2b$10$f1i/VPq6wpnx/vYeHveM2OG9JCpy.LWOu5wOTBvB/r24rE.r5Q4Eu','Perú');
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

-- Dump completed on 2024-03-04 14:27:53
