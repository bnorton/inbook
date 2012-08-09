describe("SessionsNewView", function() {
  var view, user;

  beforeEach(function() {
    user = new inbook.models.User();
    view = new inbook.views.SessionsNewView({user: user});
  });

  describe("#render", function() {
    var $content;

    beforeEach(function() {
      $content = view.render().$el;
    });

    it("should render the view", function() {
      expect($content.find("#title").text()).toMatch(I18n.t("sessions.new.title"))
    });

    it("should have the submit button", function() {
      expect(view.$el.find("input[type='submit']").val()).toEqual(I18n.t("buttons.auth_with_facebook"));
    });
  });

  describe("#submit", function() {
    var event;

    beforeEach(function() {
      event = jasmine.createSpyObj("Event", ["stopPropagation", "preventDefault"]);
      spyOn(view.agent, "facebookLogin");

      view.submit(event);
    });

    it("should prevent the default form submission behavior", function() {
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it("should login with facebook", function() {
      expect(view.agent.facebookLogin).toHaveBeenCalled();
    });
  });

  describe("when login completes", function() {
    var request;

    beforeEach(function() {
      user.set({
        graph_id: 321,
        access_token: "abc123"
      });

      user.trigger("change:facebook:user");

      request = mostRecentAjaxRequest();
    });

    it("should POST to /users.json", function() {
      expect(request.method).toEqual("POST");
      expect(request.url).toEqual("/users.json");
      expect(JSON.parse(request.params)).toEqual({graph_id: 321, access_token: "abc123"});
    });

    describe("on success", function() {
      beforeEach(function() {
        spyOn(inbook.utils, "navigate");

        request.response({
          status: 200,
          responseText: JSON.stringify({
            id: 3,
            name: "John Doe"
          })
        });
      });

      it("should navigate to the dashboard", function() {
        expect(inbook.utils.navigate).toHaveBeenCalledWith("/#!/dashboard");
      });
    });
  });

  describe("on facebook error", function() {
    beforeEach(function() {
      spyOn(view.agent, "facebookLogin");

      inbook.bus.trigger("fb:error:auth");
    });

    it("should login", function() {
      expect(view.agent.facebookLogin).toHaveBeenCalled();
    });
  });
});
