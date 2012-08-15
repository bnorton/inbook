describe("SocialDataConnector", function() {
  var social, counts, getRequest = function(url) {
    return _(ajaxRequests).find(function(req) {
      return (new RegExp(url)).test(req.url);
    })
  };

  beforeEach(function() {
    delete inbook.data.counts;

    inbook.currentUser = new inbook.models.User({id : 12});
    social = new inbook.data.SocialDataConnector();
  });

  describe("aggregate counts", function() {
    var ready;

    beforeEach(function() {
      counts = getRequest("counts.json");

      ready = jasmine.createSpy("ready");
      inbook.bus.on("data:posts:counts:ready", ready);
    });

    it("should GET /users/:id/counts.json", function() {
      expect(counts.method).toEqual("GET");
      expect(counts.url).toEqual("/users/12/counts.json");
    });

    describe("on success", function() {
      beforeEach(function() {
        counts.response({
          status: 200,
          responseText: JSON.stringify({
            posts: { count: 13 },
            comments: { count: 5 },
            likes: { count: 3 }
          })
        });
      });

      it("should set the counts into the global data set", function() {
        expect(inbook.data.counts).toEqual({
          posts: { count: 13 },
          comments: { count: 5 },
          likes: { count: 3 }
        });
      });

      it("should trigger the :posts:counts:ready event", function() {
        expect(ready).toHaveBeenCalled();
      });
    });

    describe("on error", function() {
      var error;

      beforeEach(function() {
        error = jasmine.createSpy("error");
        inbook.bus.on("social:data:error", error);

        counts.response({
          status: 404
        });
      });

      it("should set the counts to 0", function() {
        expect(inbook.data.counts).toEqual({
          posts: { count: 0 },
          comments: { count: 0 },
          likes: { count: 0 }
        });
      });

      it("should trigger the :posts:counts:ready event", function() {
        expect(ready).toHaveBeenCalled();
      });

      it("should error", function() {
        expect(error).toHaveBeenCalled()
      });
    });
  });
});
