class FacebookPostsCache
  include Sidekiq::Worker

  def perform(user_id, options={})
    User.find(user_id).tap do |user|
      user.update_attributes(updated_time: user.facebook_posts.maximum(:created_time))

      R.set(user.id, :counts,
        posts: user.facebook_posts.count,
        comments: user.facebook_posts.sum(:comments),
        likes: user.facebook_posts.sum(:likes)
      )
    end
  end
end
