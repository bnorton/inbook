inbook.data.FacebookDataConnector = function() {
  var url = "/me/feed?limit=1000&access_token=" + inbook.currentUser.get("access_token"),
      posts = {
        count: 0,
        from: {},
        to: {},
        type: {},
        application: {}
      },
      comments = { count: 0 },
      likes = { count: 0 };

  inbook.data.counts = {
    posts: posts,
    comments: comments,
    likes: likes
  };

  if(inbook.settings.ready()) {
    api();
  } else {
    inbook.bus.on("fb:ready", api);
  }

  function api() {
    FB.api(url, function(response) {
      var data = response.data;

      if(!data) {
        inbook.bus.trigger("fb:error:auth");
        return;
      } else if(!data.length > 0) {
        return;
      }

      _(data).each(function(post) {
        var to = post.to && post.to.data;

        posts.count += 1;

        if(post.comments) {
          comments.count += post.comments.count;
        }

        if(post.likes) {
          likes.count += post.likes.count;
        }

        posts.from[post.from.id] || (posts.from[post.from.id] = {count: 0, name: post.from.name});
        posts.from[post.from.id].count += 1;


        if(to) {
          _(to).each(function(user) {
            posts.to[user.id] || (posts.to[user.id] = {count: 0, name: user.name});
            posts.to[user.id].count += 1;
          });
        }

        posts.type[post.type] || (posts.type[post.type] = 0);
        posts.type[post.type] += 1;

        if(post.application) {
          posts.application[post.application.id] || (posts.application[post.application.id] = {count: 0, name: post.application.name});
          posts.application[post.application.id].count += 1;
        }

      });

      buildTypesData();
      buildPostingData();

      inbook.bus.trigger("data:posts:counts:ready");
    });
  }

  function buildTypesData() {
    var types = inbook.data.counts.posts.type;

    inbook.data.posts.types = _(_(types).keys())
      .map(function(type) {
        return {
          label: type,
          value: types[type]
        }
      }
    );

    inbook.bus.trigger("data:posts:types:ready");
  }

  function buildPostingData() {
    var graph_id = inbook.currentUser.get("graph_id"),
      items = inbook.data.counts.posts.from,
      array = _(_(items).keys()).map(function(item) {
        return {
          label: items[item].name,
          value: items[item].count
        }
      });

    array = _(array).reject(function(item) {
      return items[graph_id] && items[graph_id].name === item.label;
    });

    inbook.data.posts.who = _(_(_(_(array).sortBy(function(item) {
      return item.value;
    })).reverse()).slice(0,10)).reverse();

    inbook.bus.trigger("data:posts:who:ready");
  }
};
