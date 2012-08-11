class UsersController < ApplicationController
  before_filter :load_user, only: [:update, :destroy]

  def create
    @user = User.create(
      params.slice(:graph_id, :name, :username, :email, :birthday, :updated_time)
    )

    respond_to {|type|
      type.json {
        status, user = @user.persisted? ? (set_cookie && [201, @user]) : [401, User.find_by_graph_id(params[:graph_id])]

        render json: UserPresenter.new(user), status: status
      }
    }
  end

  def update
    respond_to {|type|
      type.json {
        status = (@user && @user.update_attributes(params.slice(:access_token)) && 200) || 404

        user = @user ? set_cookie && UserPresenter.new(@user) : {}

        render json: user, status: status
      }
    }
  end

  def destroy
    respond_to do |type|
      type.json {
        user, status = @user ? [UserPresenter.new(@user), remove_cookie && 200] : [{}, 404]

        render json: user, status: status
      }
    end
  end

  private

  def load_user
    @user = current_user
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
