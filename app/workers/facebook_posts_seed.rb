class FacebookPostsSeed
  include Sidekiq::Worker
  sidekiq_options retry: true, queue: :default, unique: true

  def self.seed
    perform_at(Time.now.end_of_hour)
  end

  def perform
    User.select(:id).paid.each do |user|
      FacebookPosts.perform_async(user.id)
    end

    self.class.seed
  end
end
