inbook.views.TypesGraphView = (function() {
  var template = JST["inbook/templates/graphs/types"];

  return Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render", "ready");

      inbook.bus.on("data:posts:types:ready", this.ready);
      this.render();
    },

    render: function() {
      this.$el.html(template());
    },

    ready: function() {
      this.$el.find(".spinner").addClass("hidden");

      nv.addGraph(function() {
        var chart = nv.models.pieChart()
          .x(function(data) { return data.label })
          .y(function(data) { return data.value })
          .showLabels(true);

        d3.select("#types svg")
          .datum([{key: " ", values: inbook.data.posts.types}])
          .transition().duration(1200)
          .call(chart);

        return chart;

      });
    }
  });
}());
