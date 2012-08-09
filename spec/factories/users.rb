FactoryGirl.define do
  factory :user do |user|
    user.sequence(:name) {|i| "John #{i+1} Doe"}
    user.sequence(:graph_id) {|i| "123_" + (i+1).to_s}
    user.sequence(:access_token) {|i| "token_" + (i+1).to_s}
    user.sequence(:email) {|i| "john+#{i+1}@example.com"}
  end
end
