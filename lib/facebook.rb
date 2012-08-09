module Facebook
  mattr_accessor :id, :secret

  def self.access_token
    @access_token ||= Koala::Facebook::OAuth.new(id, secret).get_app_access_token
  end
end
