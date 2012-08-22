require "spec_helper"

describe FacebookPostsCache do
  describe "#perform" do
    let(:user) { FactoryGirl.create(:user) }

    def perform
      FacebookPostsCache.new.perform(user.id)
    end

    before do
      @posts = 2.times.collect {|i| FactoryGirl.create(:facebook_post, :user => user, :created_time => i.minutes.ago) }
    end

    it "should aggregate the posts count" do
      perform

      R.get(user.id, :counts, json: true)[:posts].should == 2
    end

    it "should update the most recent post time onto the user" do
      perform

      user.reload.updated_time.to_i.should == @posts.first.created_time.to_i
    end

    describe "when the posts have comments" do
      before do
        FactoryGirl.create_list(:facebook_post, 2, :user => user, :comments => 7)
      end

      it "should aggregate the counts" do
        perform

        R.get(user.id, :counts, json: true).should == {
          posts: 4,
          comments: 14,
          likes: 0
        }
      end
    end

    describe "when posts have likes" do
      before do
        FactoryGirl.create_list(:facebook_post, 2, :user => user, :likes => 12)
      end

      it "should aggregate the counts" do
        perform

        R.get(user.id, :counts, json: true).should == {
          posts: 4,
          comments: 0,
          likes: 24
        }
      end
    end
  end
end
