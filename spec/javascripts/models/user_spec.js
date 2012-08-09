describe("User", function() {
  var user;

  beforeEach(function() {
    user = new inbook.models.User({name: "Brian Norton"});
  });

  it("should be a model", function() {
    expect(user.get("name")).toEqual("Brian Norton");
  });
});
