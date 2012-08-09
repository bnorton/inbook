class UsersController < ApplicationController
  def create
    new_user = User.create(params.slice(:access_token, :graph_id, :name, :username, :email, :birthday, :created_time))
    user, status = new_user.persisted? ? [new_user, 201] : [User.where(:graph_id => params[:graph_id]).first, 200]

    set_cookie(user)

    respond_to {|type|
      type.json {
        render json: UserPresenter.new(user), status: status
      }
    }
  end

  def update
    user = current_user

    respond_to {|type|
      type.json {
        if user && user.id == params[:id].to_i && user.update_attributes(params.slice(:access_token))
          status = 200
        else
          status = 404
        end

        render json: UserPresenter.new(user), status: status
      }
    }

  end

  private

  def set_cookie(user)
    cookies[:id] = user.id
    cookies[:token] = user.token
  end
end
