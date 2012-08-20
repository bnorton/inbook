describe("FriendsIndexView", function() {
  var view;

  beforeEach(function() {
    inbook.currentUser = new inbook.models.User({access_token: "abc123"});
    view = new inbook.views.FriendsIndexView();

    inbook.data.friends = {
      count: 540,
      added: [
        { graph_id: "444", name: "John D", link: "http://444.com" },
        { graph_id: "555", name: "Mark P", link: "http://555.com" }
      ],
      subtracted: [
        { graph_id: "222", name: "Josh R", link: "http://222.com" }
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
        expect(view.$el.find("#added a").length).toEqual(2);
      });

      it("should have the users images", function() {
        expect(view.$el.find("#added img:first").attr("src")).toMatch("444/picture");
        expect(view.$el.find("#added img:last").attr("src")).toMatch("555/picture");
      });

      it("should be the user", function() {
        expect(view.$el.find("#added img:first").attr("title")).toEqual("John D");
        expect(view.$el.find("#added img:last").attr("title")).toEqual("Mark P");
      });

      it("should link to the profile", function() {
        expect(view.$el.find("#added a:first").attr("href")).toEqual("http://444.com");
        expect(view.$el.find("#added a:first").attr("target")).toEqual("_blank");

        expect(view.$el.find("#added a:last").attr("href")).toEqual("http://555.com");
        expect(view.$el.find("#added a:last").attr("target") ).toEqual("_blank");
      });
    });

    describe("for the subtracted section", function() {
      it("should render the images", function() {
        expect(view.$el.find("#subtracted img").length).toEqual(1);
        expect(view.$el.find("#subtracted a").length).toEqual(1);
      });

      it("should have the users image", function() {
        expect(view.$el.find("#subtracted img:first").attr("src")).toMatch("222/picture");
      });

      it("should be the user", function() {
        expect(view.$el.find("#subtracted img:first").attr("title")).toEqual("Josh R");
      });

      it("should link to the profile", function() {
        expect(view.$el.find("#subtracted a:first").attr("href")).toEqual("http://222.com");
        expect(view.$el.find("#subtracted a:first").attr("target")).toEqual("_blank");
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
