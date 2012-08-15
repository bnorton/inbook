class CountsController < ApplicationController
  def index
    authorize!

    respond_to do |type|
      type.json {
        render json: CountsPresenter.new(current_user), status: :ok
      }
    end
  end
end
