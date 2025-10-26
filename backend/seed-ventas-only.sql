-- Script para insertar SOLO VENTAS (las facturas se crean automáticamente por el backend)
-- Ejecutar DESPUÉS de haber insertado productos y proveedores
-- IMPORTANTE: Ajustar el usuario_id=1 si tu usuario admin tiene otro ID

-- ============================================
-- VENTAS DEL MES ACTUAL (Octubre 2025)
-- ============================================

-- Venta 1: Cliente compra celular Samsung y accesorios
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-20', 873500.00, 'Cliente pagó con tarjeta de crédito en 12 cuotas', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 7), (currval('venta_id_seq'), 11), (currval('venta_id_seq'), 12);

-- Venta 2: Cliente compra zapatillas deportivas
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-19', 125000.00, 'Pagó en efectivo', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 1);

-- Venta 3: Cliente compra notebook Lenovo y accesorios
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-18', 703000.00, 'Cliente empresario, factura A', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 19), (currval('venta_id_seq'), 23), (currval('venta_id_seq'), 24);

-- Venta 4: Cliente compra parlante JBL
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-17', 95000.00, 'Regalo de cumpleaños', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 31);

-- Venta 5: Cliente compra iPhone y accesorios
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-15', 1223500.00, 'Venta de alto valor, cliente VIP', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 8), (currval('venta_id_seq'), 11), (currval('venta_id_seq'), 12);

-- Venta 6: Cliente compra lavarropas Samsung
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-14', 580000.00, 'Incluye instalación gratuita', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 37);

-- Venta 7: Cliente compra múltiples productos deportivos
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-12', 208000.00, 'Club deportivo, compra por mayor', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 2), (currval('venta_id_seq'), 6), (currval('venta_id_seq'), 18);

-- Venta 8: Cliente compra MacBook Air
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-10', 1400000.00, 'Diseñador gráfico freelance', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 21);

-- Venta 9: Cliente compra productos de afeitado
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-08', 53500.00, 'Pack de regalo para el día del padre', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 25), (currval('venta_id_seq'), 29);

-- Venta 10: Cliente compra bicicleta mountain bike
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-10-05', 450000.00, 'Incluye casco y luces de regalo', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 4);

-- ============================================
-- VENTAS DE SEPTIEMBRE 2025
-- ============================================

-- Venta 11: Cliente compra Xiaomi Redmi
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-28', 288500.00, 'Primera compra del cliente', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 9), (currval('venta_id_seq'), 11);

-- Venta 12: Cliente compra notebook HP y mouse
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-25', 868000.00, 'Estudiante universitario', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 20), (currval('venta_id_seq'), 23);

-- Venta 13: Cliente compra zapatillas Puma y medias
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-22', 107000.00, 'Runner profesional', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 13), (currval('venta_id_seq'), 18);

-- Venta 14: Cliente compra lavarropas LG
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-20', 720000.00, 'Renovación de electrodoméstico', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 39);

-- Venta 15: Cliente compra soundbar Samsung y auriculares Sony
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-18', 570000.00, 'Home cinema setup', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 35), (currval('venta_id_seq'), 36);

-- Venta 16: Cliente compra Motorola Edge
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-15', 420000.00, 'Cambio de celular', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 10);

-- Venta 17: Cliente compra Dell Inspiron y mochila
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-12', 1015000.00, 'Profesional IT', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 22), (currval('venta_id_seq'), 24);

-- Venta 18: Cliente compra botines Adidas
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-10', 110000.00, 'Temporada de fútbol', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 14);

-- Venta 19: Cliente compra afeitadora Braun
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-08', 180000.00, 'Regalo empresarial', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 26);

-- Venta 20: Cliente compra parlante Sony
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-09-05', 150000.00, 'Para eventos', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 32);

-- ============================================
-- VENTAS DE AGOSTO 2025
-- ============================================

-- Venta 21: Cliente compra Converse All Star
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-28', 65000.00, 'Estilo casual', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 16);

-- Venta 22: Cliente compra lavarropas Drean
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-25', 450000.00, 'Primer electrodoméstico nuevo hogar', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 38);

-- Venta 23: Cliente compra raqueta Wilson y pelota
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-22', 134000.00, 'Principiante en tenis', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 3), (currval('venta_id_seq'), 2);

-- Venta 24: Cliente compra pesas hexagonales
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-20', 35000.00, 'Gimnasio en casa', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 5);

-- Venta 25: Cliente compra parlante Bose
INSERT INTO venta (fecha, importe_total, notas, usuario_id) 
VALUES ('2025-08-18', 180000.00, 'Calidad premium para audiófilos', 1);
INSERT INTO venta_producto ("ventaId", "productoId") VALUES (currval('venta_id_seq'), 33);

-- ============================================
-- ACTUALIZAR STOCK DE PRODUCTOS
-- ============================================

UPDATE producto SET stock = stock - 1 WHERE id = 1;
UPDATE producto SET stock = stock - 2 WHERE id = 2;
UPDATE producto SET stock = stock - 1 WHERE id = 3;
UPDATE producto SET stock = stock - 1 WHERE id = 4;
UPDATE producto SET stock = stock - 1 WHERE id = 5;
UPDATE producto SET stock = stock - 1 WHERE id = 6;
UPDATE producto SET stock = stock - 1 WHERE id = 7;
UPDATE producto SET stock = stock - 1 WHERE id = 8;
UPDATE producto SET stock = stock - 1 WHERE id = 9;
UPDATE producto SET stock = stock - 1 WHERE id = 10;
UPDATE producto SET stock = stock - 3 WHERE id = 11;
UPDATE producto SET stock = stock - 2 WHERE id = 12;
UPDATE producto SET stock = stock - 1 WHERE id = 13;
UPDATE producto SET stock = stock - 1 WHERE id = 14;
UPDATE producto SET stock = stock - 1 WHERE id = 16;
UPDATE producto SET stock = stock - 2 WHERE id = 18;
UPDATE producto SET stock = stock - 1 WHERE id = 19;
UPDATE producto SET stock = stock - 1 WHERE id = 20;
UPDATE producto SET stock = stock - 1 WHERE id = 21;
UPDATE producto SET stock = stock - 1 WHERE id = 22;
UPDATE producto SET stock = stock - 2 WHERE id = 23;
UPDATE producto SET stock = stock - 2 WHERE id = 24;
UPDATE producto SET stock = stock - 1 WHERE id = 25;
UPDATE producto SET stock = stock - 1 WHERE id = 26;
UPDATE producto SET stock = stock - 1 WHERE id = 29;
UPDATE producto SET stock = stock - 1 WHERE id = 31;
UPDATE producto SET stock = stock - 1 WHERE id = 32;
UPDATE producto SET stock = stock - 1 WHERE id = 33;
UPDATE producto SET stock = stock - 1 WHERE id = 35;
UPDATE producto SET stock = stock - 1 WHERE id = 36;
UPDATE producto SET stock = stock - 1 WHERE id = 37;
UPDATE producto SET stock = stock - 1 WHERE id = 38;
UPDATE producto SET stock = stock - 1 WHERE id = 39;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 
    TO_CHAR(fecha, 'YYYY-MM') as mes,
    COUNT(*) as cantidad_ventas,
    SUM(importe_total) as total_vendido
FROM venta
GROUP BY TO_CHAR(fecha, 'YYYY-MM')
ORDER BY mes DESC;

SELECT 
    v.id,
    v.fecha,
    v.importe_total,
    u.nombre as vendedor,
    COUNT(vp."productoId") as cantidad_productos
FROM venta v
LEFT JOIN users u ON u.id = v.usuario_id
LEFT JOIN venta_producto vp ON vp."ventaId" = v.id
GROUP BY v.id, v.fecha, v.importe_total, u.nombre
ORDER BY v.fecha DESC;

SELECT 
    p.nombre,
    COUNT(vp."ventaId") as veces_vendido,
    SUM(p.precio) as total_recaudado
FROM producto p
INNER JOIN venta_producto vp ON p.id = vp."productoId"
GROUP BY p.id, p.nombre
ORDER BY veces_vendido DESC
LIMIT 10;
