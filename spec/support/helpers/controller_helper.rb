module ControllerHelper
  extend ActiveSupport::Concern

  def sign_in(user)
    cookies[:id] = user.id
    cookies[:token] = user.token
  end
end
