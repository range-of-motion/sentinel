const WebSocket = require('ws');
const os = require('os-utils');

const wss = new WebSocket.Server({ port: 5000 });

let connections = [];

wss.on('connection', function connection(ws) {
  connections.push(ws);
});

function broadcast() {
  connections.forEach(connection => {
    os.cpuUsage(function (v) {
      const payload = {
        cpu: {
          usagePercentage: Number(v * 100).toFixed(2)
        },

        memory: {
          usagePercentage: Number(100 - os.freememPercentage() * 100).toFixed(2)
        }
      };

      connection.send(JSON.stringify(payload));
    });
  })

  setTimeout(broadcast, 5 * 1000);
}

broadcast();
