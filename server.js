/*
 * SPDX-FileCopyrightText: Copyright (c) 2022 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

require('dotenv').config({ path: 'env.txt' });

const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');

const { audioCodesControlMessage, wsServerConnection, wsServerClose } = require('./modules/audiocodes');

const RivaASRClient = require('./riva_client/asr');

const app = express();
const httpsPort = (process.env.HTTPS_PORT);
const port = (process.env.PORT);
var server;
var sslkey = './certificates/key.pem';
var sslcert = './certificates/cert.pem';


/**
 * Set up Express Server with CORS and websockets ws
 */
function setupServer() {
    // set up Express
    app.use(express.static('web')); // ./web is the public dir for js, css, etc.
    app.get('/', function (req, res) {
        res.sendFile('./web/index.html', { root: __dirname });
    });
    httpsServer = https.createServer({
        key: fs.readFileSync(sslkey),
        cert: fs.readFileSync(sslcert)
    }, app);
    server = http.createServer(app)

    const wssServer = new WebSocket.Server({ server: httpsServer });
    const wsServer = new WebSocket.Server({ server });

    // Listener, once the client connects to the server socket
    wssServer.on('connection', function connection(ws, req) {
        wsServerConnection(ws, req);
    });
    wssServer.on('close', function close(reason) {
        wsServerClose(reason)
    });

    // Listener, once the client connects to the server socket
    wsServer.on('connection', function connection(ws, req) {
        wsServerConnection(ws, req);
    });
    wsServer.on('close', function close(reason) {
        wsServerClose(reason)
    });

    httpsServer.listen(httpsPort, () => {
        console.log('Running HTTPS server on port %s', httpsPort);
    });
    server.listen(port, () => {
        console.log('Running server on port %s', port);
    });
};

setupServer();

