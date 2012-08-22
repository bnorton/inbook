inbook.data.FriendsDataConnector = function() {
  var options = {},
      setDate = function(s, e) {
        if(s) { options.start = s;
          if(e) options.end = e;
        }
      },
      fetch = function() {
        var data = {};

        if(options.start && options.end) {
          _(data).extend(options);
        }

        $.get(inbook.currentUser.url(true) + "/friends.json", data).
          success(function(data) {
            inbook.data.friends = _(data).clone();

            inbook.bus.trigger("data:friends:ready");

            genders();
          });
      };

  fetch();

  return {
    fetch: fetch,
    setDate: setDate
  };

  function genders() {
    var breakdown = _(inbook.data.friends.breakdown).clone();

    inbook.data.friends.genders = _(_(breakdown).
      keys()).
      map(function(gender) {
        return {
          label: gender,
          value: breakdown[gender]
        };
      });

    inbook.bus.trigger("data:friends:genders:ready");
  }
};
