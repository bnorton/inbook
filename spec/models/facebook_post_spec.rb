require "spec_helper"

describe FacebookPost do
  describe "associations" do
    it { should belong_to(:user) }
    it { should have_many(:facebook_comments) }
  end

  describe "validations" do
    let(:user) { FactoryGirl.create(:user) }

    subject { FactoryGirl.create(:facebook_post, :user => user) }

    it "should require a user" do
      subject.user = nil
      should_not be_valid

      should have(1).error_on(:user_id)
      subject.user = user
      should be_valid
    end

    it "should require a created_time" do
      subject.created_time = nil
      should_not be_valid

      should have(1).error_on(:created_time)
      subject.created_time = Time.now
      should be_valid
    end

    it "should require a message_type" do
      subject.message_type = nil
      should_not be_valid

      should have(1).error_on(:message_type)
      subject.message_type = "status"
      should be_valid
    end

    it "should require a author_graph_id" do
      subject.author_graph_id = nil
      should_not be_valid

      should have(1).error_on(:author_graph_id)
      subject.author_graph_id = "4321"
      should be_valid
    end

    it "should require a graph_id" do
      subject.graph_id = nil
      should_not be_valid

      should have(1).error_on(:graph_id)
      subject.graph_id = "123"
      should be_valid
    end
  end

  describe ".from_for" do
    let(:user) { FactoryGirl.create(:user) }

    before do
      [[:status, 2, :john ],
       [:status, 2, :john ],
       [:photo,  5, :brian],
       [:video,  5, :brian],
       [:video,  5, :brian],
       [:video,  5, :brian]
      ].each do |(type, graph_id, name)|
        FactoryGirl.create(:facebook_post, user: user, message_type: type, author_graph_id: graph_id, author_name: name)
      end
    end

    it "should be the aggregate user posting counts" do
      FacebookPost.from_for(user).should == [
        { "name" => "brian", "graph_id" => "5", "count" => 4 },
        { "name" => "john", "graph_id" => "2", "count" => 2 }
      ]
    end
  end

  def create_message(id)
    {
      'id' => "12#{id}",
      'from' => {'id' => "from_#{id}", 'name' => "MarkP#{id}"},
      'application' => {'id' => "app#{id}", 'name' => "App Name"},
      'type' => "status",
      'message' => "A Facebook wall post",
      'privacy' => {'description' => "Me", 'value' => "self"},
      'created_time' => (1.day.ago + id.minutes).iso8601,
      'object_id' => "4321",
      'picture' => "https://photos.net",
      'link' => "https://facebook.com",
      'name' => "Photos",
      'comments' => {'count' => id + 1},
      'likes' => {'count' => id + 10}
    }
  end

  describe ".build_from_hash" do
    it "should store the attributes" do
      Timecop.freeze(DateTime.now) do
        post = FacebookPost.build_from_hash(create_message(3)).tap(&:save)

        post.graph_id.should == "123"
        post.message.should == "A Facebook wall post"
        post.message_type.should == "status"
        post.application_graph_id.should == "app3"
        post.application_name.should == "App Name"
        post.created_time.should == 1.day.ago + 3.minutes
        post.privacy_description.should == "Me"
        post.privacy_value.should == "self"
        post.object.should == "4321"
        post.author_graph_id.should == "from_3"
        post.author_name.should == "MarkP3"
        post.picture.should == "https://photos.net"
        post.link.should == "https://facebook.com"
        post.name.should == "Photos"
        post.comments.should == 4
        post.likes.should == 13
      end
    end
  end

  describe ".create_batch" do
    let(:user) { FactoryGirl.create(:user) }
    let(:messages) { 2.times.collect {|i| create_message(i) } }

    it "should create multiple records" do
      expect {
        user.facebook_posts.create_batch(messages)
      }.to change(FacebookPost, :count).by(2)
    end

    it "should persist the items" do
      user.facebook_posts.should == FacebookPost.last(2)
    end
  end
end
