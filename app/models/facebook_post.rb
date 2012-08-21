class FacebookPost < ActiveRecord::Base
  attr_accessible :graph_id, :message, :message_type, :created_time, :object, :picture, :link, :name, :author_graph_id, :author_name, :application_graph_id, :application_name, :privacy_value, :privacy_description, :likes, :comments

  belongs_to :user
  has_many :facebook_comments

  validates :user_id, :graph_id, :message_type, :created_time, :author_graph_id, presence: true

  def self.create_batch(hashes)
    posts = hashes.collect do |hash|
      build_from_hash hash
    end

    import posts, validate: true
  end

  def self.build_from_hash(hash)
    attrs = hash.slice(*%w(message created_time picture link name))
    attrs.merge!(
      graph_id: hash['id'],
      message_type: hash['type'],
      object: hash['object_id'],
      author_graph_id: hash['from']['id'],
      author_name: hash['from']['name']
    )

    attrs.merge!(
      application_graph_id: hash['application']['id'],
      application_name: hash['application']['name']
    ) if hash['application']

    attrs.merge!(
      privacy_value: hash['privacy']['value'],
      privacy_description: hash['privacy']['description']
    ) if hash['privacy']

    attrs[:likes]    = hash['likes']['count'] if hash['likes']
    attrs[:comments] = hash['comments']['count'] if hash['comments']

    FacebookPost.new(attrs)
  end

  def self.from_for(user)
    ActiveRecord::Base.connection.select_all(
      "SELECT
        author_name as name,
        author_graph_id as graph_id,
        COUNT(*) as count
      FROM facebook_posts
        WHERE user_id = #{user.id}
        GROUP BY author_graph_id
        ORDER BY COUNT(*) DESC
      LIMIT 11"
    ).reject {|u| u['graph_id'] == user.graph_id }
  end
end
