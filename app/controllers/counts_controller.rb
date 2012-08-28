class CountsController < ApplicationController
  before_filter :authorize!

  def index
    respond_to do |type|
      type.json {
        render json: CountsPresenter.new(current_user), status: :ok
      }
    end
  end
end
