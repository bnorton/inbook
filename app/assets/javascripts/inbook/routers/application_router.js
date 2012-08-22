inbook.routers.ApplicationRouter = (function() {
  var once = true;

  return Backbone.Router.extend({
    routes: {
      "!/dashboard": "dashboard",
      "!dashboard": "dashboard",
      "!/friends": "friends",
      "!friends": "friends",
      "!/logout": "logout",
      "!logout": "logout"
    },

    dashboard: function() {
      new inbook.views.DashboardIndexView({el: "#dashboard", model: inbook.currentUser});

      _(inbook.views.graphs).each(function(graph) {
        var options = {el: graph.el};
        _(options).extend(graph.args());

        new graph.view(options);
      });

      if(inbook.currentUser.free()) {
        new inbook.data.FacebookDataConnector();
      } else {
        new inbook.data.SocialDataConnector();
      }

      common();
    },

    friends: function() {
      new inbook.data.FriendsDataConnector();
      new inbook.views.FriendsIndexView({el: "#dashboard"});

      common();
    },

    logout: function() {
      inbook.currentUser.destroy({
        success: function() {
          inbook.utils.navigate("/");
        }
      });
    }
  });

  function common() {
    if(once) {
      new inbook.views.UsersNavigationView({el: "#user-nav", model: inbook.currentUser});

      once = false;
    }
  }
}());
