require "spec_helper"

describe CountsPresenter, :redis => true do
  let(:user) { FactoryGirl.create(:user) }

  subject { JSON.parse(CountsPresenter.new(user).to_json) }

  describe "#as_json" do
    let(:allowed) do
      {
        "posts" => { "count" => 13 },
        "comments" => { "count" => 7 },
        "likes" => { "count" => 3 }
      }
    end

    before do
      RedisFactory.create(:counts, :user => user, :posts => 13, :comments => 7, :likes => 3)
    end

    it "should return the allowed attributes" do
      should == allowed
    end
  end
end
