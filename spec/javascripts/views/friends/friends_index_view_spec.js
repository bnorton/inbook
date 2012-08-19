describe("FriendsIndexView", function() {
  var view;

  beforeEach(function() {
    inbook.currentUser = new inbook.models.User({access_token: "abc123"});
    view = new inbook.views.FriendsIndexView();

    inbook.data.friends = {
      count: 540,
      added: [
        { graph_id: "444", name: "John D" },
        { graph_id: "555", name: "Mark P" }
      ],
      subtracted: [
        { graph_id: "222", name: "Josh R" }
      ]
    };
  });

  describe("#render", function() {
    beforeEach(function() {
      view.render();
    });

    it("should render the friends count", function() {
      expect(view.$el.find(".count").text()).toEqual("540")
    });

    describe("for the added section", function() {
      it("should render the images", function() {
        expect(view.$el.find("#added img").length).toEqual(2);
      });

      it("should have the users images", function() {
        expect(view.$el.find("#added img:first").attr("src")).toMatch("444/picture");
        expect(view.$el.find("#added img:last").attr("src")).toMatch("555/picture");
      });
    });

    describe("for the subtracted section", function() {
      it("should render the images", function() {
        expect(view.$el.find("#subtracted img").length).toEqual(1);
      });

      it("should have the users image", function() {
        expect(view.$el.find("#subtracted img:first").attr("src")).toMatch("222/picture");
      });
    });
  });

  describe("when friend data is ready", function() {
    beforeEach(function() {
      view.render();

      inbook.data.friends.added = [
        { graph_id: "999", name: "New User" }
      ];

      inbook.bus.trigger("data:friends:ready");
    });

    it("should render the images", function() {
      expect(view.$el.find("#added img").length).toEqual(1);
    });

    it("should have the users images", function() {
      expect(view.$el.find("#added img:first").attr("src")).toMatch("999/picture");
    });
  });
});
