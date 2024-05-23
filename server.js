const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

let petFoodAmount = 0;

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});


io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("command", (msg) => {
        const data = JSON.parse(msg);

        switch (data.command){
            case "heating":
            if (data.value){
                console.log("Heating turned on");
            } else {
                console.log("Heating turned off");
            }
            break;

            case "door":
                if (data.value){
                    console.log("Door has been opened");
                } else {
                    console.log("Door has been closed");
                }
                break;

            case "feed":
                petFoodAmount += data.value;
                console.log("Pet food has been added")
                break;

            case "status":
                io.emit("receive-status", JSON.stringify({temperature: (Math.random() * (24 - 19) + 19).toFixed(1), food: petFoodAmount ? 1 : 0}));
                break;

            default:
                console.log("Unknown request");
                break;
        }
    })
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});

