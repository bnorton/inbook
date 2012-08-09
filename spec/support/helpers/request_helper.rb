module RequestHelper
  extend ActiveSupport::Concern

  included do
    metadata[:js] = true
  end
end
