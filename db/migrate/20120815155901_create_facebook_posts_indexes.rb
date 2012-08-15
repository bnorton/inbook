class CreateFacebookPostsIndexes < ActiveRecord::Migration
  def up
    add_index :facebook_posts, [:user_id, :graph_id], :unique => true, :name => "facebook_posts_uniqueness"
  end

  def down
    remove_index :facebook_posts, :name => "facebook_posts_uniqueness"
  end
end
