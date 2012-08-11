require "spec_helper"

describe UserPresenter do
  describe "#as_json" do
    let(:user) { FactoryGirl.create(:user) }
    subject { JSON.parse(UserPresenter.new(user).to_json) }

    it "should return the allowed attributes" do
      should == {
        "id" => user.id,
        "graph_id" => user.graph_id,
        "access_token" => user.access_token,
        "name" => user.name,
        "username" => user.username,
        "updated_time" => user.updated_time
      }
    end
  end
end
