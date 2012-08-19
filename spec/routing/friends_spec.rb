require "spec_helper"

describe "friends" do
  it "should route GET users/1/friends.json to friends#index" do
    {get: "/users/1/friends.json"}.should route_to(controller: "friends", action: "index", id: "1", format: "json")
  end
end
