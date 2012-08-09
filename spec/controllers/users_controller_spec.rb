require "spec_helper"

describe UsersController do
  describe "#create" do
    describe ".json" do
      let(:defaults) do
        {
          graph_id: 543,
          access_token: 'abc123',
          name: 'John Doe',
          username: 'johnny',
          email: 'john@example.com',
          birthday: '01/01/11',
          created_time: Time.now
        }
      end

      def make_request
        xhr :post, :create, { format: :json }.merge(defaults)
      end

      before do
        Digest::SHA2.stub(:hexdigest).and_return("rand_123_321")
      end

      it "should be a 201" do
        make_request

        response.response_code.should == 201
      end

      it "should add a user" do
        expect {
          make_request
        }.to change(User, :count).by(1)
      end

      it "should store the token" do
        make_request

        user = User.last
        user.token.should == "rand_123_321"
      end

      it "should save the attributes" do
        Timecop.freeze(DateTime.now) do
          make_request

          user = User.last
          user.graph_id.should == 543
          user.access_token.should == "abc123"
          user.name.should == "John Doe"
          user.username.should == "johnny"
          user.email.should == "john@example.com"
          user.birthday.should == "01/01/11"
          user.created_time.should == Time.now.to_s
        end
      end

      it "should return the user" do
        make_request

        response.body.should == UserPresenter.new(User.last).to_json
      end

      it "should set a user cookie" do
        make_request

        cookies[:id].should == User.last.id
        cookies[:token].should == "rand_123_321"
      end

      describe "when that user exists" do
        let!(:user) { FactoryGirl.create(:user, :graph_id => defaults[:graph_id]) }

        it "should be a 200" do
          make_request

          response.response_code.should == 200
        end

        it "should not create a user" do
          expect {
            make_request
          }.not_to change(User, :count)
        end

        it "should return the user" do
          make_request

          response.body.should == UserPresenter.new(user).to_json
        end
      end
    end
  end

  describe "#update" do
    describe ".json" do
      let(:user) { FactoryGirl.create(:user) }
      let(:defaults) { {} }

      before do
        sign_in user
      end

      def make_request
        xhr :put, :update, {format: :json, id: user.id, access_token: "new_token_123"}.merge(defaults)
      end

      it "should be a 200" do
        make_request

        response.response_code.should == 200
      end

      it "should update the access token" do
        make_request

        user.reload.access_token.should == "new_token_123"
      end

      describe "when given another user's id" do
        before do
          defaults[:id] = FactoryGirl.create(:user).id
        end

        it "should be a 404" do
          make_request

          response.response_code.should == 404
        end
      end
    end
  end
end
