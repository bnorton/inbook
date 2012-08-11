inbook.views.UsersNavigationView = (function() {
  var template = JST["inbook/templates/users/navigation"];

  return Backbone.View.extend({
    events: {
      "click .name": "toggleDropdown",
      "click .item": "dropdown"
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(template({user: this.model}));

      attachItems(this.$el);
    },

    toggleDropdown: function() {
      this.$el.find(".dropdown").toggleClass("hidden");
    },

    dropdown: function(e) {
      Backbone.history.navigate("/#!/" + $(e.currentTarget).data("type"));
    }
  });

  function attachItems($el) {
    $el.find(".item").each(function() {
      var $item = $(this);

      $item.html(I18n.t("users.navigation." + $item.data("type")));
    });
  }
}());
