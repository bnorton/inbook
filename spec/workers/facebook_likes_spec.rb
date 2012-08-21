require "spec_helper"

describe FacebookLikes do
  describe "#perform" do
    let(:user) { FactoryGirl.create(:user) }

    def perform
      FacebookLikes.new.perform(user.id)
    end

    def create_like(id)
      {
        'id' => "113#{id}",
        'name' => "MarkP#{id}",
      }
    end

    before do
      @messages = FactoryGirl.create_list(:facebook_post, 2, user: user)

      @api = mock(Koala::Facebook::API)
      @batch = mock(Koala::Facebook::API, get_connections: nil)
      Koala::Facebook::API.stub(:new).and_return(@api)

      @api.stub(:batch).and_yield(@batch).and_return([])
    end

    it "should connect with the users token" do
      Koala::Facebook::API.should_receive(:new).with(user.access_token)

      perform
    end

    it "should batch the likes calls" do
      @api.should_receive(:batch).and_yield(@batch).and_return([])

      perform
    end

    describe "on initial import" do
      before do
        @latest_like = create_like(3)
        @message1likes = [@latest_like, create_like(2)]
        @message2likes = [create_like(1)]

        @api.stub(:batch).and_yield(@batch).and_return([@message1likes, @message2likes])
      end

      it "should fetch the likes" do
        @batch.should_receive(:get_connections).with(@messages.first.graph_id, :likes, anything)
        @batch.should_receive(:get_connections).with(@messages.last.graph_id, :likes, anything)

        perform
      end

      it "should ask for 500 items" do
        @batch.should_receive(:get_connections).with(anything, anything, hash_including(limit: 500))
        @batch.should_receive(:get_connections).with(anything, anything, hash_including(limit: 500))

        perform
      end

      it "should create the messages internally" do
        expect {
          perform
        }.to change(FacebookLike, :count).by(3)
      end

      it "should associate the messages to the user" do
        perform
        likes = FacebookLike.last(3)

        likes.collect(&:user).uniq.should == [user]
      end

      it "should associate the likes" do
        perform
        likes = FacebookLike.last(3)

        likes.collect(&:facebook_post).should == [@messages.first, @messages.first, @messages.last]
        @messages.first.facebook_likes.count.should == 2
        @messages.last.facebook_likes.count.should == 1
      end

      describe "when new likes are added externally" do
        before do
          perform

          @message1likes = [@latest_like, create_like(5), create_like(4)]
          @api.stub(:batch).and_return([@message1likes, []])
        end

        it "should create the likes internally" do
          expect {
            perform
          }.to change(FacebookLike, :count).by(2)
        end

        it "should associate the likes" do
          perform
          likes = FacebookLike.last(2)

          likes.collect(&:user).uniq.should == [user]
        end

        it "should associate the message" do
          perform
          likes = FacebookLike.last(2)

          likes.collect(&:facebook_post).uniq.should == [@messages.first]
        end
      end
    end
  end
end
