
DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Animación','Películas animadas para todas las edades.'),(2,'Familiar','Películas apropiadas para toda la familia.'),(5,'Anime','Contenido relacionado con el anime y la animación japonesa.'),(6,'Deportes','Películas relacionadas con deportes y actividades físicas.');
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
INSERT INTO `video_categoria` VALUES (1,1),(1,2),(2,5),(2,6);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'Intensamente 2','https://streamingfwa.s3.amazonaws.com/IntensaMente+2+-+Tr%C3%A1iler+Final+-+Doblado.mp4','https://uchile.cl/.imaging/default/dam/imagenes/Uchile/VEXCOM/JUNIO-2024/3-Intensamente.zip/3-Intensamente/intensamente2-1-L.jpg/jcr:content.jpg','En ?Intensamente 2?, seguimos las aventuras de Riley y sus emociones mientras se enfrentan a nuevos desafíos. Riley, ahora un adolescente, experimenta una montaña rusa emocional mientras navega por el complicado mundo de la secundaria y la amistad.','2024-07-28 06:07:25'),(2,'BlueLock - Episodio 1','https://streamingfwa.s3.amazonaws.com/3701_1_tvM1.mp4','https://image.pmgstatic.com/cache/resized/w420/files/images/film/posters/166/620/166620206_957f4d.jpg','Episodio 1 de BlueLock, una emocionante historia de fútbol y competencia.','2024-07-28 07:16:21');
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

-- Dump completed on 2024-07-28  1:49:06
