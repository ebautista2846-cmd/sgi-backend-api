-- =============================================================
-- Sistema de Gestión de Incidentes (SGI) - Esquema de Base de Datos
-- Motor: PostgreSQL 16
-- =============================================================

DROP TABLE IF EXISTS incidentes;

CREATE TABLE incidentes (
    id              SERIAL PRIMARY KEY,
    titulo          VARCHAR(150) NOT NULL,
    descripcion     TEXT NOT NULL,
    categoria       VARCHAR(50)  NOT NULL DEFAULT 'general',
    prioridad       VARCHAR(20)  NOT NULL DEFAULT 'media'
                    CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
    estado          VARCHAR(20)  NOT NULL DEFAULT 'abierto'
                    CHECK (estado IN ('abierto', 'en_progreso', 'resuelto', 'cerrado')),
    solicitante     VARCHAR(100) NOT NULL,
    asignado_a      VARCHAR(100),
    fecha_creacion      TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para acelerar los filtros más comunes de la mesa de ayuda
CREATE INDEX idx_incidentes_estado    ON incidentes (estado);
CREATE INDEX idx_incidentes_prioridad ON incidentes (prioridad);

-- Trigger para mantener fecha_actualizacion siempre al día
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_incidentes_actualizado
BEFORE UPDATE ON incidentes
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Datos semilla para verificar rápidamente el funcionamiento de la API
INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, estado, solicitante, asignado_a) VALUES
('No enciende monitor de laboratorio', 'El monitor del laboratorio C3 no enciende tras el corte eléctrico', 'hardware', 'alta', 'abierto', 'Laura Zambrano', 'Soporte TI'),
('Acceso denegado al sistema académico', 'El usuario no puede iniciar sesión en el portal académico', 'software', 'media', 'en_progreso', 'Carlos Mendoza', 'Soporte TI');
