inbook.views.SessionsNewView = (function() {
  var template = JST["inbook/templates/sessions/new"];

  return Backbone.View.extend({
    events: {
      "submit #login form": "submit",
      "click #password input[type='submit']": "submitPassword"
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
      this.$el.html(template());

      return this;
    },

    submit: function(e) {
      if(e) { stopDefault(e); }

      this.agent.facebookLogin();
    },

    saveUser: function() {
      var that = this;

      that.user.save({}, {
        success: function() {
          inbook.currentUser = that.user;

          success(that);
        }, error: function(model, response) {
          error(that, response)
        }
      });
    },

    submitPassword: function(e) {
      var that = this;

      stopDefault(e);

      that.user.save({
        password: that.$el.find("#password input[type='text']").val()
      }, {
        success: function() {
          success(that);
        }
      })
    }
  });

  function stopDefault(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  function success(view) {
    inbook.utils.navigate("/#!/dashboard");

    view.$el.html("");
  }

  function error(view, r) {
    if(r.status === 401) {
      view.user.set(
        JSON.parse(r.responseText),
        {silent: true}
      );

      inbook.currentUser = view.user;

      view.$el.find("#password").removeClass("hidden");
    }
  }
}());
