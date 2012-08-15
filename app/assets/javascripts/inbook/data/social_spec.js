inbook.data.SocialDataConnector = function() {
  var defaultCounts = {
    posts: { count: 0 },
    comments: { count: 0 },
    likes: { count: 0 }
  };

  $.get(inbook.currentUser.url(true) + "/counts.json").
    success(function(data) {
      done(_({}).extend(data));
    }).
    error(function() {
      done(defaultCounts);

      inbook.bus.trigger("social:data:error");
    });

  function done(counts) {
    inbook.data.counts = counts;
    inbook.bus.trigger("data:posts:counts:ready");
  }
};
