class FacebookLikes
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)

    user.facebook_posts.in_groups_of(50, false) do |group|
      results = api.batch do |batch|
        group.each do |post|
          batch.get_connections(post.graph_id, :likes, limit: 500)
        end
      end

      results.each_with_index do |likes, i|
        group[i].facebook_likes.create_batch(likes, user)
      end
    end
  end
end
