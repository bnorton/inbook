require "spec_helper"

describe ExtendAccessToken do
  describe "#perform" do
    let(:user) { FactoryGirl.create(:user) }

    before do
      @oauth = mock(Koala::Facebook::OAuth, :exchange_access_token => "newToken|321")
      Koala::Facebook::OAuth.stub(:new).and_return(@oauth)
    end

    def perform
      subject.perform(user.id)
    end

    it "should connect via the application access token" do
      Koala::Facebook::OAuth.should_receive(:new).with(Facebook.id, Facebook.secret)

      perform
    end

    it "should extend the token" do
      @oauth.should_receive(:exchange_access_token).with(user.access_token)

      perform
    end

    it "should save the returned access token" do
      perform

      user.reload.access_token.should == "newToken|321"
    end

    it "should save the expires time" do
      Timecop.freeze(DateTime.now) do
        perform

        user.reload.access_token_expires.should == 2.months.from_now
      end
    end
  end
end
