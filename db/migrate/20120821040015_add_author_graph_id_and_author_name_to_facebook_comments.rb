class AddAuthorGraphIdAndAuthorNameToFacebookComments < ActiveRecord::Migration
  def change
    add_column :facebook_comments, :author_name, :string
    add_column :facebook_comments, :author_graph_id, :string
  end
end
