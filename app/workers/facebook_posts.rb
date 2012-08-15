class FacebookPosts
  include Sidekiq::Worker

  def perform(user_id)
    api = (user = User.find(user_id)) && Koala::Facebook::API.new(user.access_token)

    options, done, messages, latest = {
      limit: 200
    }, false, [], user.facebook_posts.order(:created_time).last

    options[:since] = latest.created_time.utc.to_i if latest

    feed = api.get_connections(:me, :feed, options)
    unless feed.blank?
      messages += feed

      until done
        feed = feed.next_page
        messages += feed

        done = feed.blank?
      end
    end

    user.facebook_posts.create_batch(messages)

    FacebookPostsCache.perform_async(user.id)
  end
end
