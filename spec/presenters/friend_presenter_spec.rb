require "spec_helper"

describe FriendPresenter do
  let(:friend) { FactoryGirl.create(:friend) }

  describe ".from_array" do
    it "should return an array of friend presenters" do
      presenters = FriendPresenter.from_array([friend])

      presenters.should have(1).presenter
      presenters.first.to_json.should == FriendPresenter.new(friend).to_json
    end
  end

  describe "#as_json" do
    subject { JSON.parse(FriendPresenter.new(friend).to_json) }

    it "should return the allowed attributes" do
      should == {
        'id' => friend.id,
        'graph_id' => friend.graph_id,
        'name' => friend.name,
        'added_at' => friend.added_at,
        'subtracted_at' => friend.subtracted_at
      }
    end
  end
end
