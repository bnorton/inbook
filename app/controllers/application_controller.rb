class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user

  private

  def current_user
    User.where(:id => cookies[:id], :token => cookies[:token]).first
  end
end
