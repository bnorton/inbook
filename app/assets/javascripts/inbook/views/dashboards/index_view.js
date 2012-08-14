inbook.views.DashboardIndexView = (function() {
  var template = JST["inbook/templates/dashboards/index"];

  return Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render", "updateCounts");

      inbook.bus.on("data:posts:counts:ready data:posts:counts:changed", this.updateCounts);

      this.render();
    },

    render: function() {
      this.$el.html(template({user: this.model}));
    },

    updateCounts: function() {
      var counts = inbook.data.counts,
          $posts = this.$el.find("#posts .count"),
          $comments = this.$el.find("#comments .count"),
          $likes = this.$el.find("#likes .count");

      $posts.html(counts.posts.count);
      $comments.html(counts.comments.count);
      $likes.html(counts.likes.count);
    }
  });
}());
