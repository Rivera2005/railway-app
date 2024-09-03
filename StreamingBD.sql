-- MySQL dump 10.13  Distrib 9.0.1, for Win64 (x86_64)
--
-- Host: localhost    Database: streaming
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Animación','Películas animadas para todas las edades.'),(2,'Familiar','Películas apropiadas para toda la familia.'),(5,'Anime','Contenido relacionado con el anime y la animación japonesa.'),(6,'Deportes','Películas relacionadas con deportes y actividades físicas.'),(7,'Histórico','Películas de contenido histórico y biográfico.'),(8,'Aventura','Películas que presentan emocionantes aventuras y exploraciones.'),(9,'Acción','Películas llenas de acción y adrenalina.'),(10,'Drama','Películas que exploran temas profundos y emocionales.');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuenta`
--

DROP TABLE IF EXISTS `cuenta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuenta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `cuenta_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuenta`
--

LOCK TABLES `cuenta` WRITE;
/*!40000 ALTER TABLE `cuenta` DISABLE KEYS */;
INSERT INTO `cuenta` VALUES (1,1,'Ulis3s0012','$2a$10$BLaLOjuenXaKE/qdjC.58.06bwJOcAWAvPKQpeqP.SP.kmW31DDCm');
/*!40000 ALTER TABLE `cuenta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `primer_nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `segundo_nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `primer_apellido` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `segundo_apellido` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Ulises','Andrés ','Guzmán ','Mejía ','ulisesandres0205@gmail.com');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_categoria`
--

DROP TABLE IF EXISTS `video_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_categoria` (
  `video_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  PRIMARY KEY (`video_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `video_categoria_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_categoria_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_categoria`
--

LOCK TABLES `video_categoria` WRITE;
/*!40000 ALTER TABLE `video_categoria` DISABLE KEYS */;
INSERT INTO `video_categoria` VALUES (1,1),(4,1),(1,2),(4,2),(5,2),(2,5),(2,6),(3,7),(5,8),(6,9),(6,10);
/*!40000 ALTER TABLE `video_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `url_video` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `url_imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sinopsis` text COLLATE utf8mb4_general_ci,
  `fecha_subida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'Intensamente 2','https://streamingfwa.s3.amazonaws.com/IntensaMente+2+-+Tr%C3%A1iler+Final+-+Doblado.mp4','https://uchile.cl/.imaging/default/dam/imagenes/Uchile/VEXCOM/JUNIO-2024/3-Intensamente.zip/3-Intensamente/intensamente2-1-L.jpg/jcr:content.jpg','En ?Intensamente 2?, seguimos las aventuras de Riley y sus emociones mientras se enfrentan a nuevos desafíos. Riley, ahora un adolescente, experimenta una montaña rusa emocional mientras navega por el complicado mundo de la secundaria y la amistad.','2024-07-28 06:07:25'),(2,'BlueLock - Episodio 1','https://streamingfwa.s3.amazonaws.com/3701_1_tvM1.mp4','https://image.pmgstatic.com/cache/resized/w420/files/images/film/posters/166/620/166620206_957f4d.jpg','Episodio 1 de BlueLock, una emocionante historia de fútbol y competencia.','2024-07-28 07:16:21'),(3,'Abadesa','https://streamingfwa.s3.amazonaws.com/La+abadesa.mp4','https://www.lavanguardia.com/files/image_449_220/uploads/2024/03/12/65f0225db9f79.jpeg','Una película que narra la historia de la Abadesa y sus aventuras.','2024-07-29 06:43:50'),(4,'La Princesa y el Sapo','https://streamingfwa.s3.amazonaws.com/Princesa+y+el+sapo.mp4','https://mx.web.img3.acsta.net/pictures/20/04/22/08/36/0694727.jpg','La historia de una joven princesa que busca su destino en un mundo lleno de magia y aventuras.','2024-07-29 06:50:24'),(5,'Harry Potter y la Piedra Filosofal','https://streamingfwa.s3.amazonaws.com/246214+377c6255+b5b0+4d48+abe9+7ed5c936e3b9+awkb+2138357+filemoon+mp4.mp4','https://i.blogs.es/6ad7c1/harry-potter-piedra-filosofal/840_560.jpeg','Harry Potter descubre que es un mago y comienza su aventura en el mágico mundo de Hogwarts.','2024-07-29 06:55:53'),(6,'La Casa de Papel - Episodio 1 (Temporada 1)','https://streamingfwa.s3.amazonaws.com/casa+de+papel+1.mp4','https://cdn.milenio.com/uploads/media/2021/12/01/personajes-de-la-casa-de_0_0_1200_747.jpeg','El primer episodio de la serie \"La Casa de Papel\" sigue a un grupo de criminales que llevan a cabo un ambicioso plan de atraco a la Real Casa de la Moneda de España.','2024-07-29 07:07:07');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-29  1:21:18
