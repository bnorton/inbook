describe("FacebookDataConnector", function() {
  var connector, api;

  beforeEach(function() {
    api = undefined;

    inbook.currentUser = new inbook.models.User({graph_id: 123, access_token: "abc123", updated_time: new Date()});

    spyOn(FB, "api").andCallFake(function(path, callback) {
      api = {
        path: path,
        callback: callback
      }
    });


  });

  it("should not have requested /feed", function() {
    connector = new inbook.data.FacebookDataConnector();

    expect(api).toBeUndefined();
  });

  describe("when it's ready", function() {
    beforeEach(function() {
      spyOn(inbook.settings, "ready").andReturn(true)

      connector = new inbook.data.FacebookDataConnector();
    });

    it("should have requested /feed", function() {
      connector = new inbook.data.FacebookDataConnector();

      expect(api).toBeDefined();
    });
  });

  describe("when facebook javascript is ready", function() {
    beforeEach(function() {
      connector = new inbook.data.FacebookDataConnector();

      inbook.bus.trigger("fb:ready");
    });

    it("should request the user's feed", function() {
      expect(api.path).toMatch(/^\/me\/feed/);
    });

    it("should use the access token", function() {
      expect(api.path).toMatch(/access_token=abc123/);
    });

    it("should set a 1000 limit", function() {
      expect(api.path).toMatch(/limit=1000/);
    });

    describe("on success", function() {
      var fb_data, ready;

      beforeEach(function() {
        ready = jasmine.createSpy("ready");
        inbook.bus.on("data:posts:counts:ready", ready);

        fb_data = [
          {
            id: "1_2",
            from: { id: "2", name: "John D" },
            to: {
              data: [
                { id: "6", name: "Brian N" },
                { id: "5", name: "Mark P" }
              ]
            },
            message: "A Message!",
            created_time: "2012-12-12T30:30:30+0000",
            type: "photo",
            application: { id: "33", name: "foursquare" },
            comments: {
              count: 4
            },
            likes: {
              count: 12
            }
          },
          {
            id: "1_3",
            from: { id: "3", name: "Doug U" },
            type: "photo",
            application: { id: "33", name: "foursquare" },
            comments: {
              count: 5
            },
            likes: {
              count: 4
            }
          },
          {
            id: "1_4",
            from: { id: "2", name: "John D" },
            type: "video",
            to: {
              data: [
                { id: "6", name: "Brian N" }
              ]
            },
            comments: {
              count: 1
            },
            likes: {
              count: 1
            }
          }
        ];
      });

      describe("when aggregating the data", function() {
        beforeEach(function() {
          api.callback({data: fb_data});
        });

        it("should signal data ready when done", function() {
          expect(ready).toHaveBeenCalled();
        });

        it("should store the posts count", function() {
          expect(inbook.data.counts.posts.count).toEqual(3);
        });

        it("should store the comments count", function() {
          expect(inbook.data.counts.comments.count).toEqual(10);
        });

        it("should store the likes count", function() {
          expect(inbook.data.counts.likes.count).toEqual(17);
        });

        it("should aggregate the type", function() {
          expect(inbook.data.counts.posts.type.photo).toEqual(2);
          expect(inbook.data.counts.posts.type.video).toEqual(1);
        });

        it("should aggregate the application", function() {
          expect(inbook.data.counts.posts.application["33"].count).toEqual(2);
          expect(inbook.data.counts.posts.application["33"].name).toEqual("foursquare");
        });

        it("should aggregate users who posted messages", function() {
          expect(inbook.data.counts.posts.from["2"].count).toEqual(2);
          expect(inbook.data.counts.posts.from["2"].name).toEqual("John D");

          expect(inbook.data.counts.posts.from["3"].count).toEqual(1);
          expect(inbook.data.counts.posts.from["3"].name).toEqual("Doug U");
        });

        it("should aggregate users who received messages", function() {
          expect(inbook.data.counts.posts.to["6"].count).toEqual(2);
          expect(inbook.data.counts.posts.to["6"].name).toEqual("Brian N");

          expect(inbook.data.counts.posts.to["5"].count).toEqual(1);
          expect(inbook.data.counts.posts.to["5"].name).toEqual("Mark P");
        });
      });

      describe("for the global dataset", function() {
        describe("for the posts data", function() {
          var ready;

          beforeEach(function() {
            ready = jasmine.createSpy(":ready");
          });

          describe("for the types data", function() {
            beforeEach(function() {
              inbook.bus.on("data:posts:types:ready", ready);

              api.callback({data: fb_data});
            });

            it("should format the post data", function() {
              expect(inbook.data.posts.types).toEqual([
                {
                  label: "photo",
                  value: 2
                },
                {
                  label: "video",
                  value: 1
                }
              ]);
            });

            it("should trigger the :posts:types:ready event", function() {
              expect(ready).toHaveBeenCalled();
            });
          });

          describe("for the 'who is posting' data", function() {
            beforeEach(function() {
              inbook.bus.on("data:posts:who:ready", ready);

              api.callback({data: fb_data});
            });

            it("should format the post data", function() {
              expect(inbook.data.posts.who).toEqual([
                {
                  label: "Doug U",
                  value: 1
                },
                {
                  label: "John D",
                  value: 2
                }
              ]);
            });

            it("should trigger the :posts:who:ready event", function() {
              expect(ready).toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe("on error", function() {
      var error;

      beforeEach(function() {
        error = jasmine.createSpy("Error");
        inbook.bus.on("fb:error:auth", error);

        api.callback({});
      });

      it("should trigger the :error:auth event", function() {
        expect(error).toHaveBeenCalled();
      });
    });
  });
});
