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

    it("should not have the password view", function() {
      expect(view.$el.find("#password")).toHaveClass("hidden");
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
      view.render();
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
            name: "John Doe 3"
          })
        });
      });

      it("should set the current user", function() {
        expect(inbook.currentUser.id).toEqual(3);
        expect(inbook.currentUser.get("name")).toEqual("John Doe 3");
      });

      it("should navigate to the dashboard", function() {
        expect(inbook.utils.navigate).toHaveBeenCalledWith("/#!/dashboard");
      });

      it("should clear the view", function() {
        expect(view.$el.html()).toEqual("");
      });
    });

    describe("on error", function() {
      var event;

      describe("when the user exists", function() {
        beforeEach(function() {
          clearAjaxRequests();
          spyOn(inbook.utils, "navigate");

          request.response({
            status: 401,
            responseText: JSON.stringify({
              id: 3,
              name: "John Doe 3"
            })
          });
        });

        it("should set the current user", function() {
          expect(inbook.currentUser.id).toEqual(3);
          expect(inbook.currentUser.get("name")).toEqual("John Doe 3");
        });

        it("should show the password field", function() {
          expect(view.$el.find("#password")).not.toHaveClass("hidden");
          expect(view.$el.find("#password form").length).not.toEqual(0);
          expect(view.$el.find("#password form input[type='text']").length).not.toEqual(0);
          expect(view.$el.find("#password form input[type='submit']").length).not.toEqual(0);
          expect(view.$el.find("#password input[type='submit']").val()).toEqual(I18n.t("buttons.submit"));
        });

        it("should not navigate to the dashboard", function() {
          expect(inbook.utils.navigate).not.toHaveBeenCalled();
        });

        describe("when submitting with a password", function() {
          beforeEach(function() {
            event = jasmine.createSpyObj("Event", ["stopPropagation", "preventDefault"]);

            view.$el.find("#password form input[type='text']").val("password");

            view.submitPassword(event);
            request = mostRecentAjaxRequest();
          });

          it("should prevent the default form submission behavior", function() {
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopPropagation).toHaveBeenCalled();
          });

          it("should save the password", function() {
            expect(request.method).toEqual("PUT");
            expect(request.url).toEqual("/users/3.json");
            expect(JSON.parse(request.params)).toEqual({
              id: 3,
              name: "John Doe 3",
              password: "password",
              graph_id: 321,
              access_token: "abc123"});
          });

          describe("on success", function() {
            beforeEach(function() {
              request.response({
                status: 200,
                responseText: JSON.stringify({
                  id: 3,
                  name: "John Doe 3"
                })
              });
            });

            it("should navigate to the dashboard", function() {
              expect(inbook.utils.navigate).toHaveBeenCalledWith("/#!/dashboard");
            });

            it("should clear the view", function() {
              expect(view.$el.html()).toEqual("");
            });
          });
        });
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
