require "spec_helper"

describe UserPresenter do
  describe "#as_json" do
    let(:user) { FactoryGirl.create(:user, :paid => true) }
    subject { JSON.parse(UserPresenter.new(user).to_json) }

    let(:allowed) do
      {
        "id" => user.id,
        "graph_id" => user.graph_id,
        "access_token" => user.access_token,
        "name" => user.name,
        "link" => user.link,
        "username" => user.username,
        "location_name" => user.location_name,
        "updated_time" => user.updated_time,
        "paid" => user.paid
      }
    end

    it "should return the allowed attributes" do
      should == allowed
    end

    describe "#public" do
      subject { JSON.parse(UserPresenter.new(user).public.to_json) }

      let(:allowed) do
        {
          "id" => user.id,
          "graph_id" => user.graph_id,
          "name" => user.name,
          "link" => user.link,
          "username" => user.username
        }
      end

      it "should return the allowed attributes" do
        should == allowed
      end
    end
  end
end
