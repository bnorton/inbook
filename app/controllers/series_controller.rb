class SeriesController < ApplicationController
  before_filter :authorize!

  def index
    respond_to do |type|
      type.json {
        render json: SeriesPresenter.new(current_user), status: :ok
      }
    end
  end
end
