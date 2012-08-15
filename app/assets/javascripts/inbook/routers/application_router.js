inbook.routers.ApplicationRouter = (function() {
  return Backbone.Router.extend({
    routes: {
      "!/dashboard": "dashboard",
      "!dashboard": "dashboard"
    },

    dashboard: function() {
      new inbook.views.DashboardIndexView({el: "#dashboard", model: inbook.currentUser});
      new inbook.views.UsersNavigationView({el: "#user-nav", model: inbook.currentUser});

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
    }
  })
}());
