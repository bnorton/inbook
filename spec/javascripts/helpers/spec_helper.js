beforeEach(function() {
  $.fx.off = true;

  jasmine.Ajax.useMock();
  clearAjaxRequests();
  google = {
    visualization: {
      arrayToDataTable: function() {},
      PieChart: function() { return {draw: function() {}} },
      BarChart: function() { return {draw: function() {}} }
    }
  };
});
