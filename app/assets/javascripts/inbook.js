//= require_self
//= require_tree ./inbook/templates
//= require ./inbook/views/graphs/types_view
//= require ./inbook/views/graphs/who_view
//= require inbook/routers/application_router
//= require inbook/models/user

inbook = {
  data: {
    posts: {},
    comments: {},
    likes: {},
    friends: {},
    series: {
      posts: { week: {} },
      likes: { week: {} },
      comments: { week: {} }
    }
  },
  collections: {},
  models: {},
  views: {
    graphs: {}
  },
  agents: {},
  utils: {},
  routers: {},
  settings: {
    permissions: {scope: "read_stream, read_requests, email, user_status, user_likes, user_photos, user_videos, user_location, user_relationships, user_likes, user_birthday, friends_location, friends_relationships, friends_likes, friends_birthday"},
    _ready: {},
    ready: function() { return !!inbook.settings._ready.facebook; }
  }
};

inbook.bus = _.extend({}, Backbone.Events);
