class FacebookPosts
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)

    messages = (options = {
      limit: 100
    }) && (feed = api.get_connections(:me, :feed, options))

    loop do
      break if feed.blank?

      messages += (feed = feed.next_page || [])
    end

    user.facebook_posts.create_batch(messages)

    [FacebookPostsCache, FacebookComments, FacebookLikes].each do |worker|
      worker.perform_async(user.id)
    end
  end
end
