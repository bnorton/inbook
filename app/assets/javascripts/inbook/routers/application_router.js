inbook.routers.ApplicationRouter = (function() {
  return Backbone.Router.extend({
    routes: {
      "!/dashboard": "dashboard",
      "!dashboard": "dashboard"
    },

    dashboard: function() {
      new inbook.views.DashboardIndexView({el: "#dashboard", model: new Backbone.Model()});
      new inbook.views.UsersNavigationView({el: "#user-nav", model: inbook.currentUser});
    }
  })
}());
