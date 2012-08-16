inbook.data.SocialDataConnector = function() {
  var defaultCounts = {
    posts: { count: 0 },
    comments: { count: 0 },
    likes: { count: 0 },
    type: {}
  };

  $.get(inbook.currentUser.url(true) + "/counts.json").
    success(function(data) {
      done(_({}).extend(data));
    }).
    error(function() {
      done(_({}).extend(defaultCounts));

      inbook.bus.trigger("social:data:error");
    });

  function done(counts) {
    counts.from = from(counts);

    inbook.data.counts = counts;
    inbook.bus.trigger("data:posts:counts:ready data:posts:types:ready");
  }

  function from(counts) {
    var from = _(counts.from).clone(),
        parsed = {};

    _(from).each(function(user) {
      parsed[user.graph_id] = user;

      delete user.graph_id;
    });

    return parsed;
  }
};
