class FacebookPostsCache
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)

    comments = user.facebook_posts.sum(:comments)
    likes = user.facebook_posts.sum(:likes)

    R.set(user.id, :counts,
      posts: user.facebook_posts.count,
      comments: comments,
      likes: likes
    )
  end
end
