class CreateFacebookPosts < ActiveRecord::Migration
  def up
    create_table :facebook_posts do |t|
      t.timestamps
      t.belongs_to(:user)
      t.string :graph_id
      t.timestamp :created_time
      t.integer :likes
      t.integer :comments
      t.string :message
      t.string :message_type
      t.string :author_graph_id
      t.string :author_name
      t.string :object
      t.string :picture
      t.string :link
      t.string :name
      t.string :application_graph_id
      t.string :application_name
      t.string :privacy_description
      t.string :privacy_value
    end
  end

  def down
    drop_table :facebook_posts
  end
end
