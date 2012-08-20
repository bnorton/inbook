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

      describe "when importing again" do
        before do
          perform
        end

        describe "when friends are added" do
          before do
            @friends = @friends << create_friend(5)
          end

          it "should add the friends" do
            expect {
              perform
            }.to change(Friend, :count).by(1)
          end

          it "should be the users friend" do
            perform
            friend = Friend.last

            friend.user.should == user
          end

          it "should be added now" do
            Timecop.freeze(DateTime.now) do
              perform
              friend = Friend.last

              friend.added_at.should == Time.now
              friend.subtracted_at.should == nil
            end
          end
        end

        describe "when friends are subtracted" do
          before do
            @subtracted = [@friends.pop, @friends.pop].collect {|f| f["id"]}
          end

          it "should not remove the friend" do
            expect {
              perform
            }.not_to change(Friend, :count)
          end

          it "should mark the friend as subtracted" do
            Timecop.freeze(DateTime.now) do
              perform

              friends = user.friends.where(:graph_id => @subtracted)
              friends.collect(&:subtracted_at).uniq.should == [Time.now]
            end
          end

          it "should not mark any other friends as lost" do
            perform

            user.friends.collect(&:subtracted_at).compact.size.should == 2
          end
        end
      end
    end

    describe "metadata" do
      it "should fetch metadata" do
        FriendsMetadata.should_receive(:perform_async).with(user.id)

        perform
      end
    end
  end
end
