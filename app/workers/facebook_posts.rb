class FacebookPosts
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)

    messages, options, any, latest = [], {
      limit: 100
    }, false, user.facebook_posts.order(:created_time).last

    feed = api.get_connections(:me, :feed, options)

    loop do
      any = feed.select! do |message|
        Time.parse(message["created_time"]) > latest.created_time
      end if latest

      messages += feed
      break if (feed.blank? || any)

      feed = (feed.next_page || [])
    end

    user.facebook_posts.create_batch(messages)

    [FacebookPostsCache, FacebookComments].each do |worker|
      worker.perform_async(user.id)
    end
  end
end
