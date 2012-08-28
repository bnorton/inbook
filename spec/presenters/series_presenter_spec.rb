require "spec_helper"

describe SeriesPresenter do
  describe "#as_json" do
    let(:user) { FactoryGirl.create(:user) }
    let(:allowed) do
      {
        'posts' => {
          1.weeks.ago.utc.beginning_of_day.iso8601 => 2,
          5.weeks.ago.utc.beginning_of_day.iso8601 => 3
        },
        'likes' => {
          3.week.ago.utc.beginning_of_day.iso8601 => 2,
          2.weeks.ago.utc.beginning_of_day.iso8601 => 1,
        },
        'comments' => {
          0.weeks.ago.utc.beginning_of_day.iso8601 => 1,
          2.weeks.ago.utc.beginning_of_day.iso8601 => 1,
          4.weeks.ago.utc.beginning_of_day.iso8601 => 1,
        }
      }
    end

    subject {JSON.parse(SeriesPresenter.new(user).to_json) }

    before do
      FactoryGirl.create_list(:facebook_post, 2, user: user, created_time: 2.weeks.ago)
      FactoryGirl.create_list(:facebook_post, 3, user: user, created_time: 6.weeks.ago)

      [4, 4, 3].each {|i| FactoryGirl.create(:facebook_like, user: user, created_time: i.weeks.ago) }

      [1, 3, 5].each {|i| FactoryGirl.create(:facebook_comment, user: user, created_time: i.weeks.ago) }
    end

    it "should return the series" do
      should == allowed
    end
  end
end
