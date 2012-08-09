class ExtendAccessToken
  include Sidekiq::Worker

  def perform(user_id)
    oauth = Koala::Facebook::OAuth.new(Facebook.id, Facebook.secret)
    user = User.select([:id, :graph_id, :access_token]).find(user_id)

    user.update_attributes access_token: oauth.exchange_access_token(user.access_token)
  end
end
