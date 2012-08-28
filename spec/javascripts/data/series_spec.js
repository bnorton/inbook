describe("SeriesData", function() {
  var data, request;

  beforeEach(function() {
    inbook.currentUser = new inbook.models.User({id: 4});
    data = new inbook.data.SeriesData();

    request = mostRecentAjaxRequest();
  });

  it("should GET /users/:id/series.json", function() {
    expect(request.method).toEqual("GET");
    expect(request.url).toEqual("/users/4/series.json");
  });

  describe("on success", function() {
    var posts, likes, comments;

    beforeEach(function() {
      posts = jasmine.createSpy("posts");
      likes = jasmine.createSpy("likes");
      comments = jasmine.createSpy("comments");

      inbook.bus.on("data:series:posts:ready", posts);
      inbook.bus.on("data:series:likes:ready", likes);
      inbook.bus.on("data:series:comments:ready", comments);

      request.response({
        status: 200,
        responseText: JSON.stringify({
          posts: {
            "2012-07-28T00:00:00Z": 4,
            "2012-08-11T00:00:00Z": 3
          },
          likes: {
            "2012-07-28T00:00:00Z": 14,
            "2012-08-11T00:00:00Z": 23
          }
        })
      });
    });

    it("should set the series data", function() {
      expect(inbook.data.series).toEqual({
        posts: {
          week: {
            "2012-07-28T00:00:00Z": 4,
            "2012-08-11T00:00:00Z": 3
          }
        },
        likes: {
          week: {
            "2012-07-28T00:00:00Z": 14,
            "2012-08-11T00:00:00Z": 23
          }
        },
        comments: {}
      });
    });

    it("should trigger the posts:ready event", function() {
      expect(posts).toHaveBeenCalled();
    });

    it("should trigger the likes:ready event", function() {
      expect(likes).toHaveBeenCalled();
    });

    it("should trigger the comments:ready event", function() {
      expect(comments).toHaveBeenCalled();
    });
  });
});
