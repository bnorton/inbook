class FriendsMetadata
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)

    friends = []
    api.batch do |batch|
      user.friends.graph_ids.in_groups_of(500, false) do |group|
        batch.get_object("?ids=" + group.join(","))
      end
    end.each do |result|
      friends += result.values
    end

    friends.each do |friend|
      data = friend.slice(*%w(gender link))

      data.merge!(
        location_id: friend["location"]["id"],
        location_name: friend["location"]["name"]
      ) if friend["location"].present?

      user.friends.where(
        graph_id: friend["id"]
      ).update_all(data)
    end
  end
end
