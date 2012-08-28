class User < ActiveRecord::Base
  EIGHT = 36**8

  attr_accessible :access_token, :access_token_expires, :graph_id, :name, :link, :gender, :username, :email, :birthday, :updated_time
  attr_reader :new_password

  has_many :facebook_posts
  has_many :facebook_comments
  has_many :facebook_likes
  has_many :friends do
    def added(s, e); where("added_at > ? AND added_at < ?", s, e) end
    def subtracted(s, e); where("subtracted_at > ? AND subtracted_at < ?", s, e) end
    def graph_ids; select(:graph_id).collect(&:graph_id) end
  end

  validates :graph_id, presence: true
  validate :unique_graph_id, on: :create

  before_create :set_token_and_password
  before_create :set_access_token_expires

  after_create :seed
  after_create :welcome

  scope :paid, where(:paid => true)

  def valid_password?(passworp=nil)
    !!passworp && password == Digest::SHA2.hexdigest(passworp + salt)
  end

  def password=(passworp)
    self.salt = Digest::SHA2.hexdigest(Time.now.to_f.to_s)
    write_attribute(:password, Digest::SHA2.hexdigest(passworp + salt))
  end

  def series(type)
    self.class.series_for(id, type)
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

  def seed
    [ExtendAccessToken, FacebookPosts, Friends].each do |fetcher|
      fetcher.perform_async(id, initial_import: true)
    end
  end

  def welcome
    Email.perform_async(:welcome, id, password: new_password)
  end

  def self.series_for(id, type=:posts)
    ActiveRecord::Base.connection.select_all(
      "SELECT COUNT(*) AS value, YEAR(created_time) as year, WEEK(created_time) as week FROM facebook_#{type} WHERE user_id = #{id} GROUP BY year, week"
    ).each_with_object({}) do |count, memo|
      group = Time.parse("01/01/#{count['year']}")
      since = count['week'].weeks.since(group).utc.beginning_of_day.iso8601

      memo[since] = count['value']
    end
  end
end
