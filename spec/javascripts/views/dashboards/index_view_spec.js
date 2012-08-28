describe("DashboardsIndexView", function() {
  var view, user;

  beforeEach(function() {
    inbook.data.counts = {
      posts: { count: 3 },
      comments: { count: 7 },
      likes: { count: 17 }
    };

    spyOn(inbook.views, "LineChartView");

    user = new inbook.models.User();
    view = new inbook.views.DashboardIndexView({model: user});
  });

  describe("#render", function() {
    beforeEach(function() {
      view.render();
    });

    it("should render a user", function() {
      expect(view.$el.find("#user").html()).toEqual((new inbook.views.UserDetailView({model: user})).render().$el.html());
    });

    it("should render the posts", function() {
      expect(view.$el.find("tr th:eq(0)").text()).toMatch(I18n.t("dashboards.index.posts.title"));
      expect(view.$el.find("tr th:eq(0)").attr("title")).toEqual(I18n.t("dashboards.index.posts.description"));
    });

    it("should render the likes", function() {
      expect(view.$el.find("tr th:eq(1)").text()).toMatch(I18n.t("dashboards.index.likes.title"));
      expect(view.$el.find("tr th:eq(1)").attr("title")).toEqual(I18n.t("dashboards.index.likes.description"));
    });

    it("should render the comments", function() {
      expect(view.$el.find("tr th:eq(2)").text()).toMatch(I18n.t("dashboards.index.comments.title"));
      expect(view.$el.find("tr th:eq(2)").attr("title")).toEqual(I18n.t("dashboards.index.comments.description"));
    });

    it("should render the default count", function() {
      expect(view.$el.find(".count.posts").text()).toMatch("0");
      expect(view.$el.find(".count.likes").text()).toMatch("0");
      expect(view.$el.find(".count.comments").text()).toMatch("0");
    });

    describe("when the data is ready", function() {
      beforeEach(function() {
        inbook.bus.trigger("data:posts:counts:ready");
      });

      it("should render the posts count", function() {
        expect(view.$el.find(".count.posts").text()).toMatch("3");
      });

      it("should render the likes count", function() {
        expect(view.$el.find(".count.likes").text()).toMatch("17");
      });

      it("should render the comments count", function() {
        expect(view.$el.find(".count.comments").text()).toMatch("7");
      });

      describe("when the counts change", function() {
        beforeEach(function() {
          inbook.data.counts.posts.count = 9;
          inbook.data.counts.comments.count = 10;
          inbook.data.counts.likes.count = 11;

          inbook.bus.trigger("data:posts:counts:changed");
        });

        it("should render the posts count", function() {
          expect(view.$el.find(".count.posts").text()).toMatch("9");
        });

        it("should render the likes count", function() {
          expect(view.$el.find(".count.likes").text()).toMatch("11");
        });

        it("should render the comments count", function() {
          expect(view.$el.find(".count.comments").text()).toMatch("10");
        });
      });
    });
  });

  describe("preview charts", function() {
    var findCall = function(items, thing) {
      return _(items).find(function(item) {
        return item.args[0].type === thing;
      });
    };

    _(["posts", "likes", "comments"]).each(function(type) {
      describe("for the posts chart", function() {
        var call;

        beforeEach(function() {
          var calls = inbook.views.LineChartView.calls;
          call = findCall(calls, type);
        });

        it("should make a new line chart", function() {
          expect(call).toBeTruthy();
        });

        it("should declare a type", function() {
          expect(call.args[0].type).toEqual(type);
        });
      });
    });
  });
});
