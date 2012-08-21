require "spec_helper"

describe FacebookLike do
  let(:user) { FactoryGirl.create(:user) }

  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:facebook_post) }
  end

  def create_like(id)
    {
      'id' => "113#{id}",
      'name' => "MarkP#{id}"
    }
  end

  describe ".build_from_hash" do
    it "should store the attributes" do
      Timecop.freeze(DateTime.now) do
        like = FacebookLike.build_from_hash(create_like(3), user).tap(&:save)

        like.graph_id.should == "1133"
        like.name.should == "MarkP3"
        like.user.should == user
      end
    end
  end

  describe ".create_batch" do
    let(:user) { FactoryGirl.create(:user) }
    let(:likes) { 2.times.collect {|i| create_like(i) } }

    it "should create multiple records" do
      expect {
        user.facebook_likes.create_batch(likes, user)
      }.to change(FacebookLike, :count).by(2)
    end

    it "should persist the items" do
      user.facebook_likes.create_batch(likes, user)

      user.facebook_likes.should == FacebookLike.last(2)
    end
  end
end
