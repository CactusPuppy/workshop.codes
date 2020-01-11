//= require Chart.min

(() => {
  const charts = document.querySelectorAll("[data-role='chart']")

  charts.forEach(element => {
    const ctx = element.getContext("2d")
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: JSON.parse(element.dataset.labels),
        datasets: [{
          label: "",
          data: JSON.parse(element.dataset.values),
          backgroundColor: "rgba(240, 100, 20, 1)",
          borderColor: "rgba(240, 100, 20, 1)",
          borderWidth: 1,
          lineTension: 0,
          pointBackgroundColor: "rgba(240, 100, 20, 1)"
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            gridLines: {
              drawBorder: false,
              color: "rgba(255, 255, 255, .075)"
            },
            ticks: {
              maxTicksLimit: 4,
              userCallback: (label, index, labels) => { if (Math.floor(label) === label) return label },
              userCallback: (label, index, labels) => { return label.toLocaleString()},
              fontColor: "#8f94a5",
              fontSize: 8
            }
          }],
          xAxes: [{
            barThickness: "flex",
            barMaxThickness: 2,
            gridLines: {
              drawBorder: false,
              color: "#353b3f",
              color: "rgba(255, 255, 255, .0)"
            },
            ticks: {
              maxTicksLimit: 12,
              autoSkip: true,
              fontColor: "#90989c",
              fontSize: 8
            }
          }]
        }
      }
    })
  })
})()