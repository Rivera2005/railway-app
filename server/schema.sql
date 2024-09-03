DROP TABLE IF EXISTS cuenta;
DROP TABLE IF EXISTS video_categoria;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuario;

CREATE TABLE `usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `primer_nombre` VARCHAR(50) DEFAULT NULL,
  `segundo_nombre` VARCHAR(50) DEFAULT NULL,
  `primer_apellido` VARCHAR(50) DEFAULT NULL,
  `segundo_apellido` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cuenta` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` INT(11) NOT NULL UNIQUE,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `cuenta_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `categorias` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `videos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `url_video` VARCHAR(255) NOT NULL,
  `url_imagen` VARCHAR(255) DEFAULT NULL,
  `sinopsis` TEXT DEFAULT NULL,
  `fecha_subida` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `video_categoria` (
  `video_id` INT(11) NOT NULL,
  `categoria_id` INT(11) NOT NULL,
  PRIMARY KEY (`video_id`, `categoria_id`),
  FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar categorías
INSERT INTO `categorias` (`nombre`, `descripcion`)
VALUES ('Animación', 'Películas animadas para todas las edades.'),
       ('Familiar', 'Películas apropiadas para toda la familia.');

-- Insertar un video
INSERT INTO `videos` (`nombre`, `url_video`, `url_imagen`, `sinopsis`, `fecha_subida`)
VALUES (
  'Intensamente 2',
  'https://streamingfwa.s3.amazonaws.com/IntensaMente+2+-+Tr%C3%A1iler+Final+-+Doblado.mp4',
  'https://cdn.forbes.com.mx/2024/06/Intensamente-2-640x360.webp',
  'En “Intensamente 2”, seguimos las aventuras de Riley y sus emociones mientras se enfrentan a nuevos desafíos. Riley, ahora un adolescente, experimenta una montaña rusa emocional mientras navega por el complicado mundo de la secundaria y la amistad.',
  NOW()
);

-- Relacionar el video con las categorías
INSERT INTO `video_categoria` (`video_id`, `categoria_id`)
VALUES 
  (1, 1), -- Animación
  (1, 2); -- Familiar
