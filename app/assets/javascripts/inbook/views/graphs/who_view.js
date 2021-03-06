inbook.views.WhoGraphView = (function() {
  var template = JST["inbook/templates/graphs/who"];

  return Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "ready");

      inbook.bus.on("data:posts:who:ready", this.ready);
      this.render();
    },

    render: function() {
      this.$el.html(template());
    },

    ready: function() {
      this.$el.find(".spinner").addClass("hidden");

      nv.addGraph(function() {
        var chart = nv.models.multiBarHorizontalChart()
          .x(function(data) { return data.label })
          .y(function(data) { return data.value })
          .margin({top: 30, right: 20, bottom: 35, left: 140})
          .stacked(true)
          .showValues(true);

        chart.yAxis
          .tickFormat(d3.format('0f'));

        d3.select("#who svg")
          .datum([{key: "", values: inbook.data.posts.who}])
          .transition().duration(300)
          .call(chart);

        return chart;
      });
    }
  });
}());
