inbook.views.FriendsIndexView = (function() {
  var template = JST["inbook/templates/friends/index"];

  return Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, "render");

      inbook.bus.on("data:friends:ready", this.render);
    },

    render: function() {
      this.$el.html(template({friends: inbook.data.friends}));
    }
  })
}());
