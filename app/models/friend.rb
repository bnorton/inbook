class Friend < ActiveRecord::Base
  attr_accessible :graph_id, :name, :added_at, :subtracted_at

  belongs_to :user

  def self.create_batch(hashes)
    friends = hashes.collect do |hash|
      build_from_hash(hash)
    end

    import friends, validate: true
  end

  def self.build_from_hash(hash)
    new(
      hash.slice(*%w(name added_at)).merge(
        graph_id: hash["id"]
      )
    )
  end
end
