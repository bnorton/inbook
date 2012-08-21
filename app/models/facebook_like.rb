class FacebookLike < ActiveRecord::Base
  attr_accessible :name, :user, :graph_id

  belongs_to :user
  belongs_to :facebook_post

  def self.create_batch(hashes, user)
    likes = hashes.collect do |hash|
      build_from_hash(hash, user)
    end

    import likes, validate: true

  end

  def self.build_from_hash(hash, user)
    new(
      hash.slice(*%w(name)).merge(
        user: user,
        graph_id: hash["id"]
      )
    )
  end
end
