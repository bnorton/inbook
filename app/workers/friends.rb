class Friends
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)

    user.friends.create_batch(
      api.get_connections(:me, :friends)
    )
  end
end
