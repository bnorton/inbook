RedisFactory.define :counts do |redis, options|
  redis.hset options[:user].id, :counts, MultiJson.dump(options.slice(:posts, :comments, :likes))
end
