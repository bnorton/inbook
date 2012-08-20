//= require_self
//= require_tree ./inbook/templates
//= require ./inbook/views/graphs/types_view
//= require ./inbook/views/graphs/who_view
//= require inbook/routers/application_router
//= require inbook/models/user

inbook = {
  data: {
    posts: {},
    friends: {}
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
    permissions: {scope: "read_stream, read_requests, user_status, user_likes, user_photos, user_videos, email, user_location, friends_location"},
    _ready: {},
    ready: function() { return !!inbook.settings._ready.facebook; }
  }
};

inbook.bus = _.extend({}, Backbone.Events);
