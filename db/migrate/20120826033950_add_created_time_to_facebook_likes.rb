class AddCreatedTimeToFacebookLikes < ActiveRecord::Migration
  def change
    add_column :facebook_likes, :created_time, :datetime
  end
end
