require "spec_helper"

describe UsersController do
  describe "#create" do
    describe ".json" do
      let(:defaults) do
        {
          graph_id: '543',
          name: 'John Doe',
          username: 'johnny',
          email: 'john@example.com',
          birthday: '01/01/11',
          updated_time: Time.now
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

      it "should save the attributes" do
        Timecop.freeze(DateTime.now) do
          make_request

          user = User.last
          user.graph_id.should == "543"
          user.name.should == "John Doe"
          user.username.should == "johnny"
          user.email.should == "john@example.com"
          user.birthday.should == "01/01/11"
          user.updated_time.should == Time.now.to_s
        end
      end

      it "should set a user cookie" do
        make_request

        cookies[:id].should == User.last.id
        cookies[:token].should == "rand_123_321"
      end

      it "should return the user" do
        make_request

        response.body.should == UserPresenter.new(User.last).to_json
      end

      describe "when that user exists" do
        let!(:user) { FactoryGirl.create(:user, :graph_id => defaults[:graph_id]) }

        it "should be a 401" do
          make_request

          response.response_code.should == 401
        end

        it "should not create a user" do
          expect {
            make_request
          }.not_to change(User, :count)
        end

        it "should return the public user" do
          make_request

          response.body.should == UserPresenter.new(user).public.to_json
        end
      end
    end
  end

  describe "#update" do
    describe ".json" do
      let(:user) { FactoryGirl.create(:user) }
      let(:defaults) { {} }

      def make_request
        xhr :put, :update, {format: :json, id: user.id, access_token: "new_token_123", password: "0"}.merge(defaults)
      end

      before do
        stub_const("User::EIGHT", 1)
      end

      it "should be a 200" do
        make_request

        response.response_code.should == 200
      end

      it "should update the access token" do
        make_request

        user.reload.access_token.should == "new_token_123"
      end

      it "should set a user cookie" do
        Digest::SHA2.stub(:hexdigest).and_return("rand_123_321")
        make_request

        cookies[:id].should == User.last.id
        cookies[:token].should == "rand_123_321"
      end

      it "should return the user" do
        make_request

        response.body.should == UserPresenter.new(User.last).to_json
      end

      describe "when given an invalid password" do
        before do
          defaults[:password] = "_invalid"
        end

        it "should be a 404" do
          make_request

          response.response_code.should == 404
        end

        it "should return json" do
          make_request

          response.body.should == '{}'
        end
      end

      describe "when not given a password" do
        before do
          defaults[:password] = ""
        end

        it "should be a 404" do
          make_request

          response.response_code.should == 404
        end

        it "should return json" do
          make_request

          response.body.should == '{}'
        end
      end
    end
  end

  describe "#destroy" do
    describe ".json" do
      let(:user) { FactoryGirl.create(:user) }

      def make_request
        xhr :delete, :destroy, format: :json, id: user.id
      end

      it "should be a 404" do
        make_request

        response.response_code.should == 404
      end

      it "should be json" do
        make_request

        response.body.should == '{}'
      end

      describe "when a user is signed in" do
        before do
          sign_in user
        end

        it "should be a 200" do
          make_request

          response.response_code.should == 200
        end

        it "should not remove the user" do
          expect {
            make_request
          }.not_to change(User, :count)
        end

        it "should remove the cookie" do
          make_request

          cookies[:id].should be_nil
          cookies[:token].should be_nil
        end

        it "should return the user" do
          make_request

          response.body.should == UserPresenter.new(user).to_json
        end
      end
    end
  end
end
