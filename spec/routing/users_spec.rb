require "spec_helper"

describe "users" do
  it "should route POST /users.json to users#create" do
    {post: "users.json"}.should route_to(controller: "users", action: "create", format: "json")
  end

  it "should route PUT /users/1.json to users#update" do
    {put: "users/1.json"}.should route_to(controller: "users", action: "update", format: "json", id: "1")
  end

  it "should route DELETE /users/1.json to users#destroy" do
    {delete: "users/1.json"}.should route_to(controller: "users", action: "destroy", format: "json", id: "1")
  end
end
