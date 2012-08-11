//= require_self
//=require inbook/routers/application_router
//=require inbook/models/user

inbook = {
  collections: {},
  models: {},
  views: {},
  agents: {},
  utils: {},
  routers: {},
  settings: {
    permissions: {scope: "read_stream, read_requests, user_status, user_likes, user_photos, user_videos, email"},
    _ready: {},
    ready: function() { return inbook.settings._ready.facebook && inbook.settings._ready.google; }
  }
};

inbook.bus = _.extend({}, Backbone.Events);
