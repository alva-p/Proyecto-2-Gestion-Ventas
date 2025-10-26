-- Script para insertar SOLO usuarios y ventas distribuidas
-- Ejecutar DESPUÉS de haber insertado productos y proveedores
-- Los productos y proveedores ya deben estar en la base de datos

-- ============================================
-- PASO 1: CREAR USUARIOS (usando rol admin existente)
-- ============================================

-- Nota: Las contraseñas están hasheadas con bcrypt (password: "vendedor123")
-- Hash bcrypt de "vendedor123": $2b$10$rX8P9vKZ4sH3J2nL5wQ6eOYqGZxH4vN7mP2kF8wE6xS4tY9uA1zRi

INSERT INTO users (nombre, telefono, correo, contrasena, activo, rol_id) VALUES
('María González', '11-2234-5678', 'maria.gonzalez@buyapp.com', '$2b$10$rX8P9vKZ4sH3J2nL5wQ6eOYqGZxH4vN7mP2kF8wE6xS4tY9uA1zRi', true, (SELECT id FROM roles WHERE nombre = 'admin')),
('Carlos Rodríguez', '11-3345-6789', 'carlos.rodriguez@buyapp.com', '$2b$10$rX8P9vKZ4sH3J2nL5wQ6eOYqGZxH4vN7mP2kF8wE6xS4tY9uA1zRi', true, (SELECT id FROM roles WHERE nombre = 'admin')),
('Ana Martínez', '11-4456-7890', 'ana.martinez@buyapp.com', '$2b$10$rX8P9vKZ4sH3J2nL5wQ6eOYqGZxH4vN7mP2kF8wE6xS4tY9uA1zRi', true, (SELECT id FROM roles WHERE nombre = 'admin')),
('Luis Fernández', '11-5567-8901', 'luis.fernandez@buyapp.com', '$2b$10$rX8P9vKZ4sH3J2nL5wQ6eOYqGZxH4vN7mP2kF8wE6xS4tY9uA1zRi', true, (SELECT id FROM roles WHERE nombre = 'admin')),
('Patricia López', '11-6678-9012', 'patricia.lopez@buyapp.com', '$2b$10$rX8P9vKZ4sH3J2nL5wQ6eOYqGZxH4vN7mP2kF8wE6xS4tY9uA1zRi', true, (SELECT id FROM roles WHERE nombre = 'admin'));

-- ============================================
-- PASO 2: VENTAS DE OCTUBRE 2025
-- ============================================

-- Venta 1: María González - Celular Samsung y accesorios (20 Oct, 10:30 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-20 10:30:00', 873500.00, 'Cliente pagó con tarjeta de crédito en 12 cuotas', 
  (SELECT id FROM users WHERE correo = 'maria.gonzalez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 7), (currval('venta_id_seq'), 11), (currval('venta_id_seq'), 12);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'María Rodríguez', '27-35678901-4', 'B', '2025-10-20', currval('venta_id_seq')
);

-- Venta 2: Carlos Rodríguez - Zapatillas deportivas (19 Oct, 3:45 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-19 15:45:00', 125000.00, 'Pagó en efectivo', 
  (SELECT id FROM users WHERE correo = 'carlos.rodriguez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 1);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Roberto Gómez', '20-28456789-3', 'C', '2025-10-19', currval('venta_id_seq')
);

-- Venta 3: Ana Martínez - Notebook Lenovo y accesorios (18 Oct, 11:15 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-18 11:15:00', 703000.00, 'Cliente empresario, factura A', 
  (SELECT id FROM users WHERE correo = 'ana.martinez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 19), (currval('venta_id_seq'), 23), (currval('venta_id_seq'), 24);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'TechCorp S.A.', '30-71234567-8', 'A', '2025-10-18', currval('venta_id_seq')
);

-- Venta 4: Luis Fernández - Parlante JBL (17 Oct, 2:20 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-17 14:20:00', 95000.00, 'Regalo de cumpleaños', 
  (SELECT id FROM users WHERE correo = 'luis.fernandez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 31);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Laura Fernández', '27-40123456-7', 'B', '2025-10-17', currval('venta_id_seq')
);

-- Venta 5: Patricia López - iPhone y accesorios (15 Oct, 4:00 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-15 16:00:00', 1223500.00, 'Venta de alto valor, cliente VIP', 
  (SELECT id FROM users WHERE correo = 'patricia.lopez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 8), (currval('venta_id_seq'), 11), (currval('venta_id_seq'), 12);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Javier Martínez', '20-33456789-2', 'B', '2025-10-15', currval('venta_id_seq')
);

-- Venta 6: María González - Lavarropas Samsung (14 Oct, 9:30 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-14 09:30:00', 580000.00, 'Incluye instalación gratuita', 
  (SELECT id FROM users WHERE correo = 'maria.gonzalez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 37);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Carolina Pérez', '27-29876543-5', 'C', '2025-10-14', currval('venta_id_seq')
);

-- Venta 7: Carlos Rodríguez - Productos deportivos (12 Oct, 1:45 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-12 13:45:00', 208000.00, 'Club deportivo, compra por mayor', 
  (SELECT id FROM users WHERE correo = 'carlos.rodriguez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 2), (currval('venta_id_seq'), 6), (currval('venta_id_seq'), 18);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Club Atlético River', '30-54321098-7', 'A', '2025-10-12', currval('venta_id_seq')
);

-- Venta 8: Ana Martínez - MacBook Air (10 Oct, 10:00 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-10 10:00:00', 1400000.00, 'Diseñador gráfico freelance', 
  (SELECT id FROM users WHERE correo = 'ana.martinez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 21);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Martín López', '20-31234567-4', 'B', '2025-10-10', currval('venta_id_seq')
);

-- Venta 9: Luis Fernández - Productos de afeitado (8 Oct, 5:15 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-08 17:15:00', 53500.00, 'Pack de regalo para el día del padre', 
  (SELECT id FROM users WHERE correo = 'luis.fernandez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 25), (currval('venta_id_seq'), 29);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Diego Sánchez', '20-25678901-6', 'C', '2025-10-08', currval('venta_id_seq')
);

-- Venta 10: Patricia López - Bicicleta (5 Oct, 11:30 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-05 11:30:00', 450000.00, 'Incluye casco y luces de regalo', 
  (SELECT id FROM users WHERE correo = 'patricia.lopez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 4);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Andrea Silva', '27-38765432-1', 'B', '2025-10-05', currval('venta_id_seq')
);

-- Venta 11: María González - Productos varios (3 Oct, 3:20 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-03 15:20:00', 215000.00, 'Cliente frecuente, descuento aplicado', 
  (SELECT id FROM users WHERE correo = 'maria.gonzalez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 15), (currval('venta_id_seq'), 28);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Gabriela Torres', '27-42345678-9', 'C', '2025-10-03', currval('venta_id_seq')
);

-- Venta 12: Carlos Rodríguez - Botas trekking (1 Oct, 12:00 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-01 12:00:00', 85000.00, 'Temporada de camping', 
  (SELECT id FROM users WHERE correo = 'carlos.rodriguez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 17);
INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
VALUES (
  'FAC-' || LPAD(COALESCE((SELECT MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)) FROM factura), 0) + 1::text, 6, '0'),
  'Pablo Ramírez', '20-37654321-8', 'B', '2025-10-01', currval('venta_id_seq')
);

-- ============================================
-- PASO 3: VENTAS DE SEPTIEMBRE 2025
-- ============================================

-- Venta 13: Ana Martínez - Xiaomi Redmi (28 Sep, 4:30 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-28 16:30:00', 288500.00, 'Primera compra del cliente', 
  (SELECT id FROM users WHERE correo = 'ana.martinez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 9), (currval('venta_id_seq'), 11);

-- Venta 14: Luis Fernández - Notebook HP (25 Sep, 10:45 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-25 10:45:00', 868000.00, 'Estudiante universitario', 
  (SELECT id FROM users WHERE correo = 'luis.fernandez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 20), (currval('venta_id_seq'), 23);

-- Venta 15: Patricia López - Zapatillas Puma (22 Sep, 2:15 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-22 14:15:00', 107000.00, 'Runner profesional', 
  (SELECT id FROM users WHERE correo = 'patricia.lopez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 13), (currval('venta_id_seq'), 18);

-- Venta 16: María González - Lavarropas LG (20 Sep, 9:00 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-20 09:00:00', 720000.00, 'Renovación de electrodoméstico', 
  (SELECT id FROM users WHERE correo = 'maria.gonzalez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 39);

-- Venta 17: Carlos Rodríguez - Soundbar y auriculares (18 Sep, 5:00 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-18 17:00:00', 570000.00, 'Home cinema setup', 
  (SELECT id FROM users WHERE correo = 'carlos.rodriguez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 35), (currval('venta_id_seq'), 36);

-- Venta 18: Ana Martínez - Motorola Edge (15 Sep, 11:30 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-15 11:30:00', 420000.00, 'Cambio de celular', 
  (SELECT id FROM users WHERE correo = 'ana.martinez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 10);

-- Venta 19: Luis Fernández - Dell Inspiron (12 Sep, 3:45 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-12 15:45:00', 1015000.00, 'Profesional IT', 
  (SELECT id FROM users WHERE correo = 'luis.fernandez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 22), (currval('venta_id_seq'), 24);

-- Venta 20: Patricia López - Botines Adidas (10 Sep, 1:00 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-10 13:00:00', 110000.00, 'Temporada de fútbol', 
  (SELECT id FROM users WHERE correo = 'patricia.lopez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 14);

-- Venta 21: María González - Afeitadora Braun (8 Sep, 10:15 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-08 10:15:00', 180000.00, 'Regalo empresarial', 
  (SELECT id FROM users WHERE correo = 'maria.gonzalez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 26);

-- Venta 22: Carlos Rodríguez - Parlante Sony (5 Sep, 4:20 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-05 16:20:00', 150000.00, 'Para eventos', 
  (SELECT id FROM users WHERE correo = 'carlos.rodriguez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 32);

-- Venta 23: Ana Martínez - Gillette + accesorios (3 Sep, 11:45 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-03 11:45:00', 35500.00, 'Compra mensual', 
  (SELECT id FROM users WHERE correo = 'ana.martinez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 27), (currval('venta_id_seq'), 30);

-- Venta 24: Luis Fernández - Parlante Xiaomi (1 Sep, 2:30 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-01 14:30:00', 45000.00, 'Precio promocional', 
  (SELECT id FROM users WHERE correo = 'luis.fernandez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 34);

-- ============================================
-- PASO 4: VENTAS DE AGOSTO 2025
-- ============================================

-- Venta 25: Patricia López - Converse All Star (28 Ago, 3:00 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-28 15:00:00', 65000.00, 'Estilo casual', 
  (SELECT id FROM users WHERE correo = 'patricia.lopez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 16);

-- Venta 26: María González - Lavarropas Drean (25 Ago, 9:45 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-25 09:45:00', 450000.00, 'Primer electrodoméstico nuevo hogar', 
  (SELECT id FROM users WHERE correo = 'maria.gonzalez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 38);

-- Venta 27: Carlos Rodríguez - Raqueta Wilson (22 Ago, 4:15 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-22 16:15:00', 134000.00, 'Principiante en tenis', 
  (SELECT id FROM users WHERE correo = 'carlos.rodriguez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES 
  (currval('venta_id_seq'), 3), (currval('venta_id_seq'), 2);

-- Venta 28: Ana Martínez - Pesas hexagonales (20 Ago, 10:30 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-20 10:30:00', 35000.00, 'Gimnasio en casa', 
  (SELECT id FROM users WHERE correo = 'ana.martinez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 5);

-- Venta 29: Luis Fernández - Parlante Bose (18 Ago, 1:20 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-18 13:20:00', 180000.00, 'Calidad premium para audiófilos', 
  (SELECT id FROM users WHERE correo = 'luis.fernandez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 33);

-- Venta 30: Patricia López - Secarropas (15 Ago, 11:00 AM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-15 11:00:00', 320000.00, 'Complemento para lavarropas', 
  (SELECT id FROM users WHERE correo = 'patricia.lopez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 41);

-- Venta 31: María González - Whirlpool carga superior (12 Ago, 2:45 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-12 14:45:00', 385000.00, 'Reemplazo de lavarropas antiguo', 
  (SELECT id FROM users WHERE correo = 'maria.gonzalez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 40);

-- Venta 32: Carlos Rodríguez - Camiseta deportiva (10 Ago, 5:30 PM)
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-10 17:30:00', 28000.00, 'Compra rápida', 
  (SELECT id FROM users WHERE correo = 'carlos.rodriguez@buyapp.com'));
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 6);

-- ============================================
-- PASO 5: ACTUALIZAR STOCK DE PRODUCTOS
-- ============================================

UPDATE producto SET stock = stock - 1 WHERE id = 1;
UPDATE producto SET stock = stock - 2 WHERE id = 2;
UPDATE producto SET stock = stock - 1 WHERE id = 3;
UPDATE producto SET stock = stock - 1 WHERE id = 4;
UPDATE producto SET stock = stock - 1 WHERE id = 5;
UPDATE producto SET stock = stock - 2 WHERE id = 6;
UPDATE producto SET stock = stock - 1 WHERE id = 7;
UPDATE producto SET stock = stock - 1 WHERE id = 8;
UPDATE producto SET stock = stock - 1 WHERE id = 9;
UPDATE producto SET stock = stock - 1 WHERE id = 10;
UPDATE producto SET stock = stock - 3 WHERE id = 11;
UPDATE producto SET stock = stock - 2 WHERE id = 12;
UPDATE producto SET stock = stock - 1 WHERE id = 13;
UPDATE producto SET stock = stock - 1 WHERE id = 14;
UPDATE producto SET stock = stock - 1 WHERE id = 15;
UPDATE producto SET stock = stock - 1 WHERE id = 16;
UPDATE producto SET stock = stock - 1 WHERE id = 17;
UPDATE producto SET stock = stock - 2 WHERE id = 18;
UPDATE producto SET stock = stock - 1 WHERE id = 19;
UPDATE producto SET stock = stock - 1 WHERE id = 20;
UPDATE producto SET stock = stock - 1 WHERE id = 21;
UPDATE producto SET stock = stock - 1 WHERE id = 22;
UPDATE producto SET stock = stock - 2 WHERE id = 23;
UPDATE producto SET stock = stock - 2 WHERE id = 24;
UPDATE producto SET stock = stock - 1 WHERE id = 25;
UPDATE producto SET stock = stock - 1 WHERE id = 26;
UPDATE producto SET stock = stock - 1 WHERE id = 27;
UPDATE producto SET stock = stock - 1 WHERE id = 28;
UPDATE producto SET stock = stock - 1 WHERE id = 29;
UPDATE producto SET stock = stock - 1 WHERE id = 30;
UPDATE producto SET stock = stock - 1 WHERE id = 31;
UPDATE producto SET stock = stock - 1 WHERE id = 32;
UPDATE producto SET stock = stock - 1 WHERE id = 33;
UPDATE producto SET stock = stock - 1 WHERE id = 34;
UPDATE producto SET stock = stock - 1 WHERE id = 35;
UPDATE producto SET stock = stock - 1 WHERE id = 36;
UPDATE producto SET stock = stock - 1 WHERE id = 37;
UPDATE producto SET stock = stock - 1 WHERE id = 38;
UPDATE producto SET stock = stock - 1 WHERE id = 39;
UPDATE producto SET stock = stock - 1 WHERE id = 40;
UPDATE producto SET stock = stock - 1 WHERE id = 41;

-- ============================================
-- PASO 6: VERIFICAR RESULTADOS
-- ============================================

-- Ventas por mes
SELECT 
    TO_CHAR(fecha, 'YYYY-MM') as mes,
    COUNT(*) as cantidad_ventas,
    SUM(importe_total) as total_vendido
FROM venta
GROUP BY TO_CHAR(fecha, 'YYYY-MM')
ORDER BY mes DESC;

-- Ventas por vendedor (todos los usuarios que hicieron ventas)
SELECT 
    u.nombre as vendedor,
    COUNT(v.id) as cantidad_ventas,
    SUM(v.importe_total) as total_vendido,
    AVG(v.importe_total) as promedio_venta
FROM users u
LEFT JOIN venta v ON v.usuario_id = u.id
GROUP BY u.id, u.nombre
HAVING COUNT(v.id) > 0
ORDER BY total_vendido DESC;

-- Ventas detalladas con vendedor
SELECT 
    v.id,
    TO_CHAR(v.fecha, 'DD/MM/YYYY HH24:MI') as fecha_hora,
    v.importe_total,
    u.nombre as vendedor,
    COUNT(vp."productoId") as cantidad_productos
FROM venta v
LEFT JOIN users u ON u.id = v.usuario_id
LEFT JOIN venta_producto vp ON vp."ventaId" = v.id
GROUP BY v.id, v.fecha, v.importe_total, u.nombre
ORDER BY v.fecha DESC;

-- Top 10 productos más vendidos
SELECT 
    p.nombre,
    COUNT(vp."ventaId") as veces_vendido,
    SUM(p.precio) as total_recaudado
FROM producto p
INNER JOIN venta_producto vp ON p.id = vp."productoId"
GROUP BY p.id, p.nombre
ORDER BY veces_vendido DESC
LIMIT 10;

-- Ventas por día de la semana
SELECT 
    TO_CHAR(fecha, 'Day') as dia_semana,
    COUNT(*) as cantidad_ventas,
    AVG(importe_total) as promedio_venta
FROM venta
GROUP BY TO_CHAR(fecha, 'Day'), EXTRACT(DOW FROM fecha)
ORDER BY EXTRACT(DOW FROM fecha);

-- Rendimiento por hora del día
SELECT 
    EXTRACT(HOUR FROM fecha) as hora,
    COUNT(*) as cantidad_ventas,
    SUM(importe_total) as total_vendido
FROM venta
GROUP BY EXTRACT(HOUR FROM fecha)
ORDER BY hora;
