require "spec_helper"

describe FacebookComment do
  let(:user) { FactoryGirl.create(:user) }

  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:facebook_post) }
  end

  def create_comment(id)
    {
      'id' => "12_34_#{id}",
      'from' => {'id' => "from_#{id}", 'name' => "MarkP#{id}"},
      'message' => "A Facebook comment",
      'created_time' => (1.day.ago + id.minutes).iso8601,
      'likes_count' => id + 1
    }
  end

  describe ".build_from_hash" do
    it "should store the attributes" do
      Timecop.freeze(DateTime.now) do
        comment = FacebookComment.build_from_hash(create_comment(3), user).tap(&:save)

        comment.graph_id.should == "12_34_3"
        comment.message.should == "A Facebook comment"
        comment.created_time.should == 1.day.ago + 3.minutes
        comment.likes.should == 4
        comment.user.should == user
      end
    end
  end

  describe ".create_batch" do
    let(:user) { FactoryGirl.create(:user) }
    let(:comments) { 2.times.collect {|i| create_comment(i) } }

    it "should create multiple records" do
      expect {
        user.facebook_comments.create_batch(comments, user)
      }.to change(FacebookComment, :count).by(2)
    end

    it "should persist the items" do
      user.facebook_comments.create_batch(comments, user)

      user.facebook_comments.should == FacebookComment.last(2)
    end
  end
end
