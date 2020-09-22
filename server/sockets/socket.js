const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala es necesario'
            })
        }

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listarPersonas', usuarios.getPersonasPorSala(usuario.sala));

        if (callback) {
            callback(usuarios.getPersonasPorSala(usuario.sala))
        }
    })

    client.on('disconnect', () => {
        if (!client.id) {
            throw new Error('Usuario sin id')
        }

        let personaBorrada = usuarios.borrarPersona(client.id)

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listarPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    })

    client.on('crearMensaje', (data => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    }))

    client.on('mensajePrivado', data => {
        if (!data.mensaje) {
            return callback({
                error: true,
                mensaje: 'El mensaje es necesario'
            })
        }

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

});