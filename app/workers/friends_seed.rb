class FriendsSeed
  include Sidekiq::Worker
  sidekiq_options retry: true, queue: :default, unique: true

  def self.seed
    perform_at(Time.now.end_of_hour)
  end

  def perform(options={})
    User.select(:id).paid.each do |user|
      Friends.perform_async(user.id)
    end

    self.class.seed
  end
end
