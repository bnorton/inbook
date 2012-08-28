describe("LineChartView", function() {
  var view;

  beforeEach(function() {
    spyOn(Highcharts, "Chart");

    view = new inbook.views.LineChartView({type: "posts", interval: "week"});
  });

  it("should not setup a chart", function() {
    expect(Highcharts.Chart).not.toHaveBeenCalled();
  });

  describe("when the data is in place", function() {
    beforeEach(function() {
      inbook.data.series.posts.week = {};

      view = new inbook.views.LineChartView({type: "posts"});
    });

    it("should setup the chart", function() {
      expect(Highcharts.Chart).toHaveBeenCalled();
    });
  });

  describe("when the data is ready", function() {
    var chart;

    beforeEach(function() {
      inbook.data.series.posts.week = {
        "2012-09-22T00:00:00Z": 4,
        "2012-08-04T00:00:00Z": 12,
        "2012-08-11T00:00:00Z": 16,
        "2012-07-28T00:00:00Z": 5
      };

      inbook.bus.trigger("data:series:posts:ready");

      chart = Highcharts.Chart.mostRecentCall.args[0];
    });

    it("should summarize the data", function() {
      expect(inbook.data.series.posts.month).toEqual({
        "2012-09-22T00:00:00Z": 4,
        "2012-08-11T00:00:00Z": 33
      });
    });

    it("should setup the chart", function() {
      expect(chart).toBeTruthy();
    });

    it("should render to #:type", function() {
      expect(chart.chart.renderTo).toEqual("posts");
    });

    it("should be a line chart type", function() {
      expect(chart.chart.type).toEqual("line");
    });

    it("should have the x-axis series data formatted", function() {
      var expectedAxis = _([
        "2012-07-28T00:00:00Z",
        "2012-08-04T00:00:00Z",
        "2012-08-11T00:00:00Z",
        "2012-09-22T00:00:00Z"
      ]).
        map(function(date) {
          return I18n.l("date.formats.human", date);
        });

      expect(chart.xAxis.categories).toEqual(expectedAxis);
    });

    it("should have no legend", function() {
      expect(chart.legend.enabled).toEqual(false);
    });

    it("should have the data", function() {
      expect(chart.series).toEqual([
        {
          name: "posts",
          data: [5, 12, 16, 4]
        }
      ]);
    });

    it("should have the max", function() {
      expect(chart.yAxis.max).toEqual(18);
    });

    describe("when given the month interval", function() {
      beforeEach(function() {
        view.options.interval = "month";

        inbook.bus.trigger("data:series:posts:ready");

        chart = Highcharts.Chart.mostRecentCall.args[0];
      });

      it("should have the x-axis series data formatted", function() {
        var expectedAxis = _([
          "2012-08-11T00:00:00Z",
          "2012-09-22T00:00:00Z"
        ]).
          map(function(date) {
            return I18n.l("date.formats.human", date);
          });

        expect(chart.xAxis.categories).toEqual(expectedAxis);
      });

      it("should have the data", function() {
        expect(chart.series).toEqual([
          {
            name: "posts",
            data: [33, 4]
          }
        ]);
      });

      it("should have the max", function() {
        expect(chart.yAxis.max).toEqual(35);
      });
    });
  });
});
