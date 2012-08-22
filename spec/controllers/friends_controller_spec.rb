require "spec_helper"

describe FriendsController do
  describe "#index" do
    let(:user) { FactoryGirl.create(:user) }

    before do
      sign_in user
    end

    describe ".json" do
      let(:defaults) { {} }

      def make_request
        xhr :get, :index, { format: :json, id: user.id }.merge(defaults)
      end

      before do
        @initial_import = FactoryGirl.create(:friend, :user => user, :added_at => nil)
        @add = FactoryGirl.create(:friend, :user => user, :added_at => 5.days.ago, :gender => 'male')
        @sub = FactoryGirl.create(:friend, :user => user, :subtracted_at => 4.days.ago)
      end

      it "should be a 200" do
        make_request

        response.response_code.should == 200
      end

      it "should return friends" do
        make_request

        response.body.should == {
          'count' => 3,
          'added' => FriendPresenter.from_array([@add]),
          'subtracted' => FriendPresenter.from_array([@sub]),
          'breakdown' => {'male' => 1, 'female' => 2}
        }.to_json
      end

      describe "when filtering by date" do
        before do
          @added = [6.days.ago, 5.days.ago, Time.now].collect do |time|
            FactoryGirl.create(:friend, :user => user, :added_at => time)
          end

          @subtracted = [10.days.ago, Time.now].collect do |time|
            FactoryGirl.create(:friend, :user => user, :subtracted_at => time, :gender => 'male')
          end
        end

        it "should have the proper count" do
          make_request

          JSON.parse(response.body)['count'].should == 8
        end

        it "should have the proper breakdown" do
          make_request

          JSON.parse(response.body)['breakdown'].should == {
            'male' => 3,
            'female' => 5
          }
        end

        describe "for added users" do
          before do
            defaults.merge!(
              start: 1.day.ago.utc.iso8601,
              end: 7.days.ago.utc.iso8601
            )

            make_request
            @json = JSON.parse(response.body)
          end

          it "should return friends added in the time frame" do
            @json['added'].should == JSON.parse(FriendPresenter.from_array([@add, *@added.first(2)]).to_json)
          end
        end

        describe "for subtracted users" do
          before do
            defaults.merge!(
              start: 9.day.ago.utc.iso8601,
              end: 11.days.ago.utc.iso8601
            )

            make_request
            @json = JSON.parse(response.body)
          end

          it "should return friends added in the time frame" do
            @json['subtracted'].should == JSON.parse(FriendPresenter.from_array(@subtracted.first(1)).to_json)
          end
        end
      end
    end
  end
end
