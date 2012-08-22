inbook.views.GenderGraphView = (function() {
  var template = JST["inbook/templates/graphs/base"];

  return Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render", "ready");

      inbook.bus.on("data:friends:genders:ready", this.ready);
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
          .color(["#08789D", "#DF2882"])
          .showLabels(true);

        d3.select("#genders svg")
          .datum([{key: " ", values: inbook.data.friends.genders}])
          .transition().duration(0)
          .call(chart);

        return chart;
      });
    }
  });
}());
