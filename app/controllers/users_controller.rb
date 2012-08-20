class UsersController < ApplicationController
  before_filter :authorize!, only: [:update, :destroy]

  def create
    @user = User.create(
      params.slice(:graph_id, :access_token, :name, :username, :gender, :link, :email, :birthday, :updated_time)
    )

    user, @status = @user.persisted? ? (set_cookie && [UserPresenter.new(@user), 201]) : [UserPresenter.new(User.find_by_graph_id(params[:graph_id])).public, 401]

    respond_with_json(user)
  end

  def update
    @user.update_attributes(params.slice(:access_token)) && set_cookie

    respond_with_json
  end

  def destroy
    remove_cookie

    respond_with_json
  end

  private

  def respond_with_json(user=nil)
    respond_to {|type|
      type.json {
        render json: user || UserPresenter.new(@user), status: @status || 200
      }
    }
  end

  def set_cookie
    cookies[:id] = @user.id
    cookies[:token] = @user.token
  end

  def remove_cookie
    cookies[:id] = nil
    cookies[:token] = nil
    true
  end
end
