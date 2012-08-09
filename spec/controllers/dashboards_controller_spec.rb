require "spec_helper"

describe DashboardsController do
  describe "#index" do
    describe ".html" do
      def make_request
        get :index
      end

      it "should success" do
        make_request

        response.should be_success
      end
    end
  end
end
