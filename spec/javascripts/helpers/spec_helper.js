beforeEach(function() {
  $.fx.off = true;

  jasmine.Ajax.useMock();
  clearAjaxRequests();
  inbook.currentUser = {
    free: function() { return false; },
    url: function() { return "/thisurl"; }
  };

  inbook.data.counts = {};
  inbook.data.posts = {};
  inbook.data.series = { posts: {}, likes: {}, comments: {}};
});
