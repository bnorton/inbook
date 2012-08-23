describe("TypesGraphView", function() {
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
            y: function(c) { y = c; return {
              margin: function() { return {
                color: function() { return {
                  showLabels: function() {}
                }}
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

    view = new inbook.views.TypesGraphView();
  });

  it("should not add a graph", function() {
    expect(addGraph).toBeUndefined();
  });

  it("should show the spinner", function() {
    expect(".spinner").toExistIn(view.$el);
    expect(view.$el.find(".spinner")).not.toHaveClass("hidden");
  });

  describe("when the data is ready", function() {
    var types;

    beforeEach(function() {
      types = [
        {
          label: "status",
          value: 3
        },
        {
          label: "photo",
          value: 4
        }
      ];

      inbook.data.posts = {
        types: types
      };

      inbook.bus.trigger("data:posts:types:ready");
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
          expect(x(types[0])).toEqual("status");
          expect(x(types[1])).toEqual("photo");
        });
      });

      describe("for the y function", function() {
        it("should return the values", function() {
          expect(y(types[0])).toEqual(3);
          expect(y(types[1])).toEqual(4);
        });
      });

      it("should pass the data", function() {
        expect(select.datum).toHaveBeenCalledWith(
          [{key: " ", values: types}]
        );
      });

      it("should call the graph", function() {
        expect(call).toHaveBeenCalled();
      });
    });
  });
});
