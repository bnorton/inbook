# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120819233715) do

  create_table "facebook_posts", :force => true do |t|
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
    t.integer  "user_id"
    t.string   "graph_id"
    t.datetime "created_time"
    t.integer  "likes"
    t.integer  "comments"
    t.string   "message"
    t.string   "message_type"
    t.string   "author_graph_id"
    t.string   "author_name"
    t.string   "object"
    t.string   "picture"
    t.string   "link"
    t.string   "name"
    t.string   "application_graph_id"
    t.string   "application_name"
    t.string   "privacy_description"
    t.string   "privacy_value"
  end

  add_index "facebook_posts", ["user_id", "graph_id"], :name => "facebook_posts_uniqueness", :unique => true

  create_table "friends", :force => true do |t|
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.integer  "user_id"
    t.string   "graph_id"
    t.string   "name"
    t.datetime "added_at"
    t.datetime "subtracted_at"
    t.string   "location_id"
    t.string   "location_name"
    t.string   "link"
    t.string   "gender"
  end

  add_index "friends", ["user_id", "graph_id"], :name => "index_friends_on_user_id_and_graph_id", :unique => true

  create_table "users", :force => true do |t|
    t.datetime "created_at",                              :null => false
    t.datetime "updated_at",                              :null => false
    t.string   "name"
    t.string   "graph_id"
    t.string   "access_token"
    t.string   "username"
    t.string   "email"
    t.string   "birthday"
    t.string   "token"
    t.datetime "updated_time"
    t.string   "password"
    t.string   "salt"
    t.datetime "access_token_expires"
    t.boolean  "paid",                 :default => false
    t.string   "location_id"
    t.string   "location_name"
    t.string   "link"
    t.string   "gender"
  end

  add_index "users", ["graph_id"], :name => "index_users_on_graph_id"
  add_index "users", ["id", "token"], :name => "index_users_on_id_and_token"

end
