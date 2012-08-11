if defined?(RSpec)
  require "rspec/core/rake_task"

  Rake::TaskManager.class_eval do
    def remove_task(task_name)
      @tasks.delete(task_name.to_s)
    end
  end

  def remove_task(task_name)
    Rake.application.remove_task(task_name)
  end

  remove_task :spec
  desc "Run all specs in spec directory (excluding plugin specs)"
  RSpec::Core::RakeTask.new(spec: "db:test:prepare") do |t|
    t.rspec_opts = "--tag ~type:external"
  end

  namespace :spec do
    desc "Run all external specs"
    RSpec::Core::RakeTask.new(externals: "db:test:prepare") do |t|
      t.rspec_opts = "--tag type:external"
    end
  end
end
