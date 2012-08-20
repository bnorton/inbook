class FriendPresenter
  def self.from_array(friends)
    friends.collect do |friend|
      new(friend)
    end
  end

  def initialize(friend)
    @friend = friend
  end

  def as_json(*)
    @friend.attributes.slice(
      *%w(id graph_id name gender link added_at subtracted_at)
    )
  end
end
