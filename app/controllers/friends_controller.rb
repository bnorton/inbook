class FriendsController < ApplicationController

  def index
    user = current_user
    dstart, dend = parse_dates

    respond_to do |type|
      type.json {
        render json: {
          count: user.friends.count,
          added: FriendPresenter.from_array(user.friends.added(dstart, dend)),
          subtracted: FriendPresenter.from_array(user.friends.subtracted(dstart, dend))
        }, status: 200
      }
    end
  end

  private

  def parse_dates
    s = (params[:start] && Time.parse(params[:start])) || 7.days.ago
    e = (params[:start] && params[:end] && Time.parse(params[:end])) || Time.now

    [s, e].sort
  end
end
