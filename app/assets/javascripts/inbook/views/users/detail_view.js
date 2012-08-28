inbook.views.UserDetailView = (function() {
  var template = JST["inbook/templates/users/detail"];

  return Backbone.View.extend({
    render: function() {
      this.$el.html(template({
        user: this.model.toJSON(),
        image: this.model.profileImage()
      }));

      return this;
    }
  });
}());
