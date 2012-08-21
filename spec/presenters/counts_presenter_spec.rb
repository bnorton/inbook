require "spec_helper"

describe CountsPresenter, :redis => true do
  let(:user) { FactoryGirl.create(:user) }

  subject { JSON.parse(CountsPresenter.new(user).to_json) }

  describe "#as_json" do
    let(:allowed) do
      {
        "posts" => {
          "count" => 13,
          "type" => {
            "video" => 3,
            "photo" => 1,
            "status" => 2
          }
        },
        "comments" => {
          "count" => 7,
          "name" => {
            "mike" => 2,
            "jan" => 1
          }
        },
        "likes" => {
          "count" => 3,
          "name" => {
            "george" => 1,
            "joey" => 2
          }
        },
        "from" => [
          { "name" => "brian", "graph_id" => "5", "count" => 4 },
          { "name" => "john", "graph_id" => "2", "count" => 2 }
        ]
      }
    end

    before do
      RedisFactory.create(:counts, user: user, posts: 13, comments: 7, likes: 3)

      [[:status, 2, :john ],
       [:status, 2, :john ],
       [:photo,  5, :brian],
       [:video,  5, :brian],
       [:video,  5, :brian],
       [:video,  5, :brian]
      ].each do |(type, graph_id, name)|
        FactoryGirl.create(:facebook_post, user: user, message_type: type, author_graph_id: graph_id, author_name: name)
      end

      [[5, :jan], [2, :mike], [2, :mike]].each do |(id, name)|
        FactoryGirl.create(:facebook_comment, user: user, graph_id: id, author_name: name)
      end

      [[5, :george], [2, :joey], [2, :joey]].each do |(id, name)|
        FactoryGirl.create(:facebook_like, user: user, graph_id: id, name: name)
      end
    end

    it "should return the allowed attributes" do
      should == allowed
    end
  end
end
