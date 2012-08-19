FactoryGirl.define do
  factory :friend do |f|
    f.association(:user, factory: :user)
    f.sequence(:graph_id) {|i| "111#{i}"}
    f.sequence(:name) {|i| "friend #{i}"}
  end
end
