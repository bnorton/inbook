class CreateUsersTable < ActiveRecord::Migration
  def up
    create_table :users do |t|
      t.timestamps
      t.string   :name
      t.string   :graph_id
      t.string   :access_token
      t.string   :username
      t.string   :email
      t.string   :birthday
      t.string   :token
      t.datetime :updated_time
    end

    add_index :users, :graph_id, :name => "index_users_on_graph_id"
    add_index :users, [:id, :token], :name => "index_users_on_id_and_token"
  end

  def down
    remove_index :users, :name => "index_users_on_graph_id"
    remove_index :users, :name => "index_users_on_id_and_token"

    drop_table :users
  end
end
