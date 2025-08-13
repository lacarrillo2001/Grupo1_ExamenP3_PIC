-- ===== 1) Investigador =====
-- id, nombre, apellido, departamento, experiencia (años)
CREATE TABLE investigadores (
  id            BIGSERIAL PRIMARY KEY,
  nombre        TEXT NOT NULL,
  apellido      TEXT NOT NULL,
  departamento  TEXT NOT NULL,
  experiencia   INTEGER NOT NULL CHECK (experiencia >= 0)
);

-- ===== 2) Línea de Investigación =====
-- id, nombre, área
CREATE TABLE lineas_investigacion (
  id      BIGSERIAL PRIMARY KEY,
  nombre  TEXT NOT NULL UNIQUE,
  area    TEXT NOT NULL
);

-- ===== 3) Disponibilidad =====
-- id, franja_horaria (texto tal cual), modalidad (Presencial/Virtual)
CREATE TABLE disponibilidades (
  id               BIGSERIAL PRIMARY KEY,
  franja_horaria   TEXT NOT NULL,                                      -- ej: "Lunes 14:00-16:00"
  modalidad        TEXT NOT NULL CHECK (modalidad IN ('Presencial','Virtual'))
);

-- ===== 4) Entidad Intermedia: Investigador_Línea_Disponibilidad =====
-- combina investigador + línea + disponibilidad (sin duplicados)
CREATE TABLE investigador_linea_disponibilidad (
  investigador_id   BIGINT NOT NULL REFERENCES investigadores(id) ON DELETE CASCADE,
  linea_id          BIGINT NOT NULL REFERENCES lineas_investigacion(id) ON DELETE CASCADE,
  disponibilidad_id BIGINT NOT NULL REFERENCES disponibilidades(id) ON DELETE CASCADE,
  PRIMARY KEY (investigador_id, linea_id, disponibilidad_id)
);

-- Índice útil para consultas/agrupamiento por (línea, disponibilidad)
CREATE INDEX idx_ild_linea_dispo
  ON investigador_linea_disponibilidad (linea_id, disponibilidad_id);

-- ===== 5) Tabla de grupos (persistencia del resultado del algoritmo del backend) =====
-- Un grupo por combinación (línea, disponibilidad); 'miembros' lo actualizará el backend
CREATE TABLE grupos (
  id                 BIGSERIAL PRIMARY KEY,
  linea_id           BIGINT NOT NULL REFERENCES lineas_investigacion(id) ON DELETE CASCADE,
  disponibilidad_id  BIGINT NOT NULL REFERENCES disponibilidades(id) ON DELETE CASCADE,
  miembros           INTEGER NOT NULL CHECK (miembros >= 3),
  creado_en          TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (linea_id, disponibilidad_id)
);

CREATE INDEX idx_grupos_linea_dispo
  ON grupos (linea_id, disponibilidad_id);


-- Devuelve el id del grupo para (línea, disponibilidad) si existe; de lo contrario NULL.
CREATE OR REPLACE FUNCTION public.fn_get_grupo_id(p_linea_id BIGINT, p_dispo_id BIGINT)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT id
  FROM grupos
  WHERE linea_id = p_linea_id
    AND disponibilidad_id = p_dispo_id
$$;


-- Crea/actualiza/elimina el grupo persistente para (línea, disponibilidad)
-- según el conteo actual en la tabla intermedia y el umbral (por defecto 3).
-- Devuelve el grupo_id si queda creado/actualizado; NULL si se elimina/no califica.
CREATE OR REPLACE FUNCTION public.fn_sync_grupo(
  p_linea_id BIGINT,
  p_dispo_id BIGINT,
  p_umbral   INTEGER DEFAULT 3
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  v_count   INTEGER;
  v_groupid BIGINT;
BEGIN
  SELECT COUNT(DISTINCT investigador_id)
  INTO v_count
  FROM investigador_linea_disponibilidad
  WHERE linea_id = p_linea_id
    AND disponibilidad_id = p_dispo_id;

  IF v_count >= p_umbral THEN
    INSERT INTO grupos (linea_id, disponibilidad_id, miembros, actualizado_en)
    VALUES (p_linea_id, p_dispo_id, v_count, now())
    ON CONFLICT (linea_id, disponibilidad_id)
    DO UPDATE SET miembros = EXCLUDED.miembros, actualizado_en = now();

    SELECT id INTO v_groupid
    FROM grupos
    WHERE linea_id = p_linea_id AND disponibilidad_id = p_dispo_id;

    RETURN v_groupid;
  ELSE
    DELETE FROM grupos
    WHERE linea_id = p_linea_id
      AND disponibilidad_id = p_dispo_id;
    RETURN NULL;
  END IF;
END
$$;


-- Recalcula TODOS los grupos a partir de la tabla intermedia:
-- 1) Upsert de combos que alcanzan el umbral
-- 2) Elimina de 'grupos' los combos que ya NO alcanzan el umbral
-- Devuelve el número de grupos resultantes.
CREATE OR REPLACE FUNCTION public.fn_sync_todos(p_umbral INTEGER DEFAULT 3)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_total INTEGER;
BEGIN
  -- Upsert de todos los combos que califican
  WITH counts AS (
    SELECT
      linea_id,
      disponibilidad_id,
      COUNT(DISTINCT investigador_id) AS miembros
    FROM investigador_linea_disponibilidad
    GROUP BY linea_id, disponibilidad_id
    HAVING COUNT(DISTINCT investigador_id) >= p_umbral
  )
  INSERT INTO grupos (linea_id, disponibilidad_id, miembros, actualizado_en)
  SELECT linea_id, disponibilidad_id, miembros, now()
  FROM counts
  ON CONFLICT (linea_id, disponibilidad_id)
  DO UPDATE SET miembros = EXCLUDED.miembros, actualizado_en = now();

  -- Eliminar los que ya no califican
  DELETE FROM grupos g
  WHERE NOT EXISTS (
    SELECT 1
    FROM investigador_linea_disponibilidad ild
    WHERE ild.linea_id = g.linea_id
      AND ild.disponibilidad_id = g.disponibilidad_id
    GROUP BY ild.linea_id, ild.disponibilidad_id
    HAVING COUNT(DISTINCT ild.investigador_id) >= p_umbral
  );

  SELECT COUNT(*) INTO v_total FROM grupos;
  RETURN v_total;
END
$$;



-- Igual que una vista enriquecida, pero como función para facilitar filtros desde el backend.
CREATE OR REPLACE FUNCTION public.fn_listar_grupos()
RETURNS TABLE(
  grupo_id          BIGINT,
  linea_id          BIGINT,
  linea             TEXT,
  disponibilidad_id BIGINT,
  franja_horaria    TEXT,
  modalidad         TEXT,
  miembros          INTEGER,
  creado_en         TIMESTAMPTZ,
  actualizado_en    TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    g.id,
	    l.id,
	    l.nombre,
	    d.id,
	    d.franja_horaria,
	    d.modalidad,
	    g.miembros,
	    g.creado_en,
	    g.actualizado_en
	  FROM grupos g
	  JOIN lineas_investigacion l ON l.id = g.linea_id
	  JOIN disponibilidades    d ON d.id = g.disponibilidad_id
	  ORDER BY g.actualizado_en DESC
	$$;
	
	
	CREATE OR REPLACE FUNCTION public.fn_grupo_miembros(p_grupo_id BIGINT)
	RETURNS TABLE(
	  investigador_id BIGINT,
	  nombre          TEXT,
	  apellido        TEXT,
	  departamento    TEXT,
	  experiencia     INTEGER
	)
	LANGUAGE sql
	STABLE
	AS $$
	  SELECT i.id, i.nombre, i.apellido, i.departamento, i.experiencia
	  FROM grupos g
	  JOIN investigador_linea_disponibilidad ild
	    ON ild.linea_id = g.linea_id
	   AND ild.disponibilidad_id = g.disponibilidad_id
	  JOIN investigadores i ON i.id = ild.investigador_id
	  WHERE g.id = p_grupo_id
	  ORDER BY i.apellido, i.nombre
	$$;



-- Inserta la asignación (si no existe) y sincroniza ese grupo.
CREATE OR REPLACE FUNCTION public.fn_asignar_y_sync(
  p_investigador_id  BIGINT,
  p_linea_id         BIGINT,
  p_dispo_id         BIGINT,
  p_umbral           INTEGER DEFAULT 3
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  v_grupo_id BIGINT;
BEGIN
  INSERT INTO investigador_linea_disponibilidad (investigador_id, linea_id, disponibilidad_id)
  VALUES (p_investigador_id, p_linea_id, p_dispo_id)
  ON CONFLICT DO NOTHING;

  v_grupo_id := public.fn_sync_grupo(p_linea_id, p_dispo_id, p_umbral);
  RETURN v_grupo_id;
END
$$;



-- Limpiar todo (ejecuta solo si ya tienes datos anteriores)
TRUNCATE TABLE grupos, investigador_linea_disponibilidad,
                 disponibilidades, lineas_investigacion, investigadores
RESTART IDENTITY;

-- Insertar investigadores
INSERT INTO investigadores (nombre, apellido, departamento, experiencia) VALUES
('Dra.', 'Martínez', 'Biología', 10),
('Dr.', 'López', 'Informática', 7),
('Dr.', 'Rivera', 'Informática', 8),
('Dra.', 'Suárez', 'Biología', 6),
('Dr.', 'Paredes', 'Sociología', 9);

-- Insertar líneas
INSERT INTO lineas_investigacion (nombre, area) VALUES
('Bioinformática Avanzada', 'Biología-Computación'),
('Machine Learning aplicado a Genética', 'Computación-Biología');

-- Insertar disponibilidades
INSERT INTO disponibilidades (franja_horaria, modalidad) VALUES
('Lunes 14:00-16:00', 'Presencial'),
('Miércoles 09:00-11:00', 'Virtual');


SELECT * FROM fn_listar_grupos();

SELECT * FROM fn_grupo_miembros(1); -- usa el id real del grupo



-- Añadimos 3 personas en la otra línea y disponibilidad
SELECT fn_asignar_y_sync(1, 1, 1, 3); -- Martínez, Bioinf, Lunes
SELECT fn_asignar_y_sync(4, 1, 1, 3); -- Suárez
SELECT fn_asignar_y_sync(5, 1, 1, 3); -- Paredes

-- Recalcular todos
SELECT fn_sync_todos(3);

-- Ver grupos
SELECT * FROM fn_listar_grupos();


select * from investigadores

-- Quitamos a un investigador del primer grupo
DELETE FROM investigador_linea_disponibilidad
WHERE investigador_id = 1 AND linea_id = 1 AND disponibilidad_id = 1;

-- Recalcular todos
SELECT fn_sync_todos(3);

-- Ver grupos
SELECT * FROM fn_listar_grupos();


select * from investigador_linea_disponibilidad

