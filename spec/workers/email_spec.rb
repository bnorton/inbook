require "spec_helper"

describe Email do
  describe "#perform" do
    let(:user) { FactoryGirl.create(:user) }

    before do
      @mail = mock("Email", :deliver => nil)
    end

    describe ":welcome" do
      def perform
        Email.new.perform(:welcome, user.id, "password" => user.new_password)
      end

      before do
        UserMailer.stub(:welcome).and_return(@mail)
      end

      it "should send the welcome email" do
        UserMailer.should_receive(:welcome).with(user, password: user.new_password).and_return(@mail)

        perform
      end

      it "should deliver the message" do
        @mail.should_receive(:deliver)

        perform
      end
    end
  end
end
