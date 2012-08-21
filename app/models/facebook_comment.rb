class FacebookComment < ActiveRecord::Base
  attr_accessible :user, :message, :created_time, :graph_id, :likes

  belongs_to :user
  belongs_to :facebook_post

  def self.create_batch(hashes, user)
    comments = hashes.collect do |hash|
      build_from_hash(hash, user)
    end

    import comments, validate: true, on_duplicate_key_update: [:updated_at, :likes]
  end

  def self.build_from_hash(hash, user)
    new(
      hash.slice(*%w(message created_time)).merge(
        user: user,
        graph_id: hash["id"],
        likes: hash["likes_count"]
      )
    )
  end
end
