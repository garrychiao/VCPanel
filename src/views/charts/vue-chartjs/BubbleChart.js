// Bubble Chart
import { Bubble } from 'vue-chartjs'

export default {
  extends: Bubble,
  data: function () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            gridLines: {
              display: false
            },
            categoryPercentage: 0.5,
            barPercentage: 0.8
          }]
        }
      }
    }
  },
  mounted () {
    this.renderChart({
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#F64A32',
          data: [
            {
              x: 20,
              y: 25,
              r: 5
            },
            {
              x: 40,
              y: 10,
              r: 10
            },
            {
              x: 30,
              y: 22,
              r: 30
            }
          ]
        },
        {
          label: 'Data Two',
          backgroundColor: '#FEA200',
          data: [
            {
              x: 10,
              y: 30,
              r: 15
            },
            {
              x: 20,
              y: 20,
              r: 10
            },
            {
              x: 15,
              y: 8,
              r: 30
            }
          ]
        }
      ]
    }, this.options)
  }
}
