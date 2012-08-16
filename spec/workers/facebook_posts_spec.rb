require "spec_helper"

describe FacebookPosts do
  describe "#perform" do
    let(:user) { FactoryGirl.create(:user) }

    def perform
      FacebookPosts.new.perform(user.id)
    end

    def create_message(id)
      {
        'id' => "12#{id}",
        'from' => {'id' => "from_#{id}", 'name' => "MarkP#{id}"},
        'type' => "status",
        'message' => "A Facebook wall post",
        'created_time' => (1.day.ago + id.minutes).iso8601
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

    describe "on initial import" do
      before do
        @latest_message = create_message(3)
        @page1 = [@latest_message, create_message(2)]
        @page2 = [create_message(1)]

        @page2.stub(:next_page).and_return([])
        @page1.stub(:next_page).and_return(@page2)

        @api.stub(:get_connections).and_return(@page1)
      end

      it "should fetch the users news feed" do
        @api.should_receive(:get_connections).with(:me, :feed, anything).and_return(@page1)

        perform
      end

      it "should ask for 100 items" do
        @api.should_receive(:get_connections).with(:me, :feed, hash_including(limit: 100)).and_return(@page1)

        perform
      end

      it "should create the messages internally" do
        expect {
          perform
        }.to change(FacebookPost, :count).by(3)
      end

      it "should associate the messages" do
        perform
        posts = FacebookPost.last(3)

        posts.collect(&:user).uniq.should == [user]
      end

      it "should setup an aggregator" do
        FacebookPostsCache.should_receive(:perform_async).with(user.id)

        perform
      end

      describe "when new message are added externally" do
        before do
          perform

          @page1 = [@latest_message, create_message(5), create_message(4)]
          @page1.stub(:next_page).and_return([])

          @api.stub(:get_connections).and_return(@page1)
        end

        it "should create the messages internally" do
          expect {
            perform
          }.to change(FacebookPost, :count).by(2)
        end

        it "should associate the messages" do
          perform
          posts = FacebookPost.last(2)

          posts.collect(&:user).uniq.should == [user]
        end
      end
    end
  end
end
