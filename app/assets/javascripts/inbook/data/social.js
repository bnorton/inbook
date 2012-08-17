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
    inbook.data.counts = counts;

    types(counts);
    from(counts);

    _(["counts", "types", "who"]).each(function(type) {
      inbook.bus.trigger("data:posts:" + type + ":ready")
    });
  }

  function types(counts) {
    var types = _(counts.type).clone();

    inbook.data.posts.types = _(_(types).
      keys()).
      map(function(type) {
        return {
          label: type,
          value: types[type]
        }
      }
    );
  }

  function from(counts) {
    var from = _(counts.from).clone(),
        parsed = {};

    _(from).each(function(user) {
      parsed[user.graph_id] = user;

      delete user.graph_id;
    });

    inbook.data.counts.from = parsed;

    inbook.data.posts.who =_(_(_(from).
      sortBy(function(item) {
        return item.count;
      })).
      reverse()).
      map(function(item) {
        return {
          label: item.name,
          value: item.count
        }
      });
  }
};
