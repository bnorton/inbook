inbook.views.DashboardIndexView = (function() {
  var makeRequest = function(view, url) {
    var posts = {
        count: 0 ,
        from: {},
        to: {},
        type: {},
        application: {}
      },
      comments = {
        count: 0
      },
      likes = {
        count: 0
      };

    view.model.set({
      posts: posts,
      comments: comments,
      likes: likes
    });

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

        view.model.trigger("change:counts");
      });

      view.model.trigger("change:counts:complete");
    });
  };

  return Backbone.View.extend({
    template: JST["inbook/templates/dashboards/index"],

    initialize: function() {
      _.bindAll(this, "render", "updateCounts", "renderCharts");

      var that = this,
        url = "/me/feed?limit=1000&access_token=" + inbook.currentUser.get("access_token");

      inbook.bus.on("google:ready", function() {
        that.googleReady = true;
      });

      inbook.bus.on("fb:ready", function() {
        makeRequest(that, url);
      });

      that.model.on("change:counts", that.updateCounts);
      that.model.on("change:counts:complete", that.renderCharts);

      that.render();
    },

    render: function() {
      this.$el.html(this.template());
    },

    updateCounts: function() {
      var $posts = this.$el.find("#posts .count"),
          $comments = this.$el.find("#comments .count"),
          $likes = this.$el.find("#likes .count");

      $posts.html(this.model.get("posts").count);
      $comments.html(this.model.get("comments").count);
      $likes.html(this.model.get("likes").count);
    },

    renderCharts: function() {
      renderTypesChart(this.$el, this.model);

      renderItemsChart(this.$el, this.model, "from");
      renderItemsChart(this.$el, this.model, "to");
    }
  });

  function renderTypesChart($el, model) {
    var types = model.get("posts").type,
        array = _(_(types).keys()).map(function(type) {
          return [type, types[type]];
        }),
        options = { colors: ["#FB2A04", "#FB8304", "#08789D", "#03B840"], backgroundColor: "white" };

    array.unshift(["Post Type", "Count"]);

    var data = google.visualization.arrayToDataTable(array);
    (new google.visualization.PieChart($el.find("#types .chart")[0])).draw(data, options);
  }

  function renderItemsChart($el, model, key) {
    var graph_id = inbook.currentUser.get("graph_id"),
        items = model.get("posts")[key],
        array = _(_(items).keys()).map(function(from) {
          return [items[from].name, items[from].count];
        }),
        options = { colors: ["#08789D"], backgroundColor: "white"};

    array = _(_(_(array).sortBy(function(item) {
      return item[1];
    })).reverse()).slice(0,11);

    array = _(array).reject(function(item) {
      return items[graph_id] && items[graph_id].name === item[0];
    });

    array.unshift([
      I18n.t("dashboards.index." + key + ".user"),
      I18n.t("dashboards.index." + key + ".number_of_posts")
    ]);

    var data = google.visualization.arrayToDataTable(array);
    (new google.visualization.BarChart($el.find("#" + key + " .chart")[0])).draw(data, options);
  }
}());
