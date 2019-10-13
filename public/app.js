Vue.component('chart', {
  props: ['label', 'labels', 'data'],

  data: () => ({
    chart: null
  }),

  template: `
    <div style="flex: 1;">
      <canvas ref="chart" width="400" height="400"></canvas>
    </div>
  `,

  watch: {
    data: function () {
      this.chart.update();
    }
  },

  mounted: function () {
    var context = this.$refs.chart.getContext('2d');

    this.chart = new Chart(context, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
            label: this.label,
            data: this.data
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100,
              min: 0
            }
          }]
        }
      }
    });
  }
});

new Vue({
  el: '#app',

  data: () => ({
    connected: false,

    cpu: {
      labels: [],
      data: []
    },

    memory: {
      labels: [],
      data: []
    }
  }),

  methods: {
    prependByZero: (input) => ('0' + input).slice(-2)
  },

  template: `
    <div style="margin: 40px auto; width: 100%; max-width: 1200px; font-family: Arial; text-align: center;">
      <div
        style="margin-bottom: 20px; display: inline-block; padding: 5px 10px; color: #FFF; font-size: 14px; border-radius: 5px;"
        :style="connected ? 'background: #1ABC9C;' : 'background: #C0392B;'"
      >{{ connected ? 'Connected' : 'Disconnected' }}</div>
      <div style="display: flex;">
        <chart label="CPU" :labels="cpu.labels" :data="cpu.data" />
        <chart label="Memory" :labels="memory.labels" :data="memory.data" />
      </div>
    </div>
  `,

  created: function () {
    var self = this;

    var conn = new WebSocket('ws://localhost:5000');

    conn.onopen = function (e) {
        self.connected = true;
    };

    conn.onmessage = function (e) {
        var json = JSON.parse(e.data);

        var now = new Date();
        var hour = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var timestamp = self.prependByZero(hour) + ':' + self.prependByZero(minutes) + ':' + self.prependByZero(seconds);

        // CPU
        self.cpu.labels.push(timestamp);
        self.cpu.data.push(json.cpu.usagePercentage);

        // Memory
        self.memory.labels.push(timestamp);
        self.memory.data.push(json.memory.usagePercentage);
    };
  }
});
