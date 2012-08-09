Inbook::Application.routes.draw do
  resources :users, only: [:create, :update]

  root :to => "dashboards#index"
end
