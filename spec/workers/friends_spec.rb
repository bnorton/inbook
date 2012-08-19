require "spec_helper"

describe Friends do
  describe "#perform" do
    let(:user) { FactoryGirl.create(:user) }

    def perform
      Friends.new.perform(user.id)
    end

    def create_friend(id)
      {
        'id' => "12#{id}",
        'name' => "fb user #{id}"
      }
    end

    before do
      @api = mock(Koala::Facebook::API, :get_connections => [])
      Koala::Facebook::API.stub(:new).and_return(@api)
    end

    it "should connect with the users token" do
      Koala::Facebook::API.should_receive(:new).with(user.access_token)

      perform
    end

    it "should ask for the friends" do
      @api.should_receive(:get_connections).with(:me, :friends)

      perform
    end

    describe "on initial import" do
      before do
        @friends = 4.times.collect {|i| create_friend(i) }
        @api.stub(:get_connections).and_return(@friends)
      end

      it "should cache the friends" do
        expect {
          perform
        }.to change(Friend, :count).by(4)
      end

      it "should associate the friends" do
        perform
        friends = Friend.last(4)

        friends.collect(&:user).uniq.should == [user]
      end

      it "should have a added time of now" do
        Timecop.freeze(DateTime.now) do
          perform
          friends = Friend.last(4)

          friends.collect(&:added_at).uniq.should == [Time.now]
        end
      end
    end
  end
end
