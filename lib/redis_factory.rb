class RedisFactory
  cattr_accessor :_methods

  class NotRegistered < Exception; end

  def self.define(name, &block)
    _methods[name] = block
  end

  def self.create(name, options)
    raise NotRegistered("RedisFactory##{name} is not defined. Use RedisFactory.define(:name, &block) to defined factories.") unless _methods[name]

    Sidekiq.redis do |redis|
      _methods[name].call(redis, options)
    end
  end
end
