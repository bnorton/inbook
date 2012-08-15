require "redis_factory"

RedisFactory._methods = {}

module R
  def self.redis
    Sidekiq.redis do |redis|
      yield redis if block_given?
    end
  end

  def self.get(primary, key, options)
    redis do |r|
      value = r.hget(primary, key)

      if options[:json]
        value ? MultiJson.load(value, :symbolize_keys => true) : {}
      else
        value
      end
    end
  end

  def self.set(primary, key, value)
    redis do |r|
      value = MultiJson.dump(value) if value.is_a?(Hash)
      r.hset(primary, key, value)
    end
  end
end
