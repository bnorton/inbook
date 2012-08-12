class UsersController < ApplicationController
  before_filter :load_user, only: [:update, :destroy]

  def create
    @user = User.create(
      params.slice(:graph_id, :access_token, :name, :username, :email, :birthday, :updated_time)
    )

    @user, @status = @user.persisted? ? (set_cookie && [UserPresenter.new(@user), 201]) : [UserPresenter.new(User.find_by_graph_id(params[:graph_id])).public, 401]

    respond_with_json
  end

  def update
    @status = (@user && @user.update_attributes(params.slice(:access_token)) && 200) || 404
    @user   = @user ? set_cookie && UserPresenter.new(@user) : {}

    respond_with_json
  end

  def destroy
    @user, @status = @user ? [UserPresenter.new(@user), remove_cookie && 200] : [{}, 404]

    respond_with_json
  end

  private

  def load_user
    @user = current_user
  end

  def respond_with_json
    respond_to {|type|
      type.json {
        render json: @user, status: @status
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
