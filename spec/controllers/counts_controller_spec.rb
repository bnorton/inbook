require "spec_helper"

describe CountsController, :redis => true do
  describe "#index" do
    let(:user) { FactoryGirl.create(:user) }

    describe ".json" do
      def make_request
        xhr :get, :index, format: :json, id: user.id
      end

      before do
        controller.stub(:authorize!)

        sign_in user
      end

      it "should authorize the user" do
        controller.should_receive(:authorize!)

        make_request
      end

      it "should be a 200" do
        make_request

        response.response_code.should == 200
      end

      it "should return the counts" do
        make_request

        response.body.should == CountsPresenter.new(user).to_json
      end
    end
  end
end
