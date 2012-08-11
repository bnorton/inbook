require "spec_helper"

describe Facebook do
  describe "#access_token" do
    let(:access_token_url) { "https://graph.facebook.com/oauth/access_token" }

    before do
      Facebook.instance_variable_set(:@access_token, nil)

      stub_request(:post, access_token_url).with(
        body: {"client_id" => Facebook.id, "client_secret" => Facebook.secret, "type" => "client_cred"}
      ).to_return(
        body: "access_token=274529429250773|ucuwEqn45SnW5-mPgr1IvBc5Wkc"
      )
    end

    it "should request an access token from Facebook only once" do
      Facebook.access_token
      WebMock.should have_requested(:post, access_token_url)

      WebMock.reset!

      Facebook.access_token
      WebMock.should_not have_requested(:post, access_token_url)
    end

    it "should return the access token every time" do
      Facebook.access_token.should == "274529429250773|ucuwEqn45SnW5-mPgr1IvBc5Wkc"
      Facebook.access_token.should == "274529429250773|ucuwEqn45SnW5-mPgr1IvBc5Wkc"
    end
  end
end
