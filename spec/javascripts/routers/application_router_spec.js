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

      router.dashboard();
    });

    it("should create a dashboard view", function() {
      expect(inbook.views.DashboardIndexView).toHaveBeenCalled();
    });

    it("should create a navigation view", function() {
      expect(inbook.views.UsersNavigationView).toHaveBeenCalled();
    });
  });
});
