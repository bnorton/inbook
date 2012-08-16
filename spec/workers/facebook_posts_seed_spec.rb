require "spec_helper"

describe FacebookPostsSeed do
  describe ".options" do
    it "should define the 'unique' option" do
      subject.class.sidekiq_options.should == {
        'retry' => true,
        'queue' => :default,
        'unique' => true
      }
    end
  end

  describe "#perform" do
    def perform
      FacebookPostsSeed.new.perform
    end

    before do
      @users = FactoryGirl.create_list(:user, 2, :paid => true)
      @unpaid_user = FactoryGirl.create(:user)
    end

    it "should add a fetcher per user" do
      FacebookPosts.should_receive(:perform_async).with(@users.first.id)
      FacebookPosts.should_receive(:perform_async).with(@users.last.id)

      perform
    end

    it "should not add a fetcher for unpaid users" do
      FacebookPosts.should_not_receive(:perform_async).with(@unpaid_user.id)

      perform
    end

    it "should re-add itself at the end of the hour" do
      subject.class.should_receive(:seed)

      perform
    end
  end

  describe ".seed" do
    it "should add itself for the end of the hour" do
      subject.class.should_receive(:perform_at).with(Time.now.end_of_hour)

      subject.class.seed
    end
  end
end
