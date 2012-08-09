inbook.views.SessionsNewView = (function() {
  return Backbone.View.extend({
    template: JST["inbook/templates/sessions/new"],

    events: {
      "submit form": "submit"
    },

    initialize: function() {
      _.bindAll(this, "submit", "saveUser");

      this.user = this.options.user || new inbook.models.User();
      this.agent = new inbook.agents.SessionsAgent(this.user);

      this.user.on("change:facebook:user", this.saveUser);
      inbook.bus.on("fb:error:auth", this.submit);

      if(!this.options.user) {
        this.render();
      }
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    submit: function(e) {
      if(e) {
        stopDefault(e);
      }

      this.agent.facebookLogin();
    },

    saveUser: function() {
      var that = this;

      that.user.save({}).
        success(function() {
          inbook.currentUser = that.user;
          inbook.utils.navigate("/#!/dashboard");

          that.$el.html("");
        });
    }
  });

  function stopDefault(event) {
    event.stopPropagation();
    event.preventDefault();
  }
}());
