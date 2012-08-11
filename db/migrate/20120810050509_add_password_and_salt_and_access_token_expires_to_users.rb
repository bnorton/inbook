class AddPasswordAndSaltAndAccessTokenExpiresToUsers < ActiveRecord::Migration
  def change
    add_column :users, :password, :string
    add_column :users, :salt, :string

    add_column :users, :access_token_expires, :timestamp
  end
end
