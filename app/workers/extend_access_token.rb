class ExtendAccessToken
  include Sidekiq::Worker

  def perform(user_id)
    User.select([:id, :graph_id, :access_token]).find(user_id).tap do |user|

      user.update_attributes(
        access_token: oauth.exchange_access_token(user.access_token),
        access_token_expires: 2.months.from_now
      )
    end
  end

  def oauth
    Koala::Facebook::OAuth.new(Facebook.id, Facebook.secret)
  end
end
