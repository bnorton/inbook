inbook.data.SocialDataConnector = function() {
  var defaultCounts = {
    posts: { count: 0, type: {} },
    comments: { count: 0, name: {} },
    likes: { count: 0, name: {} }
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
    names(counts);

    _(["counts", "types", "who"]).each(function(type) {
      inbook.bus.trigger("data:posts:" + type + ":ready")
    });
  }

  function types(counts) {
    var types = _(counts.posts.type).clone();

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

  function names(counts) {
    _(["comments", "likes"]).each(function(type) {
      var names = _(counts[type].name).clone();

      inbook.data[type].names = _(_(_(_(names).
        keys()).
        map(function(name) {
          return {
            label: name,
            value: names[name]
          }
        })).
        sortBy(function(name) {
          return name.value;
        })).
        reverse();
    });
  }
};
