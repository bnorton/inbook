class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user
  helper_method :authorize!

  private

  def authorize!
    unless current_user
      respond_to do |type|
        type.json {
          render json: {}, status: :not_found
        }
      end
    end
  end

  def current_user
    @user ||= begin
      (!!cookies[:id] &&
        User.where(id: cookies[:id], token: cookies[:token]).first
      ) ||
      (!!params[:id] &&
        ((user = User.find(params[:id])).valid_password?(params[:password]) ? user : nil)
      )
    end
  end
end
