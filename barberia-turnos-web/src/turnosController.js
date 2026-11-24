/**
 * Controlador de Backend - Validación de Concurrencia y Gestión de Turnos
 * Autor: Joaquín Lisandro Maceiras Cami
 */

async function crearTurno(req, res, db) {
    const { id_usuario, id_servicio, fecha, hora } = req.body;

    // 1. Validación de campos obligatorios
    if (!id_usuario || !id_servicio || !fecha || !hora) {
        return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios.' });
    }

    // 2. Bloqueo de domingos (día 0 en JS)
    const diaSemana = new Date(fecha + 'T00:00:00').getDay();
    if (diaSemana === 0) {
        return res.status(400).json({ ok: false, mensaje: 'La barbería permanece cerrada los domingos.' });
    }

    try {
        // 3. Verificación de disponibilidad para evitar turnos duplicados
        const [existentes] = await db.execute(
            'SELECT id_turno FROM Turnos WHERE fecha = ? AND hora = ? AND estado = "confirmado"',
            [fecha, hora]
        );

        if (existentes.length > 0) {
            return res.status(409).json({
                ok: false,
                mensaje: 'El horario seleccionado ya fue ocupado por otro cliente. Elegí otro bloque.'
            });
        }

        // 4. Inserción del turno confirmado
        const [resultado] = await db.execute(
            'INSERT INTO Turnos (id_usuario, id_servicio, fecha, hora, estado) VALUES (?, ?, ?, ?, "confirmado")',
            [id_usuario, id_servicio, fecha, hora]
        );

        return res.status(201).json({
            ok: true,
            id_turno: resultado.insertId,
            mensaje: 'Turno confirmado con éxito.'
        });
    } catch (error) {
        return res.status(500).json({ ok: false, mensaje: 'Error interno al procesar la reserva.' });
    }
}

module.exports = { crearTurno };
