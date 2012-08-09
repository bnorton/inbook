ENV["RAILS_ENV"] ||= 'test'

require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'capybara/rspec'
require 'rspec/expectations'
require 'webmock/rspec'

Dir[Rails.root.join('spec/support/**/*.rb')].each {|file| require file}

Rails.logger.info "\n[#{Time.now.utc}] - Logging with level ERROR (4). see #{__FILE__}:21"
Rails.logger.level = 4

RSpec.configure do |config|
  config.mock_with :rspec
  config.use_transactional_fixtures = false
  config.infer_base_class_for_anonymous_controllers = false
  config.order = 'random'

  config.include RequestHelper, :type => :request
  config.include ControllerHelper, :type => :controller

  config.before :suite do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with :truncation
  end

  config.before :each do
    if example.metadata[:js]
      DatabaseCleaner.strategy = :truncation
    else
      DatabaseCleaner.start
    end

    WebMock.disable_net_connect!(:allow_localhost => true)
    [ExtendAccessToken].each do |worker|
      worker.stub(:perform_async)
    end
  end

  config.after :each do
    WebMock.allow_net_connect!
    Timecop.return

    DatabaseCleaner.clean
    if example.metadata[:js]
      DatabaseCleaner.strategy = :transaction
    end
  end
end
