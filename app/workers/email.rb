class Email
  include Sidekiq::Worker

  def perform(method, user_id, options)
    UserMailer.send(method, User.find(user_id), options.symbolize_keys).deliver
  end
end
