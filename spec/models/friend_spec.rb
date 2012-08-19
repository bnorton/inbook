require "spec_helper"

describe Friend do
  describe "associations" do
    it { should belong_to(:user) }
  end

  def create_friend(id)
    {
      'id' => "12#{id}",
      'name' => "fb user #{id}"
    }
  end

  describe ".build_from_hash" do
    it "should store the attributes" do
      Timecop.freeze(DateTime.now) do
        friend = Friend.build_from_hash(create_friend(3)).tap(&:save)

        friend.graph_id.should == "123"
        friend.name.should == "fb user 3"
        friend.added_at.should == Time.now
        friend.subtracted_at.should == nil
      end
    end
  end

  describe ".create_batch" do
    let(:user) { FactoryGirl.create(:user) }
    let(:friends) { 2.times.collect {|i| create_friend(i) } }

    it "should create multiple records" do
      expect {
        user.friends.create_batch(friends)
      }.to change(Friend, :count).by(2)
    end

    it "should persist the items" do
      user.friends.should == Friend.last(2)
    end
  end
end
