const socket = require('socket.io');

module.exports = (function (io, app) {
    var allLoginUsers = {};
    
    io.of('/chat')
    .on('connection', function (socket) {
    //    console.log("Connected` " + socket.client.id);
        allLoginUsers[socket.client.id] = {id: socket.client.id, role : ''};
        console.log(allLoginUsers);
        setTimeout(function(){
            socket.emit('enterUser');
        }, 2000);

        socket.emit('usersList', allLoginUsers);
        
        socket.on('usersList', function(data){
            console.log(155641);
            var role = 'user';
            if(data.indexOf("dbs/admin") > -1) {
                role = 'admin';
            }
            allLoginUsers[socket.client.id]['role'] = role;
            // socket.emit('usersList', allLoginUsers);
        });

        socket.on('disconnect', function () {
            delete allLoginUsers[socket.client.id];
            socket.emit('usersList', allLoginUsers);
            // console.log("Disconnected` " + socket.client.id);
        });

        socket.on('chatToUser', function (data) {
            // socket.emit('chatToUser', data);

            io.sockets.connected[data.chatroom].emit('chatToUser', data);
        });

        socket.on('chatToAdmin', function (data) {
            socket.emit('chatToAdmin', data);
        });
        
        // console.log(allLoginUsers);
    });
});