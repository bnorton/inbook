require "spec_helper"

describe FriendsMetadata do
  let(:user) { FactoryGirl.create(:user) }

  describe "#perform" do
    def perform
      FriendsMetadata.new.perform(user.id)
    end

    def create_user(id)
      {
        'id' => "12#{id}",
        'location' => {
          'id' => "loc#{id}",
          'name' => "San Francisco #{id}"
        },
        'language' => {
          'id' => "lang#{id}",
          'name' => "English"
        },
        'gender' => (id % 2).zero? ? "male" : "female",
        'birthday' => "0#{id}/1987",
        'link' => "http://#{id}.com",
        'locale' => "EN#{id}"
      }
    end

    before do
      @friends = [FactoryGirl.create(:friend, user: user, graph_id: "121"), FactoryGirl.create(:friend, user: user, graph_id: "122")]

      @api = mock(Koala::Facebook::API)
      @batch = mock(Koala::Facebook::API, :get_object => nil)

      Koala::Facebook::API.stub(:new).and_return(@api)

      @results = [{
        @friends.first.graph_id => create_user(1),
        @friends.last.graph_id => create_user(2)
      }]

      @api.stub(:batch).and_yield(@batch).and_return(@results)
    end

    it "should connect with the users token" do
      Koala::Facebook::API.should_receive(:new).with(user.access_token)

      perform
    end

    it "should batch the requests" do
      @api.should_receive(:batch).and_yield(@batch).and_return(@results)

      perform
    end

    it "should request the friend ids" do
      @batch.should_receive(:get_object).with("?ids=" + @friends.map(&:graph_id).join(","))

      perform
    end

    it "should store the location" do
      perform
      @friends.map(&:reload)

      @friends.collect(&:location_id).should == ["loc1", "loc2"]
      @friends.collect(&:location_name).should == ["San Francisco 1", "San Francisco 2"]
    end

    it "should store the language" do
      perform
      @friends.map(&:reload)

      @friends.collect(&:language_id).should == ["lang1", "lang2"]
      @friends.collect(&:language_name).uniq.should == ["English"]
    end

    it "should store other metadata" do
      perform
      @friends.map(&:reload)

      @friends.collect(&:gender).should == ["female", "male"]
      @friends.collect(&:link).should == ["http://1.com", "http://2.com"]
      @friends.collect(&:locale).should == ["EN1", "EN2"]
      @friends.collect(&:birthday).should == ["01/1987", "02/1987"]
    end
  end
end
