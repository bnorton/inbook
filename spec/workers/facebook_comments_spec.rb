require "spec_helper"

describe FacebookComments do
  describe "#perform" do
    let(:user) { FactoryGirl.create(:user) }

    def perform
      FacebookComments.new.perform(user.id)
    end

    def create_comment(id)
      {
        'id' => "12_34#{id}",
        'from' => {'id' => "from_#{id}", 'name' => "MarkP#{id}"},
        'message' => "A Facebook wall post",
        'created_time' => (1.day.ago + id.minutes).iso8601,
        'like_count' => id
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

    it "should batch the commments calls" do
      @api.should_receive(:batch).and_yield(@batch).and_return([])

      perform
    end

    describe "on initial import" do
      before do
        @latest_comment = create_comment(3)
        @message1comments = [@latest_comment, create_comment(2)]
        @message2comments = [create_comment(1)]

        @api.stub(:batch).and_yield(@batch).and_return([@message1comments, @message2comments])
      end

      it "should fetch the comments" do
        @batch.should_receive(:get_connections).with(@messages.first.graph_id, :comments, anything)
        @batch.should_receive(:get_connections).with(@messages.last.graph_id, :comments, anything)

        perform
      end

      it "should ask for 200 items" do
        @batch.should_receive(:get_connections).with(anything, anything, hash_including(limit: 200))
        @batch.should_receive(:get_connections).with(anything, anything, hash_including(limit: 200))

        perform
      end

      it "should create the messages internally" do
        expect {
          perform
        }.to change(FacebookComment, :count).by(3)
      end

      it "should associate the messages to the user" do
        perform
        comments = FacebookComment.last(3)

        comments.collect(&:user).uniq.should == [user]
      end

      it "should associate the comments" do
        perform
        comments = FacebookComment.last(3)

        comments.collect(&:facebook_post).should == [@messages.first, @messages.first, @messages.last]
        @messages.first.facebook_comments.count.should == 2
        @messages.last.facebook_comments.count.should == 1
      end

      describe "when new comments are added externally" do
        before do
          perform

          @message1comments = [@latest_comment, create_comment(5), create_comment(4)]
          @api.stub(:batch).and_return([@message1comments, []])
        end

        it "should create the comments internally" do
          expect {
            perform
          }.to change(FacebookComment, :count).by(2)
        end

        it "should associate the comments" do
          perform
          comments = FacebookComment.last(2)

          comments.collect(&:user).uniq.should == [user]
        end

        it "should associate the message" do
          perform
          comments = FacebookComment.last(2)

          comments.collect(&:facebook_post).uniq.should == [@messages.first]
        end
      end
    end
  end
end
