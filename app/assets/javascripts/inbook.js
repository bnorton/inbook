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
    permissions: {scope: "read_stream, user_checkins, user_likes, user_photos"}
  }
};

inbook.bus = _.extend({}, Backbone.Events);
