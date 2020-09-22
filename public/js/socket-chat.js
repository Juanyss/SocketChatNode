var socket = io();
var params = new URLSearchParams(window.location.search);

if (params.get('nombre') === '' || (params.get('sala') === '')) {
    window.location = 'index.html';
    throw new Error('El nombre es necesario')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);
    })
});

// escuchar
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

socket.on('listarPersonas', function(mensaje) {
    console.log('Servidor:', mensaje);
});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Mensajes privados

socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado:' + mensaje.mensaje);
})