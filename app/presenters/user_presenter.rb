class UserPresenter
  ATTRIBUTES = %w(id graph_id access_token name username updated_time).freeze
  PUBLIC = %w(id graph_id name username).freeze

 def initialize(user)
   @user = user
 end

  def public
    self.tap { @public = true }
  end

  def as_json(*)
    @user.attributes.slice(*(@public ? PUBLIC : ATTRIBUTES))
  end
end
