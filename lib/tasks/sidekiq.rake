namespace :sidekiq do
  desc "Seed the Environment with default workers"
  task :seed => :environment do
    [FacebookPostsSeed].each do |klass|
      klass.seed
    end
  end
end
