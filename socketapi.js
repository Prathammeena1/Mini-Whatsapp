const io = require("socket.io")();
const userModel = require('./routes/users.js');
const messageModel = require('./routes/message.js');
const groupModel = require('./routes/group.js');

const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", async function (socket) {
    console.log("A user connected");

    try {
        // Handle 1-1 chat
        socket.on('join-user', async (username) => {
            await userModel.findOneAndUpdate({ username }, { socketId: socket.id });
        });

        socket.on('sendByuser', async (messageObject) => {
            const oppositeUser = await userModel.findOne({ username: messageObject.receiver });
            socket.to(oppositeUser.socketId).emit('sendByServer', messageObject);
            await messageModel.create({ ...messageObject });
        });

        // Handle group chat
        socket.on('joinGroup', async (groupName) => {
            socket.join(groupName);
            console.log(socket.id, "joined", groupName);
        });

        socket.on('sendMessageInGroup', async (messageObject) => {
            socket.to(messageObject.groupName).emit('receiveMessageInGroup', messageObject);
            await messageModel.create({
                sender: messageObject.sender,
                receiver: messageObject.groupName,
                message: messageObject.message,
            });
        });
    } catch (error) {
        console.error("Socket.IO Error:", error);
    }
});

// End of Socket.IO logic

module.exports = socketapi;
