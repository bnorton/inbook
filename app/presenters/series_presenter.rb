class SeriesPresenter
  def initialize(user)
    @user = user
  end

  def as_json(*)
    {
      'posts' => @user.series(:posts),
      'likes' => @user.series(:likes),
      'comments' => @user.series(:comments)
    }
  end
end
