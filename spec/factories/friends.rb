FactoryGirl.define do
  factory :friend do |f|
    f.association(:user, factory: :user)
    f.sequence(:graph_id) {|i| "111#{i}"}
    f.sequence(:name) {|i| "friend #{i}"}
    f.sequence(:link) {|i| "http://facebook.com/#{i}/"}
    f.gender "female"
  end
end
