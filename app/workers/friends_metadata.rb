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
      list = result.values
      list.select! {|friend| friend["location"].present? }

      friends += list
    end

    friends.each do |friend|
      user.friends.where(graph_id: friend["id"]).update_all(
        location_id: friend["location"]["id"],
        location_name: friend["location"]["name"]
      )
    end
  end
end
