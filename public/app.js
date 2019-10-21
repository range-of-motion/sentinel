Vue.component('chart', {
  props: ['type', 'label', 'labels', 'data'],

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

    var options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    if (this.type === 'line') {
      options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100,
              min: 0
            }
          }]
        }
      };
    }

    this.chart = new Chart(context, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [{
            label: this.label,
            data: this.data
        }]
      },
      options
    });
  }
});

new Vue({
  el: '#app',

  data: () => ({
    cpu: {
      labels: [],
      data: []
    },
    memory: {
      labels: [],
      data: []
    },

    responses: {
      labels: [],
      data: []
    }
  }),

  methods: {
    prependByZero: (input) => ('0' + input).slice(-2)
  },

  template: `
    <div style="margin: 40px auto; width: 100%; max-width: 1200px;">
      <div style="display: flex;">
        <chart type="line" label="CPU" :labels="cpu.labels" :data="cpu.data" />
        <chart type="line" label="Memory" :labels="memory.labels" :data="memory.data" />
        <chart type="bar" label="Responses" :labels="responses.labels" :data="responses.data" />
      </div>
    </div>
  `,

  created: function () {
    var self = this;

    var conn = new WebSocket('ws://localhost:5000');

    conn.onopen = function (e) {
        console.log("Connection established!");
    };

    conn.onmessage = function (e) {
        var json = JSON.parse(e.data);

        if (json.type === 'RESOURCES_UPDATE') {
          var now = new Date();
          var hour = now.getHours();
          var minutes = now.getMinutes();
          var seconds = now.getSeconds();
          var timestamp = self.prependByZero(hour) + ':' + self.prependByZero(minutes) + ':' + self.prependByZero(seconds);

          // CPU
          self.cpu.labels.push(timestamp);
          self.cpu.data.push(json.payload.cpu.usagePercentage);

          // Memory
          self.memory.labels.push(timestamp);
          self.memory.data.push(json.payload.memory.usagePercentage);
        }

        // Responses
        if (json.type === 'WEBSERVER_ADD_RESPONSE') {
          var responseType = json.payload.type;
          var isNew = false;

          if (!self.responses.labels.includes(responseType)) {
            self.responses.labels.push(responseType);
            isNew = true;
          }

          if (isNew) {
            self.responses.data.push(1);
          } else {
            var position = self.responses.labels.indexOf(responseType);
            Vue.set(self.responses.data, position, self.responses.data[position] + 1);
          }
        }
    };
  }
});
