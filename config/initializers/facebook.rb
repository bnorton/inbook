require "facebook"

if config = YAML.load(IO.read(Rails.root.join("config", "facebook.yml")))[Rails.env]
  Facebook.id = config['id']
  Facebook.secret = config['secret']
end
