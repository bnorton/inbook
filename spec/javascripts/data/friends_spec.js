describe("FriendsDataConnector", function() {
  var data, request;

  beforeEach(function() {
    inbook.currentUser = new inbook.models.User({id :12});
    data = new inbook.data.FriendsDataConnector();

    request = mostRecentAjaxRequest();
  });

  it("should GET /users/:id/friends.json", function() {
    expect(request.method).toEqual("GET");
    expect(request.url).toEqual("/users/12/friends.json");
  });

  describe("on success", function() {
    var ready;

    beforeEach(function() {
      ready = jasmine.createSpy("ready");
      inbook.bus.on("data:friends:ready", ready);

      request.response({
        status: 200,
        responseText: JSON.stringify({
          count: 55,
          added: [{ graph_id: "111", name: "John D" }],
          subtracted: [{ graph_id: "222", name: "John R" }]
        })
      });
    });

    it("should store the data", function() {
      expect(inbook.data.friends).toEqual({
        count: 55,
        added: [{ graph_id: "111", name: "John D" }],
        subtracted: [{ graph_id: "222", name: "John R" }]
      });
    });

    it("should trigger the friends:ready", function() {
      expect(ready).toHaveBeenCalled();
    });
  });

  describe("#setDate", function() {
    beforeEach(function() {
      data.setDate("START", "END");
      data.fetch();

      request = mostRecentAjaxRequest();
    });

    it("should send the start and end dates", function() {
      expect(request.url).toMatch("start=START");
      expect(request.url).toMatch("end=END");
    });
  });
});
