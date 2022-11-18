const express = require('express');
const http = require('http');
const webSocket = require('ws');

const port = 8000;
const server = http.createServer(express);
const wss = new webSocket.Server({server});

wss.on('connection', function connection(ws){
    console.log('A new client connected');

    ws.on('message', function incoming(data){
        try {
            let szamlalo = 0;
            const frame = JSON.parse(data);
            setInterval(function(){
                const tmp = []
                for (let i = szamlalo; i < szamlalo + 4096; i++) {
                    tmp.push(frame[i]);
                }
                szamlalo = szamlalo + 4096;
                wss.clients.forEach(function each(client){
                    if(client !== ws && client.readyState === webSocket.OPEN){
                        client.send(JSON.stringify(tmp));
                    }
                });
            }, 1000/60)
        } catch (error) {
            console.log(error);
        }
        
    });
});

server.listen(port, function(){
    console.log('Listening on port 8000');
}) 