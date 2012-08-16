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
    var counts, count, types;

    beforeEach(function() {
      counts = getRequest("counts.json");

      count = jasmine.createSpy("count");
      types = jasmine.createSpy("types");

      inbook.bus.on("data:posts:counts:ready", count);
      inbook.bus.on("data:posts:types:ready", types);
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
            likes: { count: 3 },
            type: { photo: 9, video: 3, status: 12 },
            from: [
              { name: "brian", graph_id: "5", count: 9 },
              { name: "john", graph_id: "2", count: 3 }
            ]
          })
        });
      });

      it("should set the counts into the global data set", function() {
        expect(inbook.data.counts).toEqual({
          posts: { count: 13 },
          comments: { count: 5 },
          likes: { count: 3 },
          type: {
            video: 3,
            photo: 9,
            status: 12
          },
          from: {
            2: { name: "john", count: 3 },
            5: { name: "brian", count: 9 }
          }
        });
      });

      it("should trigger the :posts:counts:ready event", function() {
        expect(count).toHaveBeenCalled();
      });

      it("should trigger the :posts:types:ready event", function() {
        expect(types).toHaveBeenCalled();
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
          likes: { count: 0 },
          type: {},
          from: {}
        });
      });

      it("should trigger the :posts:counts:ready event", function() {
        expect(count).toHaveBeenCalled();
      });

      it("should trigger the :posts:types:ready event", function() {
        expect(types).toHaveBeenCalled();
      });

      it("should error", function() {
        expect(error).toHaveBeenCalled()
      });
    });
  });
});
