describe("UsersNavigationView", function() {
  var view, user;

  beforeEach(function() {
    user = new inbook.models.User({id: 4, graph_id: "44", access_token: "abc", name: "John Doe 4"});
    view = new inbook.views.UsersNavigationView({model: user});
  });

  it("should render the view", function() {
    expect(view.$el.find("img").attr("src")).toEqual(user.profileImage("square"));
    expect(view.$el.find(".name").text()).toEqual("John Doe 4");
    expect(view.$el.find(".dropdown")).toHaveClass("hidden");
    expect(view.$el.find(".items")).toExistIn(view.$el);
  });

  it("should have the dropdown items", function() {
    expect(view.$el.find(".item").length).toEqual(5);

    expect(view.$el.find(".item:eq(0)")).toHaveText(I18n.t("users.navigation.account"));
    expect(view.$el.find(".item:eq(1)").text()).toEqual(I18n.t("users.navigation.settings"));
    expect(view.$el.find(".item:eq(2)").text()).toEqual(I18n.t("users.navigation.dashboard"));
    expect(view.$el.find(".item:eq(3)").text()).toEqual(I18n.t("users.navigation.friends"));
    expect(view.$el.find(".item:eq(4)").text()).toEqual(I18n.t("users.navigation.logout"));
  });

  describe("when clicking on the view", function() {
    var event;
    beforeEach(function() {
      event = jasmine.createSpyObj("Event", ["stopPropagation"]);

      view.toggleDropdown(event);
    });

    it("should stop event propagation", function() {
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it("should show the dropdown", function() {
      expect(view.$el.find(".dropdown")).not.toHaveClass("hidden");
    });
  });

  describe("when clicking on an items", function() {
    var event;

    beforeEach(function() {
      event = jasmine.createSpy("Event");
      spyOn(Backbone.history, "navigate");

      view.$el.find(".dropdown").removeClass("hidden");
    });

    _(["account", "settings", "dashboard", "friends", "logout"]).each(function(action) {
      it("should route to " + action, function() {
        event.currentTarget = view.$el.find(".item[data-type='" + action + "']");
        view.dropdown(event);

        expect(Backbone.history.navigate).toHaveBeenCalledWith("/#!/" + action, {trigger: true});
      });

      it("should close the dropdown for " + action, function() {
        event.currentTarget = view.$el.find(".item[data-type='" + action + "']");
        view.dropdown(event);

        expect(view.$el.find(".dropdown")).toHaveClass("hidden");
      });
    })
  });
});
