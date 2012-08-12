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

ActiveRecord::Schema.define(:version => 20120812183046) do

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
  end

  add_index "users", ["graph_id"], :name => "index_users_on_graph_id"
  add_index "users", ["id", "token"], :name => "index_users_on_id_and_token"

end
