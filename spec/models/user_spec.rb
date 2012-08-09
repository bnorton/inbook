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

    it "should require an access token" do
      should be_valid

      subject.access_token = nil
      should_not be_valid
      should have(1).error_on(:access_token)
    end

    it "should require a unique access token" do
      should be_valid

      FactoryGirl.create(:user, graph_id: subject.graph_id)
      should_not be_valid
      should have(1).error_on(:graph_id)
    end
  end

  describe "#save" do
    subject { FactoryGirl.create(:user) }

    describe "on create" do
      subject { FactoryGirl.build(:user) }

      before do
        Digest::SHA2.stub(:hexdigest).and_return("123456")
      end

      it "should extend the token" do
        ExtendAccessToken.should_receive(:perform_async) do |*args|
          unless args.first == subject.reload.id
            raise RSpec::Mocks::MockExpectationError.new("Must call with the latest user's id'")
          end
        end

        subject.save
      end

      it "should create a token" do
        subject.save

        subject.reload.token.should == "123456"
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
          "graph_id" => 321,
          "name" => "John",
          "username" => "johnny",
          "email" => "john@example.com",
          "birthday" => "today",
          "created_time" => Time.now
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
end
