const WebSocket = require('ws');
const os = require('os-utils');
const spawn = require('child_process').spawn;

const wss = new WebSocket.Server({ port: 5000 });

let connections = [];

wss.on('connection', function connection(ws) {
  connections.push(ws);
});

function broadcast(type, payload) {
  connections.forEach(connection => {
    connection.send(JSON.stringify({
      type,
      payload
    }));
  });
}

//
function sendResourcesUpdate() {
  os.cpuUsage(function (v) {
    broadcast('RESOURCES_UPDATE', {
      cpu: {
        usagePercentage: Number(v * 100).toFixed(2)
      },

      memory: {
        usagePercentage: Number(100 - os.freememPercentage() * 100).toFixed(2)
      }
    });

    setTimeout(sendResourcesUpdate, 5 * 1000);
  });
}

sendResourcesUpdate();

//
var tail = spawn('tail', ['-f', '-n 0', '/var/log/apache2/access_log']);

tail.stdout.on('data', data => {
  const line = data.toString('utf-8');
  const parts = line.split(' ');

  const responseType = parts[8]; // Obviously this is hacky, gotta find a better way to parse lines in the future

  broadcast('WEBSERVER_ADD_RESPONSE', {
    type: responseType
  });
});
