class CountsPresenter
  def initialize(user)
    @user = user
  end

  def as_json(*)
    counts = R.get(@user.id, :counts, json: true)

    {
      'posts'    => { 'count' => counts[:posts] },
      'comments' => { 'count' => counts[:comments] },
      'likes'    => { 'count' => counts[:likes] },
      'type'     => @user.facebook_posts.group(:message_type).count,
      'from'     => FacebookPost.from_for(@user)
    }
  end
end
