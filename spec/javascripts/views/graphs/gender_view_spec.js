describe("GenderGraphView", function() {
  var view, select, call, addGraph, x, y;

  beforeEach(function() {
    addGraph = x = y = undefined;

    spyOn(nv, "addGraph").andCallFake(function(callback) {
      addGraph = callback;
    });

    spyOn(nv.models, "pieChart").andCallFake(function() {
      return {
        x: function(c) {
          x = c; return {
            y: function(c) {
              y = c; return {
              color: function() { return {
                showLabels: function() {}
              }}
            }}
          }
        }
      }
    });

    call = jasmine.createSpy("call");
    select = {
      datum: function() { return {
        transition: function() { return {
          duration: function() { return {
            call: call
          }}
        }}
      }}
    };

    spyOn(select, "datum").andCallThrough();
    spyOn(d3, "select").andReturn(select);

    view = new inbook.views.GenderGraphView();
  });

  it("should not add a graph", function() {
    expect(addGraph).toBeUndefined();
  });

  it("should show the spinner", function() {
    expect(".spinner").toExistIn(view.$el);
    expect(view.$el.find(".spinner")).not.toHaveClass("hidden");
  });

  describe("when the data is ready", function() {
    var genders;

    beforeEach(function() {
      genders = [
        {
          label: "male",
          value: 30
        },
        {
          label: "female",
          value: 40
        }
      ];

      inbook.data.friends = {
        genders: genders
      };

      inbook.bus.trigger("data:friends:genders:ready");
    });

    it("should remove the spinner", function() {
      expect(view.$el.find(".spinner")).toHaveClass("hidden");
    });

    it("should add a graph", function() {
      expect(addGraph).toBeDefined();
    });

    it("should not add a pie chart", function() {
      expect(nv.models.pieChart).not.toHaveBeenCalled();
    });

    describe("when the graph is added", function() {
      beforeEach(function() {
        addGraph();
      });

      it("should add a pie chart", function() {
        expect(nv.models.pieChart).toHaveBeenCalled();
      });

      describe("for the x function", function() {
        it("should return the label", function() {
          expect(x(genders[0])).toEqual("male");
          expect(x(genders[1])).toEqual("female");
        });
      });

      describe("for the y function", function() {
        it("should return the values", function() {
          expect(y(genders[0])).toEqual(30);
          expect(y(genders[1])).toEqual(40);
        });
      });

      it("should pass the data", function() {
        expect(select.datum).toHaveBeenCalledWith(
          [{key: " ", values: genders}]
        );
      });

      it("should call the graph", function() {
        expect(call).toHaveBeenCalled();
      });
    });
  });
});
