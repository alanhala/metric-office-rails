load({
  controllers: {
    realtime: ['index']
  }
}, (controller, action) => {
  var chart;

  function requestData() {
      $.ajax({
          url: 'https://private-81a36-kevinkraus92.apiary-mock.com/metricoffice/',
          success: function(data) {
              var series = chart.series[0],
                  shift = series.data.length > 20;
              var x = (new Date()).getTime();
              chart.series[0].addPoint([x, data.y], true, shift);
              setTimeout(requestData, 1000);
          },
          cache: false
      });
  }

  chart = new Highcharts.Chart({
      chart: {
          renderTo: 'container-live-chart',
          defaultSeriesType: 'spline',
          events: {
              load: requestData
          }
      },
      title: {
          text: 'Woloxers on the run'
      },
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
          maxZoom: 20 * 1000
      },
      yAxis: {
          minPadding: 0.2,
          maxPadding: 0.2,
          title: {
              text: 'Number of people',
              margin: 30
          }
      },
      series: [{
          name: 'Wolox Live',
          data: []
      }]
  });
})
