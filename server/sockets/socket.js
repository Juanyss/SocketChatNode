const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            })
        }

        let personas = usuarios.agregarPersona(client.id, usuario.nombre);

        client.broadcast.emit('listarPersonas', usuarios.getPersonas());

        if (callback) {
            callback(personas)
        }
    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id)

        client.broadcast.emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`))
        client.broadcast.emit('listarPersonas', usuarios.getPersonas());
    })

    client.on('crearMensaje', (data => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.emit('crearMensaje', mensaje)
    }))

});