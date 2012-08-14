beforeEach(function() {
  $.fx.off = true;

  jasmine.Ajax.useMock();
  clearAjaxRequests();
  inbook.currentUser = {
    free: function() { return false; }
  };
});
