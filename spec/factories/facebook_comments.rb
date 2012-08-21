FactoryGirl.define do
  factory :facebook_comment do |comment|
    comment.association(:user, factory: :user)
    comment.sequence(:graph_id) {|i| "12_34_#{i}" }
    comment.sequence(:author_name) {|i| "Commenter #{i}" }
  end
end
