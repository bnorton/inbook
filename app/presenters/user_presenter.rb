class UserPresenter
  ATTRIBUTES = %w(id graph_id access_token name username updated_time).freeze

 def initialize(user)
   @user = user
 end

  def as_json(*)
    @user.attributes.slice(*ATTRIBUTES)
  end
end
