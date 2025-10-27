-- Script para insertar proveedores y relacionarlos con productos
-- Ejecutar DESPUÉS de haber insertado los productos

-- ============================================
-- INSERTAR PROVEEDORES
-- ============================================

-- Proveedores de Deportes
INSERT INTO proveedor (nombre, contacto_nombre, contacto_email, telefono, direccion, estado, cantidad_productos) VALUES
('Nike Argentina S.A.', 'Juan Pérez', 'jperez@nike.com.ar', '011-4555-1234', 'Av. Libertador 5500, CABA', true, 0),
('Adidas Deportes', 'María González', 'mgonzalez@adidas.com.ar', '011-4555-5678', 'Av. Cabildo 2600, CABA', true, 0),
('Puma Sports Argentina', 'Carlos Rodríguez', 'crodriguez@puma.com.ar', '011-4555-9012', 'Av. Santa Fe 3200, CABA', true, 0);

-- Proveedores de Tecnología (Celulares y Notebooks)
INSERT INTO proveedor (nombre, contacto_nombre, contacto_email, telefono, direccion, estado, cantidad_productos) VALUES
('Samsung Electronics', 'Laura Martínez', 'lmartinez@samsung.com.ar', '011-5200-8000', 'Av. del Libertador 110, Vicente López', true, 0),
('Apple Argentina', 'Roberto Sánchez', 'rsanchez@apple.com', '0800-222-7753', 'Olga Cossettini 1661, CABA', true, 0),
('Xiaomi Official Store', 'Ana López', 'alopez@xiaomi.com.ar', '011-4800-0100', 'Av. Córdoba 5100, CABA', true, 0),
('Motorola Argentina', 'Diego Fernández', 'dfernandez@motorola.com.ar', '0800-666-6686', 'Bouchard 547, CABA', true, 0),
('Lenovo Argentina', 'Patricia Gómez', 'pgomez@lenovo.com.ar', '0800-444-5366', 'Av. Corrientes 880, CABA', true, 0),
('HP Argentina', 'Martín Silva', 'msilva@hp.com.ar', '0800-555-4772', 'Av. Leandro N. Alem 855, CABA', true, 0),
('Dell Computadoras', 'Sofía Romero', 'sromero@dell.com.ar', '0800-222-3355', 'Cerrito 740, CABA', true, 0);

-- Proveedores de Electrodomésticos
INSERT INTO proveedor (nombre, contacto_nombre, contacto_email, telefono, direccion, estado, cantidad_productos) VALUES
('Philips Argentina', 'Gustavo Torres', 'gtorres@philips.com.ar', '0800-122-1800', 'Monroe 860, CABA', true, 0),
('Braun Electronics', 'Carolina Méndez', 'cmendez@braun.com.ar', '011-5555-2000', 'Av. del Libertador 7208, CABA', true, 0),
('Gillette Argentina', 'Fernando Castro', 'fcastro@gillette.com.ar', '0800-666-4455', 'Cecilia Grierson 255, CABA', true, 0),
('JBL Audio Argentina', 'Valeria Díaz', 'vdiaz@jbl.com.ar', '011-4700-9000', 'Av. Figueroa Alcorta 3351, CABA', true, 0),
('Sony Argentina', 'Alejandro Ruiz', 'aruiz@sony.com.ar', '0800-777-7669', 'Av. Juan B. Justo 6650, CABA', true, 0),
('Bose Argentina', 'Cecilia Morales', 'cmorales@bose.com.ar', '0800-888-2673', 'Av. Callao 1234, CABA', true, 0);

-- Proveedores de Electrodomésticos Grandes (Lavarropas)
INSERT INTO proveedor (nombre, contacto_nombre, contacto_email, telefono, direccion, estado, cantidad_productos) VALUES
('Samsung Home Appliances', 'Ricardo Vega', 'rvega@samsung.com.ar', '0800-333-7267', 'Av. del Libertador 110, Vicente López', true, 0),
('LG Electronics', 'Gabriela Herrera', 'gherrera@lg.com.ar', '0800-999-5454', 'Av. Maipú 1300, Vicente López', true, 0),
('Drean Argentina', 'Pablo Jiménez', 'pjimenez@drean.com.ar', '0810-333-7326', 'Ruta 8 Km 61, Pilar', true, 0),
('Whirlpool Argentina', 'Natalia Flores', 'nflores@whirlpool.com.ar', '0800-222-9447', 'Av. Córdoba 5100, CABA', true, 0);

-- Proveedores de Accesorios
INSERT INTO proveedor (nombre, contacto_nombre, contacto_email, telefono, direccion, estado, cantidad_productos) VALUES
('Logitech Argentina', 'Cristian Pereyra', 'cpereyra@logitech.com.ar', '0800-888-5644', 'Av. Corrientes 1234, CABA', true, 0),
('Wilson Sports', 'Mariela Ramírez', 'mramirez@wilson.com.ar', '011-4444-8800', 'Av. Rivadavia 5000, CABA', true, 0),
('Converse Argentina', 'Lucas Vargas', 'lvargas@converse.com.ar', '011-5555-9900', 'Av. Santa Fe 1860, CABA', true, 0),
('Columbia Sportswear', 'Andrea Ortiz', 'aortiz@columbia.com.ar', '011-4777-3300', 'Av. Cabildo 3000, CABA', true, 0),
('Remington Argentina', 'Jorge Benítez', 'jbenitez@remington.com.ar', '0800-666-7364', 'Av. Corrientes 3247, CABA', true, 0),
('Nivea Argentina', 'Silvia Ponce', 'sponce@nivea.com.ar', '0800-333-6483', 'Av. del Libertador 6250, CABA', true, 0);

-- ============================================
-- RELACIONAR PRODUCTOS CON PROVEEDORES
-- ============================================

-- DEPORTIVO (Productos 1-6)
-- Zapatillas Nike Air Max -> Nike, Puma
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (1, 1), (1, 3);
-- Pelota de Fútbol Adidas -> Adidas
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (2, 2);
-- Raqueta de Tenis Wilson -> Wilson Sports
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (3, 23);
-- Bicicleta Mountain Bike -> Puma Sports
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (4, 3);
-- Pesas Hexagonales -> Adidas, Nike
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (5, 2), (5, 1);
-- Camiseta Deportiva -> Nike, Adidas
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (6, 1), (6, 2);

-- CELULARES (Productos 7-12)
-- Samsung Galaxy S24 -> Samsung Electronics
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (7, 4);
-- iPhone 15 Pro -> Apple Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (8, 5);
-- Xiaomi Redmi Note 13 -> Xiaomi Official Store
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (9, 6);
-- Motorola Edge 40 -> Motorola Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (10, 7);
-- Funda Silicona -> Samsung, Xiaomi, Motorola
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (11, 4), (11, 6), (11, 7);
-- Cargador Rápido -> Samsung, Xiaomi
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (12, 4), (12, 6);

-- CALZADO DEPORTIVO (Productos 13-18)
-- Zapatillas Puma Running -> Puma Sports
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (13, 3);
-- Botines Adidas Predator -> Adidas
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (14, 2);
-- Ojotas Nike Benassi -> Nike
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (15, 1);
-- Zapatillas Converse All Star -> Converse
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (16, 24);
-- Botas de Trekking Columbia -> Columbia Sportswear
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (17, 25);
-- Medias Deportivas -> Nike, Adidas, Puma
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (18, 1), (18, 2), (18, 3);

-- NOTEBOOKS (Productos 19-24)
-- Lenovo IdeaPad 3 -> Lenovo Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (19, 8);
-- HP Pavilion 15 -> HP Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (20, 9);
-- MacBook Air M2 -> Apple Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (21, 5);
-- Dell Inspiron 14 -> Dell Computadoras
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (22, 10);
-- Mouse Logitech -> Logitech Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (23, 22);
-- Mochila para Laptop -> HP, Lenovo, Dell
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (24, 9), (24, 8), (24, 10);

-- AFEITADORAS (Productos 25-30)
-- Philips OneBlade -> Philips Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (25, 11);
-- Braun Series 9 -> Braun Electronics
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (26, 12);
-- Gillette Mach3 -> Gillette Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (27, 13);
-- Remington Barba Trimmer -> Remington Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (28, 26);
-- Espuma de Afeitar Nivea -> Nivea Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (29, 27);
-- After Shave Lotion -> Nivea, Gillette
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (30, 27), (30, 13);

-- PARLANTES (Productos 31-36)
-- JBL Flip 6 -> JBL Audio
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (31, 14);
-- Sony SRS-XB43 -> Sony Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (32, 15);
-- Bose SoundLink Mini -> Bose Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (33, 16);
-- Parlante Xiaomi -> Xiaomi Official Store
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (34, 6);
-- Soundbar Samsung -> Samsung Electronics
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (35, 4);
-- Auriculares Sony -> Sony Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (36, 15);

-- LAVARROPAS (Productos 37-42)
-- Samsung 9kg -> Samsung Home Appliances
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (37, 17);
-- Drean Next 8.12 -> Drean Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (38, 19);
-- LG Inverter 10kg -> LG Electronics
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (39, 18);
-- Whirlpool Carga Superior -> Whirlpool Argentina
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (40, 20);
-- Secarropas Eslabón de Lujo -> Drean, Whirlpool
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (41, 19), (41, 20);
-- Detergente Skip -> Whirlpool, LG, Samsung
INSERT INTO producto_proveedores ("productoId", "proveedorId") VALUES (42, 20), (42, 18), (42, 17);

-- ============================================
-- ACTUALIZAR CANTIDAD DE PRODUCTOS POR PROVEEDOR
-- ============================================
UPDATE proveedor p
SET cantidad_productos = (
    SELECT COUNT(*)
    FROM producto_proveedores pp
    WHERE pp."proveedorId" = p.id
);

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================
SELECT 
    prov.nombre as proveedor,
    prov.cantidad_productos,
    prov.contacto_nombre,
    prov.contacto_email
FROM proveedor prov
ORDER BY prov.cantidad_productos DESC;

-- Ver productos con sus proveedores
SELECT 
    p.nombre as producto,
    STRING_AGG(prov.nombre, ', ') as proveedores
FROM producto p
LEFT JOIN producto_proveedores pp ON p.id = pp."productoId"
LEFT JOIN proveedor prov ON pp."proveedorId" = prov.id
GROUP BY p.id, p.nombre
ORDER BY p.id;
