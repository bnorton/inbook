class FacebookComments
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)

    user.facebook_posts.in_groups_of(50, false) do |group|
      results = api.batch do |batch|
        group.each do |post|
          batch.get_connections(post.graph_id, :comments, limit: 200)
        end
      end

      results.each_with_index do |comments, i|
        group[i].facebook_comments.create_batch(comments, user)
      end
    end
  end
end
