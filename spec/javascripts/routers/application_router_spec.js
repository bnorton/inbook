describe("ApplicationRouter", function() {
  var router;

  beforeEach(function() {
    router = new inbook.routers.ApplicationRouter();
  });

  describe("#routes", function() {
    it("should have dashboard", function() {
      expect(router.routes["!/dashboard"]).toEqual("dashboard");
    });

    it("should have dashboard", function() {
      expect(router.routes["!dashboard"]).toEqual("dashboard");
    });
  });

  describe("#dashboard", function() {
    beforeEach(function() {
      spyOn(inbook.views, "DashboardIndexView");
      spyOn(inbook.views, "UsersNavigationView");
    });

    it("should create a dashboard view", function() {
      router.dashboard();

      expect(inbook.views.DashboardIndexView).toHaveBeenCalled();
    });

    it("should create a navigation view", function() {
      router.dashboard();

      expect(inbook.views.UsersNavigationView).toHaveBeenCalled();
    });

    describe("#graphs", function() {
      beforeEach(function() {
        spyOn(inbook.views, "TypesGraphView");
        spyOn(inbook.views, "WhoGraphView");

        inbook.views.graphs = [
          {
            el: "#types",
            view: inbook.views.TypesGraphView,
            args: function() {
              return {key: "value"}
            }
          },
          {
            el: "#who",
            view: inbook.views.WhoGraphView,
            args: function() {
              return {key: "other value"}
            }
          }
        ];

        router.dashboard();
      });

      it("should initialize the types view", function() {
        var types = inbook.views.TypesGraphView.mostRecentCall.args;

        expect(types[0].el).toEqual("#types");
        expect(types[0].key).toEqual("value");
      });

      it("should initialize the who view", function() {
        var who = inbook.views.WhoGraphView.mostRecentCall.args;

        expect(who[0].el).toEqual("#who");
        expect(who[0].key).toEqual("other value");
      });
    });
  });
});
