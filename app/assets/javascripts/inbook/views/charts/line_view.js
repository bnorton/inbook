inbook.views.LineChartView = (function() {
  return Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render");

      options.interval || (this.options.interval = "week");
      options.color    || (this.options.color = "whiteSmoke");

      inbook.bus.on("data:series:" + options.type + ":ready", this.render);

      if(inbook.data.series[options.type][options.interval]) {
        this.render();
      }
    },

    render: function() {
      summarize(this.options.type);

      var data = this.getData(),
          options = this.getOptions(data, this.options.color);

      new Highcharts.Chart(options);
    },

    getData: function() {
      var type = this.options.type,
          interval = this.options.interval,
          data = _(inbook.data.series[type][interval]).clone(),
          dates = [],
          series = _(_(_(data).
            keys()).
            sortBy(function(key) {
              return key;
            })).
            map(function(key) {
              dates.push(I18n.l("date.formats.human", key));

              return data[key];
            });

      return {
        categories: dates,
        series: series
      };
    },

    getOptions: function(data, color) {
      return {
        chart: {
          renderTo: this.options.type,
          type: 'line',
          backgroundColor: color
        },
        title: { text: '' },
        credits: { enabled: false },
        xAxis: {
          categories: data.categories,
          labels: { enabled: false },
          tickColor: color
        },
        yAxis: {
          title: { text: '' },
          endOnTick: false,
          min: 0,
          max: (_(data.series).max() + 2),
          tickPixelInterval: 40
        },
        tooltip: {
          formatter: this.tooltipFormatter()
        },
        series: [
          { name: this.options.type, data: data.series }
        ],
        legend: { enabled: false }
      };
    },

    tooltipFormatter: function() {
      var that = this;

      return function() {
        return '4 weeks ending:' +
          '<br />' +
          this.x +
          '<br />' +
          '# of ' + that.options.type + ': ' + this.y;
      };
    }
  });

  function summarize(type) {
    var data = inbook.data.series[type].week,
        month = {},
        sum = 0,
        count = 0,
        currentKey = "";

    _(_(_(data).
      keys()).
      sortBy(function(key) {
        return key;
      })).each(function(key) {
        currentKey = key;
        sum += data[currentKey];
        count += 1;

        if(count === 3) {
          month[currentKey] = sum;
          sum = count = 0;
        }
      });

    if(currentKey && count !== 0) month[currentKey] = sum;

    inbook.data.series[type].month = month;
  }
}());
