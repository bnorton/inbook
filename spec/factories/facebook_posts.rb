FactoryGirl.define do
  factory :facebook_post do |post|
    post.sequence(:graph_id) {|i| "fbp_graph_id_#{i}" }
    post.sequence(:message) {|i| "Facebook Post #{i}" }
    post.message_type { "status" }
    post.sequence(:author_graph_id) {|i| "author_of_#{i}" }
    post.sequence(:created_time) {|i| 10.day.ago + i.hours }
    post.association(:user, :factory => :user)
  end
end
