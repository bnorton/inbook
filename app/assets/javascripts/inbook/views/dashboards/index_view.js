inbook.views.DashboardIndexView = (function() {
  var template = JST["inbook/templates/dashboards/index"];

  return Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render", "updateCounts");

      inbook.bus.on("data:posts:counts:ready data:posts:counts:changed", this.updateCounts);

      this.render();
    },

    render: function() {
      this.$el.html(template({user: this.model.toJSON(), image: this.model.profileImage()}));
      new inbook.views.UserDetailView({el: this.$el.find("#user"), model: this.model}).render();

      showCharts();
    },

    updateCounts: function() {
      var that = this,
          counts = inbook.data.counts;

      _(["posts", "likes", "comments"]).each(function(type) {
        that.$el.find(".count." + type).html(counts[type].count);
      });
    }
  });

  function showCharts() {
    _(["posts", "likes", "comments"]).each(function(type) {
      new inbook.views.LineChartView({type: type, interval: "month"});
    });
  }
}());
