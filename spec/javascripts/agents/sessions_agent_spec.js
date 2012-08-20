describe("SessionsAgent", function() {
  var user, agent;

  beforeEach(function() {
    user = new inbook.models.User();

    agent = new inbook.agents.SessionsAgent(user);
  });

  describe("#facebookLogin", function() {
    var authResponse, login, perms, getLoginStatus, api;

    beforeEach(function() {
      login = perms = getLoginStatus = api = undefined;
      authResponse = {authResponse: {accessToken: "abcd1234"}};

      spyOn(FB, "getLoginStatus").andCallFake(function(callback) {
        getLoginStatus = callback;
      });

      spyOn(FB, "login").andCallFake(function(callback, p) {
        login = callback;
        perms = p;
      });

      spyOn(FB, "api").andCallFake(function(path, callback) {
        api = {
          path: path,
          callback: callback
        };
      });

      agent.facebookLogin();
    });

    it("should not login", function() {
      expect(login).toBeUndefined();
    });

    it("should not hit the api", function() {
      expect(api).toBeUndefined();
    });

    it("should try to get login status", function() {
      expect(getLoginStatus).toBeDefined();
    });

    sharedExamplesFor("when facebook returns the user", function() {
      var user_attributes, facebook_user;

      beforeEach(function() {
        facebook_user = jasmine.createSpy("facebook:user");
        user.on("change:facebook:user", facebook_user);

        user_attributes = {
          id: 555,
          name: "John Doe",
          username: "johnny",
          birthday: "01/01/11",
          gender: "male",
          link: "http://facebook.com/johnny",
          email: "john@example.com"
        };

        api.callback(user_attributes);
      });

      it("should store the primary attributes on the user", function() {
        expect(user.get("graph_id")).toEqual(555);
        expect(user.get("email")).toEqual("john@example.com");
        expect(user.get("name")).toEqual("John Doe");
      });

      it("should store the additional attributes on the user", function() {
        expect(user.get("username")).toEqual("johnny");
        expect(user.get("gender")).toEqual("male");
        expect(user.get("link")).toEqual("http://facebook.com/johnny");
        expect(user.get("birthday")).toEqual("01/01/11");
      });

      it("should trigger the :facebook:user event", function() {
        expect(facebook_user).toHaveBeenCalled();
      });
    });

    describe("when the response has an authResponse", function() {
      describe("when the user is a free user", function() {
        beforeEach(function() {
          user.unset("paid");

          getLoginStatus(authResponse);
        });

        it("should request /me", function() {
          expect(api.path).toEqual("/me");
        });

        it("should store the attributes on the user", function() {
          expect(user.get("access_token")).toEqual("abcd1234");
        });

        itShouldBehaveLike("when facebook returns the user");
      });

      describe("when the user is a paid user", function() {
        var facebook_user;

        beforeEach(function() {
          facebook_user = jasmine.createSpy("facebook:user");
          user.on("change:facebook:user", facebook_user);

          user.set("paid", true);

          getLoginStatus(authResponse);
        });

        it("should not request /me", function() {
          expect(api).toBeUndefined();
        });

        it("should store the attributes on the user", function() {
          expect(user.get("access_token")).toEqual("abcd1234");
        });

        it("should trigger the :facebook:user event", function() {
          expect(facebook_user).toHaveBeenCalled();
        });
      });
    });

    describe("when the response does not have an auth response", function() {
      beforeEach(function() {
        getLoginStatus({});

      });

      it("should not hit the api", function() {
        expect(api).toBeUndefined();
      });

      it("should try to login", function() {
        expect(login).toBeDefined();
      });

      it("should have the right permissions", function() {
        expect(perms).toEqual({scope: "read_stream, read_requests, email, user_status, user_likes, user_photos, user_videos, user_location, user_relationships, user_likes, friends_location, friends_relationships, friends_likes"});
      });

      describe("when the user logs in", function() {
        beforeEach(function() {
          login(authResponse);
        });

        it("should request /me", function() {
          expect(api.path).toEqual("/me");
        });

        it("should store the access token on the user", function() {
          expect(user.get("access_token")).toEqual("abcd1234");
        });

        itShouldBehaveLike("when facebook returns the user");
      });
    });
  });
});
