FactoryGirl.define do
  factory :facebook_like do |like|
    like.association(:user, factory: :user)
    like.sequence(:graph_id) {|i| "12_34_#{i}" }
    like.sequence(:name) {|i| "Liker #{i}" }
  end
end
