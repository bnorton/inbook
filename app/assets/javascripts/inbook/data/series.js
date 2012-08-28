inbook.data.SeriesData = function() {
  var fetch = function() {
    $.get(inbook.currentUser.url(true) + "/series.json").
      success(function(data) {
        _(_(data).keys()).each(function(type) {
          var week = data[type] || {};

          delete data[type];
          data[type] = { week: week };
        });

        _(inbook.data.series).extend(data);

        events();
      });
  };

  fetch();

  return {

  };

  function events() {
    _(_(inbook.data.series).keys()).each(function(key) {
      inbook.bus.trigger("data:series:" + key + ":ready");
    });
  }
};
