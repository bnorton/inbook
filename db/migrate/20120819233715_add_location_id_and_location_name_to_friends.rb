class AddLocationIdAndLocationNameToFriends < ActiveRecord::Migration
  def change
    add_column :friends, :location_id, :string
    add_column :friends, :location_name, :string
    add_column :friends, :link, :string
    add_column :friends, :gender, :string

    add_column :users, :location_id, :string
    add_column :users, :location_name, :string
    add_column :users, :link, :string
    add_column :users, :gender, :string
  end
end
