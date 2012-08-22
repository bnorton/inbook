inbook.views.UsersNavigationView = (function() {
  var template = JST["inbook/templates/users/navigation"];

  return Backbone.View.extend({
    events: {
      "click .name": "toggleDropdown",
      "click .item": "dropdown"
    },

    initialize: function() {
      var that = this;

      that.render();

      $('body').on('click', function() {
        that.$el.find(".dropdown").addClass("hidden");
      });
    },

    render: function() {
      this.$el.html(template({user: this.model}));

      attachItems(this.$el);
    },

    toggleDropdown: function(e) {
      if(e) e.stopPropagation();

      this.$el.find(".dropdown").toggleClass("hidden");
    },

    dropdown: function(e) {
      Backbone.history.navigate("/#!/" + $(e.currentTarget).data("type"), {trigger: true});

      this.toggleDropdown();
    }
  });

  function attachItems($el) {
    $el.find(".item").each(function() {
      var $item = $(this);

      $item.html(I18n.t("users.navigation." + $item.data("type")));
    });
  }
}());
