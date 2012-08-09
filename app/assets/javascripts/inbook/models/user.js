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
    }
  });
}());
