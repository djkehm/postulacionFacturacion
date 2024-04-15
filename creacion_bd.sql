CREATE DATABASE IF NOT EXISTS votacion_bd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'djkehm'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON votacion_bd.* TO 'djkehm'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE datos (
    ID INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(50) NOT NULL,
    alias VARCHAR(50) NOT NULL,
    rut VARCHAR(10) NOT NULL,
    email VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    comuna VARCHAR(50) NOT NULL,
    candidato VARCHAR(50) NOT NULL,
    referencia VARCHAR(50) NOT NULL
);


DELIMITER //

CREATE PROCEDURE guardarVotacion(IN jsonData JSON)
BEGIN
    DECLARE v_usuario_rut VARCHAR(10);
    DECLARE v_nombre VARCHAR(50);
    DECLARE v_alias VARCHAR(50);
    DECLARE v_email VARCHAR(50);
    DECLARE v_region VARCHAR(50);
    DECLARE v_comuna VARCHAR(50);
    DECLARE v_candidato VARCHAR(50);
    DECLARE v_referencia VARCHAR(50);
    DECLARE v_existe INT DEFAULT 0;
    DECLARE exito BOOLEAN DEFAULT FALSE;

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        SET exito = FALSE;

    SET v_usuario_rut = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.rut'));
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.nombre'));
    SET v_alias = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.alias'));
    SET v_email = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.email'));
    SET v_region = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.region'));
    SET v_comuna = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.comuna'));
    SET v_candidato = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.candidato'));
    SET v_referencia = JSON_UNQUOTE(JSON_EXTRACT(jsonData, '$.entero'));

    SELECT COUNT(*) INTO v_existe FROM datos WHERE rut = v_usuario_rut;
    IF v_existe > 0 THEN
        SELECT JSON_OBJECT('status', 'failed', 'message', 'Este usuario ya votó.') AS RespuestaJSON;
    ELSE
        IF v_email NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$' THEN
            SELECT JSON_OBJECT('status', 'failed', 'message', 'No es un correo válido.') AS RespuestaJSON;
        ELSE
            INSERT INTO datos (rut, nombre_completo, alias, email, region, comuna, candidato, referencia)
            VALUES (v_usuario_rut, v_nombre, v_alias, v_email, v_region, v_comuna, v_candidato, v_referencia);

            IF ROW_COUNT() > 0 THEN
                SET exito = TRUE;
            END IF;

            IF exito THEN
                SELECT JSON_OBJECT('status', 'success', 'message', 'Voto registrado exitosamente.') AS RespuestaJSON;
            ELSE
                SELECT JSON_OBJECT('status', 'error', 'message', 'Error al registrar el voto.') AS RespuestaJSON;
            END IF;
        END IF;
    END IF;

END //

DELIMITER ;
