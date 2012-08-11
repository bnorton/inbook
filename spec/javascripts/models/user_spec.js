describe("User", function() {
  var user;

  beforeEach(function() {
    user = new inbook.models.User({graph_id: "44", access_token: "abc", name: "Brian Norton"});
  });

  it("should be a model", function() {
    expect(user.get("name")).toEqual("Brian Norton");
  });

  describe("#profileImage", function() {
    it("should be https", function() {
      expect(user.profileImage()).toMatch("https");
    });

    it("should be the graph", function() {
      expect(user.profileImage()).toMatch("graph.facebook.com");
    });

    it("should be the users picture", function() {
      expect(user.profileImage()).toMatch("44\/picture");
    });

    it("should default to large", function() {
      expect(user.profileImage()).toMatch("type=large");
    });

    _(["small", "large"]).each(function(type) {
      it("should be " + type, function() {
        expect(user.profileImage(type)).toMatch("type=" + type);
      });
    })
  });
});
