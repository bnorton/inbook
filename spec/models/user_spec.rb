require "spec_helper"

describe User do
  describe "validations" do
    subject { FactoryGirl.build(:user) }

    it "should require a graph_id" do
      should be_valid

      subject.graph_id = nil
      should_not be_valid
      should have(1).error_on(:graph_id)
    end

    it "should require a unique access token" do
      should be_valid

      FactoryGirl.create(:user, graph_id: subject.graph_id)
      should_not be_valid
      should have(1).error_on(:graph_id)
    end
  end

  describe "associations" do
    it { should have_many(:facebook_posts) }
  end

  describe "#save" do
    subject { FactoryGirl.create(:user) }

    describe "on create" do
      subject { FactoryGirl.build(:user) }

      it "should create an 8 digit password" do
        subject.save

        subject.new_password.length.should == 8
      end

      it "should welcome email the user" do
        Email.should_receive(:perform_async) do |*args|
          unless args.first == :welcome && args.second == subject.reload.id && args.third.should == {password: subject.new_password}
            raise RSpec::Mocks::MockExpectationError.new("Must call with :welcome and the user's id'")
          end
        end

        subject.save
      end

      it "should extend the token" do
        ExtendAccessToken.should_receive(:perform_async) do |*args|
          unless args.first == subject.reload.id
            raise RSpec::Mocks::MockExpectationError.new("Must call with the user's id'")
          end
        end

        subject.save
      end

      it "should know when the access token expires" do
        Timecop.freeze(DateTime.now) do
          subject.save

          subject.reload.access_token_expires.should == 2.hours.from_now
        end
      end

      it "should create a token" do
        Digest::SHA2.stub(:hexdigest).and_return("123456")
        subject.save

        subject.reload.token.should == "123456"
      end

      it "should not have a new password" do
        subject.save

        User.find(subject.id).new_password.should be_nil
      end
    end

    it "should not replace the token" do
      user = FactoryGirl.create(:user)
      user.token = "something"
      user.save

      user.reload.token.should == "something"
    end

    describe "when mass assigning" do
      let(:options) do
        {
          "access_token" => "newToken",
          "access_token_expires" => Time.now,
          "graph_id" => "321",
          "name" => "John",
          "username" => "johnny",
          "email" => "john@example.com",
          "birthday" => "today",
          "updated_time" => Time.now
        }
      end

      it "should not fail" do
        Timecop.freeze(DateTime.now) do
          subject.update_attributes!(options)

          subject.reload.attributes.slice(*options.keys).should == options
        end
      end
    end
  end

  describe "#valid_password?" do
    subject { FactoryGirl.create(:user, password: "password") }

    it "should be invalid" do
      should_not be_valid_password("invalid")
    end

    describe "when given the right password" do
      before do
        stub_const("User::EIGHT", 1)
      end

      it "should be valid" do
        should be_valid_password("0")
      end
    end
  end

  describe "#password=" do
    it "should set the password and salt" do
      Timecop.freeze(DateTime.now) do
        Digest::SHA2.should_receive(:hexdigest).with(Time.now.to_f.to_s).and_return("|salt")
        Digest::SHA2.should_receive(:hexdigest).with("new pass|salt").and_return("123456")

        subject.password = "new pass"

        subject.password.should == "123456"
        subject.salt.should == "|salt"
      end
    end
  end
end
