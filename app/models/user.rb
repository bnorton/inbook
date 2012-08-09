class User < ActiveRecord::Base
  attr_accessible :access_token, :graph_id, :name, :username, :email, :birthday, :updated_time

  validates :graph_id, :access_token, :presence => true
  validate :unique_graph_id, :on => :create

  before_create :set_token
  after_create :extend_token

  private

  def unique_graph_id
    if self.class.where(:graph_id => graph_id).any?
      errors.add(:graph_id, :taken)
    end
  end

  def set_token
    self.token = Digest::SHA2.hexdigest rand(1_000_000).to_s
  end

  def extend_token
    ExtendAccessToken.perform_async(id)
  end
end
