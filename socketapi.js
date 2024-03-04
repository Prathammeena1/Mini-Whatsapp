const io = require("socket.io")();
const userModel = require('./routes/users')
const messageModel = require('./routes/message')
const groupModel = require('./routes/group')
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected");

    // 1-1 chat 
    socket.on('join-user', async (username) => {
        var loggedInUser = await userModel.findOneAndUpdate({ username }, { socketId: socket.id })
    })

    socket.on('sendByuser', async (messageObject) => {
        var oppositeUser = await userModel.findOneAndUpdate({ username: messageObject.reciever }, { socketId: socket.id })
        socket.to(oppositeUser.socketId).emit('sendByServer', messageObject);
        var newMessage = await messageModel.create({
            ...messageObject,
        })
    })


    // groupChat
    socket.on('joinGroup', async groupName => {
        socket.join(groupName);
        console.log(socket.id, "joined", groupName)
    });

    socket.on('sendMessageInGroup', async messageObject => {
        socket.to(messageObject.groupName).emit('receiveMessageInGroup', messageObject);
        var newMessage = await messageModel.create({
            sender:messageObject.sender,
            reciever: messageObject.groupName,
            message:messageObject.message,
        })
    })

});
// end of socket.io logic

module.exports = socketapi;