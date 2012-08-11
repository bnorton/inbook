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

    profileImage: function(type) {
      type || (type = "large");

      var id = this.get("graph_id"),
          token = this.get("access_token");

      return "https://graph.facebook.com/" + id + "/picture?return_ssl_resources=1&access_token=" + token + "&type=" + type;
    }
  });
}());
