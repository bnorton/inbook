class User < ActiveRecord::Base
  EIGHT = 36**8

  attr_accessible :access_token, :access_token_expires, :graph_id, :name, :username, :email, :birthday, :updated_time
  attr_reader :new_password

  has_many :facebook_posts

  validates :graph_id, presence: true
  validate :unique_graph_id, on: :create

  before_create :set_token_and_password
  before_create :set_access_token_expires

  after_create :extend_token
  after_create :welcome

  def valid_password?(passworp=nil)
    !!passworp && password == Digest::SHA2.hexdigest(passworp + salt)
  end

  def password=(passworp)
    self.salt = Digest::SHA2.hexdigest(Time.now.to_f.to_s)
    write_attribute(:password, Digest::SHA2.hexdigest(passworp + salt))
  end

  private

  def unique_graph_id
    if self.class.where(graph_id: graph_id).any?
      errors.add(:graph_id, :taken)
    end
  end

  def set_token_and_password
    @new_password = rand(EIGHT).to_s(36)
    self.password = @new_password
    self.token = Digest::SHA2.hexdigest rand(1_000_000).to_s
  end

  def set_access_token_expires
    self.access_token_expires = 2.hours.from_now
  end

  def extend_token
    ExtendAccessToken.perform_async(id)
  end

  def welcome
    Email.perform_async(:welcome, id, password: new_password)
  end
end
