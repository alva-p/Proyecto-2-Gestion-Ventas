-- Script para crear las facturas de las ventas ya insertadas
-- Ejecutar SOLO si ya insertaste las ventas con seed-usuarios-ventas.sql

-- ============================================
-- GENERAR FACTURAS PARA TODAS LAS VENTAS
-- ============================================

-- Este script genera automáticamente una factura para cada venta que no tenga factura

DO $$
DECLARE
    venta_record RECORD;
    ultimo_numero INTEGER;
    nuevo_numero_factura VARCHAR(20);
    clientes_nombres TEXT[] := ARRAY[
        'María Rodríguez', 'Roberto Gómez', 'TechCorp S.A.', 'Laura Fernández', 'Javier Martínez',
        'Carolina Pérez', 'Club Atlético River', 'Martín López', 'Diego Sánchez', 'Andrea Silva',
        'Gabriela Torres', 'Pablo Ramírez', 'Lucía Morales', 'Fernando Castro', 'Valeria Díaz',
        'Alejandro Ruiz', 'Cecilia Torres', 'Ricardo Vega', 'Natalia Flores', 'Cristian Pereyra',
        'Mariela Ramírez', 'Lucas Vargas', 'Andrea Ortiz', 'Jorge Benítez', 'Silvia Ponce',
        'Gustavo Torres', 'Patricia Gómez', 'Martín Silva', 'Sofía Romero', 'Fernando Castro',
        'Carolina Méndez', 'Valeria Díaz'
    ];
    documentos TEXT[] := ARRAY[
        '27-35678901-4', '20-28456789-3', '30-71234567-8', '27-40123456-7', '20-33456789-2',
        '27-29876543-5', '30-54321098-7', '20-31234567-4', '20-25678901-6', '27-38765432-1',
        '27-42345678-9', '20-37654321-8', '27-36789012-3', '20-29012345-6', '27-41234567-8',
        '20-34567890-1', '27-39876543-2', '20-32109876-5', '27-43210987-6', '20-38901234-7',
        '27-37890123-4', '20-36543210-9', '27-44321098-7', '20-41234567-0', '27-40987654-3',
        '20-39876543-2', '27-45678901-2', '20-42345678-9', '27-46789012-3', '20-43456789-0',
        '27-47890123-4', '20-44567890-1'
    ];
    tipos TEXT[] := ARRAY['A', 'B', 'C'];
    contador INTEGER := 1;
BEGIN
    -- Obtener el último número de factura
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_factura FROM 5) AS INTEGER)), 0)
    INTO ultimo_numero
    FROM factura;

    -- Insertar facturas para todas las ventas sin factura
    FOR venta_record IN 
        SELECT v.id, v.fecha 
        FROM venta v
        LEFT JOIN factura f ON f.venta_id = v.id
        WHERE f.id IS NULL
        ORDER BY v.id
    LOOP
        ultimo_numero := ultimo_numero + 1;
        nuevo_numero_factura := 'FAC-' || LPAD(ultimo_numero::text, 6, '0');
        
        INSERT INTO factura (numero_factura, cliente_nombre, cliente_documento, tipo, fecha_emision, venta_id)
        VALUES (
            nuevo_numero_factura,
            clientes_nombres[MOD(contador - 1, array_length(clientes_nombres, 1)) + 1],
            documentos[MOD(contador - 1, array_length(documentos, 1)) + 1],
            tipos[MOD(contador - 1, array_length(tipos, 1)) + 1],
            venta_record.fecha::date,
            venta_record.id
        );
        
        contador := contador + 1;
    END LOOP;

    RAISE NOTICE 'Se crearon % facturas', contador - 1;
END $$;

-- Verificar que todas las ventas tengan factura
SELECT 
    COUNT(DISTINCT v.id) as total_ventas,
    COUNT(DISTINCT f.id) as total_facturas,
    COUNT(DISTINCT v.id) - COUNT(DISTINCT f.id) as ventas_sin_factura
FROM venta v
LEFT JOIN factura f ON f.venta_id = v.id;

-- Mostrar las últimas facturas creadas
SELECT 
    f.numero_factura,
    f.cliente_nombre,
    f.tipo,
    TO_CHAR(f.fecha_emision, 'DD/MM/YYYY') as fecha,
    v.importe_total,
    u.nombre as vendedor
FROM factura f
INNER JOIN venta v ON v.id = f.venta_id
INNER JOIN users u ON u.id = v.usuario_id
ORDER BY f.id DESC
LIMIT 10;
