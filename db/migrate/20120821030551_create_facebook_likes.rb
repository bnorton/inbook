class CreateFacebookLikes < ActiveRecord::Migration
  def up
    create_table :facebook_likes do |t|
      t.timestamps
      t.belongs_to :user
      t.belongs_to :facebook_post
      t.string :graph_id
      t.string :name
    end

    add_index :facebook_likes, [:graph_id], name: "index_facebook_likes_on_graph_id"
    add_index :facebook_likes, [:facebook_post_id, :graph_id], unique: true, name: "facebook_likes_uniqueness"
  end

  def down
    remove_index :facebook_likes, name: "index_facebook_likes_on_graph_id"
    remove_index :facebook_likes, name: "facebook_likes_uniqueness"

    drop_table :facebook_likes
  end
end
