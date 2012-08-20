class Friends
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)
    friends = api.get_connections(:me, :friends)

    user.friends.create_batch(friends)

    subtracted = user.friends.graph_ids - friends.collect {|friend| friend["id"]}
    user.friends.where(:graph_id => subtracted).update_all(:subtracted_at => Time.now)

    FriendsMetadata.perform_async(user_id)
  end
end
