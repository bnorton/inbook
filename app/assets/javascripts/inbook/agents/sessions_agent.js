inbook.agents.SessionsAgent = (function(user) {
  var facebookLogin = function() {
    getFBLoginStatus();
  };

  return {
    facebookLogin: facebookLogin
  };

  function getFBLoginStatus() {
    FB.getLoginStatus(function(response) {
      var auth = response.authResponse;

      if(auth) {
        authSuccess(auth);
      } else {
        login();
      }
    });
  }

  function authSuccess(data) {
    user.set("access_token", data.accessToken);

    if(user.get("paid")) {
      change();
    } else {
      api();
    }

  }

  function login() {
    FB.login(function(response) {
      var auth = response.authResponse;

      if(auth) {
        authSuccess(auth);
      }
    }, inbook.settings.permissions);
  }

  function api() {
    FB.api("/me", function(response) {
      var attrs = {
        graph_id: response.id
      };

      _(["name", "username", "email", "link", "gender", "birthday", "updated_time"]).each(function(attr) {
        attrs[attr] = response[attr];
      });

      user.set(attrs);

      change();
    });
  }

  function change() {
    user.trigger("change:facebook:user");
  }
});
