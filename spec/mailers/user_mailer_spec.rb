require "spec_helper"

describe UserMailer do
  let(:user) { FactoryGirl.create(:user) }

  describe "#welcome" do
    it "should email the user" do
      email = nil
      expect {
        email = UserMailer.welcome(user, password: "a_password").deliver
      }.to change(ActionMailer::Base.deliveries, :count).by(1)

      email.to.should == [user.email]
      email.from.should == ["hi@redwoodsocial.com"]
      email.subject.should == I18n.t("user_mailer.welcome")

      email.body.should include(user.name + ", Welcome to Redwood Social")
      email.body.should include("a_password")
      email.body.should include("Thanks,")
      email.body.should include("team@redwoodsocial.com")
    end
  end
end
