require "spec_helper"

describe SeriesController do
  let(:user) { FactoryGirl.create(:user) }

  describe "#index" do
    before do
      sign_in user
    end

    describe ".json" do
      def make_request
        xhr :get, :index, format: :json, id: user.id
      end

      it "should be a 200" do
        make_request

        response.response_code.should == 200
      end

      it "should return the series" do
        make_request

        response.body.should == SeriesPresenter.new(user).to_json
      end
    end
  end
end
