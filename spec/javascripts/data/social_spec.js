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
    var counts, count, types, who;

    beforeEach(function() {
      counts = getRequest("counts.json");

      count = jasmine.createSpy("count");
      types = jasmine.createSpy("types");
      who = jasmine.createSpy("who");

      inbook.bus.on("data:posts:counts:ready", count);
      inbook.bus.on("data:posts:types:ready", types);
      inbook.bus.on("data:posts:who:ready", who);
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
            posts: {
              count: 13,
              type: { photo: 9, video: 3, status: 12 }
            },
            comments: {
              count: 5,
              name: { mike: 3, jay: 6 }
            },
            likes: {
              count: 3,
              name: { joey: 9, george: 12 }
            },
            from: [
              { name: "brian", graph_id: "5", count: 9 },
              { name: "john", graph_id: "2", count: 3 }
            ]
          })
        });
      });

      it("should set the counts into the global data set", function() {
        expect(inbook.data.counts).toEqual({
          posts: {
            count: 13,
            type: { video: 3, photo: 9, status: 12 }
          },
          comments: {
            count: 5,
            name: { mike: 3, jay: 6 }
          },
          likes: {
            count: 3,
            name: { joey: 9, george: 12 }},
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

      it("should trigger the :posts:who:ready event", function() {
        expect(who).toHaveBeenCalled();
      });

      describe("for the global dataset", function() {
        describe("for the types data", function() {
          it("should format the post data", function() {
            expect(inbook.data.posts.types).toEqual([
              {
                label: "photo",
                value: 9
              },
              {
                label: "video",
                value: 3
              },
              {
                label: "status",
                value: 12
              }
            ]);
          });
        });

        describe("for the name data", function() {
          it("should format the comment data", function() {
            expect(inbook.data.comments.names).toEqual([
              {
                label: "jay",
                value: 6
              },
              {
                label: "mike",
                value: 3
              }
            ]);
          });
        });

        describe("for the name data", function() {
          it("should format the like data", function() {
            expect(inbook.data.likes.names).toEqual([
              {
                label: "george",
                value: 12
              },
              {
                label: "joey",
                value: 9
              }
            ]);
          });
        });

        describe("for the 'who is posting' data", function() {
          it("should format the post data", function() {
            expect(inbook.data.posts.who).toEqual([
              {
                label: "brian",
                value: 9
              },
              {
                label: "john",
                value: 3
              }
            ]);
          });
        });
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
          posts: { count: 0, type: {} },
          comments: { count: 0, name: {} },
          likes: { count: 0, name: {}  },
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
