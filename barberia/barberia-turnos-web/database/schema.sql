-- Base de datos relacional: Sistema de Turnos Barbería Burzaco
-- Autor: Joaquín Lisandro Maceiras Cami

CREATE DATABASE IF NOT EXISTS barberia_burzaco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barberia_burzaco;

-- Tabla de Usuarios (Clientes y Administrador)
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefono VARCHAR(25) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Servicios ofrecidos por el local
CREATE TABLE Servicios (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_servicio VARCHAR(80) NOT NULL,
    duracion_minutos INT NOT NULL DEFAULT 30,
    precio DECIMAL(10, 2) NOT NULL
);

-- Tabla de Turnos reservados
CREATE TABLE Turnos (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('confirmado', 'completado', 'cancelado') DEFAULT 'confirmado',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES Servicios(id_servicio) ON DELETE RESTRICT,
    UNIQUE KEY unique_fecha_hora_activa (fecha, hora, estado)
);

-- Datos iniciales de prueba
INSERT INTO Servicios (nombre_servicio, duracion_minutos, precio) VALUES
('Corte Clásico / Degradé', 30, 8000.00),
('Arreglo de Barba', 30, 5000.00),
('Corte + Barba Completo', 45, 11500.00);

INSERT INTO Usuarios (nombre, email, telefono, password_hash, rol) VALUES
('Administrador Barbería', 'admin@barberiaburzaco.com', '1155550000', '$2b$10$hashDeEjemploAdmin123456', 'admin'),
('Joaquín Maceiras', 'lichandro133546@gmail.com', '1144449999', '$2b$10$hashDeEjemploCliente7890', 'cliente');
