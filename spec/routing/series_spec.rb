require "spec_helper"

describe "series" do
  it "should route GET users/1/series.json to series#index" do
    {get: "/users/1/series.json"}.should route_to(controller: "series", action: "index", id: "1", format: "json")
  end
end
