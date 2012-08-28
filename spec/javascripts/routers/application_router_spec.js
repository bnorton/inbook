describe("ApplicationRouter", function() {
  var router;

  beforeEach(function() {
    router = new inbook.routers.ApplicationRouter();
  });

  describe("#routes", function() {
    it("should have /dashboard", function() {
      expect(router.routes["!/dashboard"]).toEqual("dashboard");
    });

    it("should have dashboard", function() {
      expect(router.routes["!dashboard"]).toEqual("dashboard");
    });

    it("should have /friends", function() {
      expect(router.routes["!/friends"]).toEqual("friends");
    });

    it("should have friends", function() {
      expect(router.routes["!friends"]).toEqual("friends");
    });

    it("should have /logout", function() {
      expect(router.routes["!/logout"]).toEqual("logout");
    });

    it("should have logout", function() {
      expect(router.routes["!logout"]).toEqual("logout");
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

    describe("for the data connection", function() {
      beforeEach(function() {
        inbook.currentUser = new inbook.models.User();
      });

      describe("when the user is a free user", function() {
        beforeEach(function() {
          spyOn(inbook.currentUser, "free").andReturn(true);
          spyOn(inbook.data, "FacebookDataConnector");

          router.dashboard();
        });

        it("should user the facebook data connector", function() {
          expect(inbook.data.FacebookDataConnector).toHaveBeenCalled();
        });
      });

      describe("when the user is a paid user", function() {
        beforeEach(function() {
          spyOn(inbook.currentUser, "free").andReturn(false);
          spyOn(inbook.data, "SocialDataConnector");
          spyOn(inbook.data, "SeriesData");

          router.dashboard();
        });

        it("should user the social data connector", function() {
          expect(inbook.data.SocialDataConnector).toHaveBeenCalled();
        });

        it("should user the series data connector", function() {
          expect(inbook.data.SeriesData).toHaveBeenCalled();
        });
      });
    });
  });

  describe("#friends", function() {
    beforeEach(function() {
      inbook.currentUser = new inbook.models.User();

      spyOn(inbook.views, "FriendsIndexView");
      spyOn(inbook.data, "FriendsDataConnector");

      router.friends();
    });

    it("should render a friends index view", function() {
      expect(inbook.views.FriendsIndexView).toHaveBeenCalled();
    });

    it("should user the friends data connector", function() {
      expect(inbook.data.FriendsDataConnector).toHaveBeenCalled();
    });
  });

  describe("#logout", function() {
    var request;

    beforeEach(function() {
      inbook.currentUser = new inbook.models.User({id: 4});
      spyOn(inbook.utils, "navigate");

      router.logout();

      request = mostRecentAjaxRequest();
    });

    it("should destroy the users session", function() {
      expect(request.method).toEqual("DELETE");
      expect(request.url).toEqual("/users/4.json");
    });

    it("should not route", function() {
      expect(inbook.utils.navigate).not.toHaveBeenCalled();
    });

    describe("on success", function() {
      beforeEach(function() {
        request.response({
          status: 200,
          responseText: '{}'
        });
      });

      it("should route to the index", function() {
        expect(inbook.utils.navigate).toHaveBeenCalledWith("/");
      });
    });
  });
});
