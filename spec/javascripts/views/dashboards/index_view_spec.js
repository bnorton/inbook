describe("DashboardsIndexView", function() {
  var view, user;

  beforeEach(function() {
    inbook.data.counts = {
      posts: { count: 3 },
      comments: { count: 7 },
      likes: { count: 17 }
    };

    user = new inbook.models.User();
    view = new inbook.views.DashboardIndexView({model: user});

    inbook.bus.trigger("data:posts:counts:ready");
  });

  it("should render the posts", function() {
    expect(view.$el.find("#posts h2").text()).toMatch(I18n.t("dashboards.index.posts.title"));
    expect(view.$el.find("#posts").attr("title")).toEqual(I18n.t("dashboards.index.posts.description"));
  });

  it("should render the comments", function() {
    expect(view.$el.find("#comments h2").text()).toMatch(I18n.t("dashboards.index.comments.title"));
    expect(view.$el.find("#comments").attr("title")).toEqual(I18n.t("dashboards.index.comments.description"));
  });

  it("should render the likes", function() {
    expect(view.$el.find("#likes h2").text()).toMatch(I18n.t("dashboards.index.likes.title"));
    expect(view.$el.find("#likes").attr("title")).toEqual(I18n.t("dashboards.index.likes.description"));
  });

  it("should render the posts count", function() {
    expect(view.$el.find("#posts h4").text()).toMatch("3");
  });

  it("should render the comments count", function() {
    expect(view.$el.find("#comments h4").text()).toMatch("7");
  });

  it("should render the likes count", function() {
    expect(view.$el.find("#likes h4").text()).toMatch("17");
  });

  describe("when the counts change", function() {
    beforeEach(function() {
      inbook.data.counts.posts.count = 9;
      inbook.data.counts.comments.count = 10;
      inbook.data.counts.likes.count = 11;

      inbook.bus.trigger("data:posts:counts:changed");
    });

    it("should update the posts count", function() {
      expect(view.$el.find("#posts h4").text()).toMatch("9");
    });

    it("should update the comments count", function() {
      expect(view.$el.find("#comments h4").text()).toMatch("10");
    });

    it("should update the likes count", function() {
      expect(view.$el.find("#likes h4").text()).toMatch("11");
    });
  });
});
