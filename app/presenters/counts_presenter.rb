class CountsPresenter
  def initialize(user)
    @user = user
  end

  def as_json(*)
    counts = R.get(@user.id, :counts, json: true)

    {
      'posts'   => {
        'count' => counts[:posts],
        'type'  => @user.facebook_posts.group(:message_type).count
      },
      'comments'=> {
        'count' => counts[:comments],
        'name' => @user.facebook_comments.group(:author_name).count
      },
      'likes'   => {
        'count' => counts[:likes],
        'name' => @user.facebook_likes.group(:name).count
      },
      'from'    => FacebookPost.from_for(@user)
    }
  end
end
