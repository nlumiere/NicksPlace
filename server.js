const express = require('express');
const https = require('https');
const WebSocket = require('ws');
// const firebase = require('firebase');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

const port = 443;
const server = https.createServer(express);
const wss = new WebSocket.Server({ server })

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {

        parsed_data = JSON.parse(data);

        db.collection("pixels").doc("x" + parsed_data.x + "y" + parsed_data.y).set(parsed_data, {merge: true});
        db.collection("updates").add(parsed_data);

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    })
})
   

server.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
})