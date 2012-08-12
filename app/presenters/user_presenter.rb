class UserPresenter
  ATTRIBUTES = %w(id graph_id access_token name username updated_time paid).freeze
  PUBLIC = %w(id graph_id name username).freeze

 def initialize(user)
   @user = user
 end

  def public
    self.tap { @public = true }
  end

  def as_json(*)
    attrs = @public ? PUBLIC : ATTRIBUTES

    @user.attributes.slice(*attrs)
  end
end
