class CreateFacebookComments < ActiveRecord::Migration
  def up
    create_table :facebook_comments do |t|
      t.timestamps
      t.belongs_to :user
      t.belongs_to :facebook_post
      t.string :graph_id
      t.string :message
      t.datetime :created_time
      t.integer :likes
    end

    add_index :facebook_comments, [:graph_id], name: "index_facebook_comments_on_graph_id"
    add_index :facebook_comments, [:facebook_post_id, :graph_id], unique: true, name: "facebook_comments_uniqueness"
  end

  def down
    remove_index :facebook_comments, name: "index_facebook_comments_on_graph_id"
    remove_index :facebook_comments, name: "facebook_comments_uniqueness"

    drop_table :facebook_comments
  end
end
