inbook.routers.ApplicationRouter = (function() {
  return Backbone.Router.extend({
    routes: {
      "!/dashboard": "dashboard",
      "!dashboard": "dashboard"
    },

    dashboard: function() {
      dash = new inbook.views.DashboardIndexView({el: "#dashboard", model: new Backbone.Model()});
    }
  })
}());
