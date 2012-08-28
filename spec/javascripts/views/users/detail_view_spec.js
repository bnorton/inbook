describe("UserDetailView", function() {
  var view, user;

  beforeEach(function() {
    user = new inbook.models.User({name: "Brian Norton", location_name: "San Francisco", updated_time: "2012-08-25T18:30:32Z"});
    view = new inbook.views.UserDetailView({model: user});
  });

  describe("#render", function() {
    beforeEach(function() {
      view.render();
    });

    it("should have the profile image", function() {
      expect(view.$el.find("img").attr("src")).toEqual(user.profileImage());
    });

    it("should have the name", function() {
      expect(view.$el.find(".name")).toHaveText("Brian Norton");
    });

    it("should have the location", function() {
      expect(view.$el.find(".location")).toHaveText("San Francisco");
    });

    it("should have the last update", function() {
      expect(view.$el.find(".since").text()).toMatch(I18n.l("date.formats.human", "2012-08-25T18:30:32Z"));
    });
  });
});
