CREATE TABLE respuestas (
    id SERIAL PRIMARY KEY,
    respuesta VARCHAR(10) NOT NULL,
    ip VARCHAR(45),
    user_agent TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);