inbook.models.User = (function() {
  return Backbone.Model.extend({
    urlRoot: "/users",

    url: function(skip) {
      var url = this.urlRoot;

      if (!this.isNew()) {
        url = url + "/" + encodeURIComponent(this.id);
      }

      if (!skip) {
        url = url + ".json";
      }
      return url;
    },

    free: function() {
      return !this.get("paid");
    },

    profileImage: function(type) {
      type || (type = "large");

      var id = this.get("graph_id"),
          token = this.get("access_token");

      return "https://graph.facebook.com/" + id + "/picture?return_ssl_resources=1&access_token=" + token + "&type=" + type;
    }
  });
}());

inbook.models.User.profileImage = function(id) {
  var token = inbook.currentUser.get("access_token");

  return "https://graph.facebook.com/" + id + "/picture?return_ssl_resources=1&access_token=" + token + "&type=large";
};
