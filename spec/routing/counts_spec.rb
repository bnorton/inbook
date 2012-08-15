require "spec_helper"

describe "counts" do
  it "should route GET users/1/counts.json to counts#index" do
    {get: "/users/1/counts.json"}.should route_to(controller: "counts", action: "index", id: "1", format: "json")
  end
end
