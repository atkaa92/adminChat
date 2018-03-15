const socket = require('socket.io');

module.exports = (function (io, app) {
    var allLoginUsers = {};
    io.of('/chat')
    .on('connection', function (socket) {
       console.log("Connected` " + socket.client.id);
        allLoginUsers[socket.client.id] = {id: socket.client.id, role : ''};
        
        setTimeout(function(){ 
            socket.emit('enterUser'); 
        }, 3000);
        
        socket.on('usersList', function(data){
            var role = 'user';
            if(data.indexOf("dbs/admin") > -1) {
                role = 'admin';
            }
            allLoginUsers[socket.client.id]['role'] = role;
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['role'] == 'admin') {
                    // let usersForAdmin = allLoginUsers;
                    // delete usersForAdmin[conClients[p].client.id];
                    conClients[p].emit('usersList', {allLoginUsers :allLoginUsers, thisId : conClients[p].client.id});
                }
            }
        });

        socket.on('disconnect', function () {
            delete allLoginUsers[socket.client.id];
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['role'] == 'admin') {
                    conClients[p].emit('someoneDisconected', socket.client.id);
                }
            }
            console.log("Disconnected` " + socket.client.id);
        });

        socket.on('chatToUser', function (data) {
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['id'] == data.chatroom) {
                    conClients[p].emit('adminChatToUser', data);
                }
            }
        });

        socket.on('chatToAdmin', function (data) {
            currId = socket.client.id
            data.chatroom = currId;
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['role'] == 'admin') {
                    conClients[p].emit('chatToAdmin', data);
                }
            }
        });
    });
});