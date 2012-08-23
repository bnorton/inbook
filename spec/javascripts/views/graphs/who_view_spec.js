describe("TypesGraphView", function() {
  var view, select, call, addGraph, x, y;

  beforeEach(function() {
    addGraph = x = y = undefined;

    spyOn(nv, "addGraph").andCallFake(function(callback) {
      addGraph = callback;
    });

    spyOn(nv.models, "multiBarHorizontalChart").andCallFake(function(callback) {
      return {
        x: function(c) {
          x = c; return {
            y: function(c) {
              y = c; return {
                margin: function() { return {
                  stacked: function() { return {
                    showValues: function(){
                      return {
                        yAxis: { tickFormat: function(){} }
                      }
                    }
                  }}
                }}
              }
            }
          }
        }
      }
    });

    call = jasmine.createSpy("call");
    select = {
      datum: function() {
        return {transition: function() {
          return { duration: function() {
            return {
              call: call
            }
          }}
        }}
      }
    };

    spyOn(select, "datum").andCallThrough();
    spyOn(d3, "select").andReturn(select);

    view = new inbook.views.WhoGraphView();
  });

  it("should not add a graph", function() {
    expect(addGraph).toBeUndefined();
  });

  it("should show the spinner", function() {
    expect(".spinner").toExistIn(view.$el);
    expect(view.$el.find(".spinner")).not.toHaveClass("hidden");
  });

  describe("when the data is ready", function() {
    var who;

    beforeEach(function() {
      who = [
        {
          label: "User One",
          value: 3
        },
        {
          label: "User Two",
          value: 4
        }
      ];

      inbook.data.posts = {
        who: who
      };

      inbook.bus.trigger("data:posts:who:ready");
    });

    it("should remove the spinner", function() {
      expect(view.$el.find(".spinner")).toHaveClass("hidden");
    });

    it("should add a graph", function() {
      expect(addGraph).toBeDefined();
    });

    it("should not add a pie chart", function() {
      expect(nv.models.multiBarHorizontalChart).not.toHaveBeenCalled();
    });

    describe("when the graph is added", function() {
      beforeEach(function() {
        addGraph();
      });

      it("should add a pie chart", function() {
        expect(nv.models.multiBarHorizontalChart).toHaveBeenCalled();
      });

      describe("for the x function", function() {
        it("should return the label", function() {
          expect(x(who[0])).toEqual("User One");
          expect(x(who[1])).toEqual("User Two");
        });
      });

      describe("for the y function", function() {
        it("should return the values", function() {
          expect(y(who[0])).toEqual(3);
          expect(y(who[1])).toEqual(4);
        });
      });

      it("should pass the data", function() {
        expect(select.datum).toHaveBeenCalledWith(
          [{key: "", values: who}]
        );
      });

      it("should call the graph", function() {
        expect(call).toHaveBeenCalled();
      });
    });
  });
});
