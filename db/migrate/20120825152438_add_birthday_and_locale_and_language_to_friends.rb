class AddBirthdayAndLocaleAndLanguageToFriends < ActiveRecord::Migration
  def change
    add_column :friends, :birthday, :string
    add_column :friends, :locale, :string
    add_column :friends, :language_id, :string
    add_column :friends, :language_name, :string
  end
end
