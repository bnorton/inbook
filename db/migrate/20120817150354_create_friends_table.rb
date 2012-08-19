class CreateFriendsTable < ActiveRecord::Migration
  def up
    create_table :friends do |t|
      t.timestamps
      t.belongs_to :user
      t.string :graph_id
      t.string :name
      t.datetime :added_at
      t.datetime :subtracted_at
    end

    add_index :friends, [:user_id, :graph_id], unique: true
  end

  def down
    remove_index :friends, name: "index_friends_on_user_id_and_graph_id"

    drop_table :friends
  end
end
