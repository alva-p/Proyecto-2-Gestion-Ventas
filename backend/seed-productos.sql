-- Script para insertar productos de prueba
-- Asegúrate de tener proveedores creados primero

-- ============================================
-- LÍNEA 1: DEPORTIVO
-- ============================================
INSERT INTO producto (nombre, descripcion, precio, "lineaId", stock, estado) VALUES
('Zapatillas Nike Air Max', 'Zapatillas deportivas para running con tecnología Air', 125000.00, 1, 25, true),
('Pelota de Fútbol Adidas', 'Pelota oficial de fútbol número 5', 45000.00, 1, 40, true),
('Raqueta de Tenis Wilson', 'Raqueta profesional de tenis con cordaje incluido', 89000.00, 1, 15, true),
('Bicicleta Mountain Bike', 'Bicicleta todo terreno rodado 29 con suspensión', 450000.00, 1, 8, true),
('Pesas Hexagonales 10kg', 'Par de pesas hexagonales recubiertas en goma', 35000.00, 1, 30, true),
('Camiseta Deportiva Dri-Fit', 'Camiseta técnica de secado rápido', 18000.00, 1, 50, true);

-- ============================================
-- LÍNEA 2: CELULARES
-- ============================================
INSERT INTO producto (nombre, descripcion, precio, "lineaId", stock, estado) VALUES
('Samsung Galaxy S24', 'Smartphone de alta gama con cámara de 200MP', 850000.00, 2, 12, true),
('iPhone 15 Pro', 'iPhone con chip A17 Pro y cámara triple', 1200000.00, 2, 8, true),
('Xiaomi Redmi Note 13', 'Teléfono con pantalla AMOLED de 6.67 pulgadas', 280000.00, 2, 25, true),
('Motorola Edge 40', 'Celular con procesador Snapdragon y 5G', 420000.00, 2, 18, true),
('Funda Silicona Universal', 'Funda protectora de silicona para varios modelos', 8500.00, 2, 100, true),
('Cargador Rápido USB-C 65W', 'Cargador de pared con carga rápida', 15000.00, 2, 60, true);

-- ============================================
-- LÍNEA 3: CALZADO DEPORTIVO
-- ============================================
INSERT INTO producto (nombre, descripcion, precio, "lineaId", stock, estado) VALUES
('Zapatillas Puma Running', 'Zapatillas ligeras para correr con suela de gel', 95000.00, 3, 30, true),
('Botines Adidas Predator', 'Botines de fútbol con tapones para césped', 110000.00, 3, 20, true),
('Ojotas Nike Benassi', 'Sandalias deportivas para uso casual', 28000.00, 3, 45, true),
('Zapatillas Converse All Star', 'Zapatillas urbanas clásicas de lona', 65000.00, 3, 35, true),
('Botas de Trekking Columbia', 'Botas impermeables para montaña', 150000.00, 3, 12, true),
('Medias Deportivas Pack x3', 'Pack de 3 pares de medias técnicas', 12000.00, 3, 80, true);

-- ============================================
-- LÍNEA 4: NOTEBOOKS
-- ============================================
INSERT INTO producto (nombre, descripcion, precio, "lineaId", stock, estado) VALUES
('Lenovo IdeaPad 3', 'Notebook con Intel i5, 8GB RAM, 256GB SSD', 650000.00, 4, 15, true),
('HP Pavilion 15', 'Laptop con AMD Ryzen 7, 16GB RAM, 512GB SSD', 850000.00, 4, 10, true),
('MacBook Air M2', 'MacBook con chip M2, 8GB RAM, 256GB SSD', 1400000.00, 4, 5, true),
('Dell Inspiron 14', 'Notebook con Intel i7, 16GB RAM, 1TB SSD', 980000.00, 4, 8, true),
('Mouse Inalámbrico Logitech', 'Mouse ergonómico con conexión Bluetooth', 18000.00, 4, 50, true),
('Mochila para Laptop 15.6"', 'Mochila acolchada con compartimentos', 35000.00, 4, 40, true);

-- ============================================
-- LÍNEA 5: AFEITADORAS
-- ============================================
INSERT INTO producto (nombre, descripcion, precio, "lineaId", stock, estado) VALUES
('Philips OneBlade', 'Afeitadora recargable para barba y cuerpo', 45000.00, 5, 25, true),
('Braun Series 9', 'Afeitadora eléctrica premium con 5 elementos', 180000.00, 5, 10, true),
('Gillette Mach3 Turbo', 'Máquina de afeitar manual con 3 hojas', 12000.00, 5, 60, true),
('Remington Barba Trimmer', 'Recortadora de barba con guías ajustables', 38000.00, 5, 20, true),
('Espuma de Afeitar Nivea', 'Espuma hidratante para piel sensible', 6500.00, 5, 100, true),
('After Shave Lotion', 'Loción post afeitado con aloe vera', 8000.00, 5, 80, true);

-- ============================================
-- LÍNEA 6: PARLANTES
-- ============================================
INSERT INTO producto (nombre, descripcion, precio, "lineaId", stock, estado) VALUES
('JBL Flip 6', 'Parlante portátil Bluetooth resistente al agua', 95000.00, 6, 22, true),
('Sony SRS-XB43', 'Parlante con luces LED y Extra Bass', 150000.00, 6, 15, true),
('Bose SoundLink Mini', 'Parlante compacto con sonido premium', 180000.00, 6, 10, true),
('Parlante Portátil Xiaomi', 'Speaker Bluetooth económico con buena autonomía', 28000.00, 6, 40, true),
('Soundbar Samsung HW-Q60B', 'Barra de sonido 3.1 canales para TV', 250000.00, 6, 8, true),
('Auriculares Sony WH-1000XM5', 'Auriculares con cancelación de ruido', 320000.00, 6, 12, true);

-- ============================================
-- LÍNEA 7: LAVARROPAS
-- ============================================
INSERT INTO producto (nombre, descripcion, precio, "lineaId", stock, estado) VALUES
('Samsung 9kg Carga Frontal', 'Lavarropas automático con 14 programas', 580000.00, 7, 6, true),
('Drean Next 8.12', 'Lavarropas de 8kg con display digital', 450000.00, 7, 8, true),
('LG Inverter 10kg', 'Lavarropas con tecnología Inverter y vapor', 720000.00, 7, 5, true),
('Whirlpool Carga Superior 7kg', 'Lavarropas semiautomático económico', 380000.00, 7, 10, true),
('Secarropas Eslabón de Lujo', 'Secarropas por calor de 6kg de capacidad', 420000.00, 7, 7, true),
('Detergente Líquido Skip 3L', 'Detergente concentrado para 60 lavados', 15000.00, 7, 50, true);

-- Verificar inserciones
SELECT l.nombre as linea, COUNT(p.id) as cantidad_productos
FROM linea l
LEFT JOIN producto p ON p."lineaId" = l.id
GROUP BY l.id, l.nombre
ORDER BY l.id;
