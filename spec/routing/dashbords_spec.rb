require "spec_helper"

describe "dashboard" do
  it "should route GET / to dashboards#index" do
    {get: "/"}.should route_to(controller: "dashboards", action: "index")
  end
end
