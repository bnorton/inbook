Inbook::Application.routes.draw do
  resources :users, only: [:create, :update, :destroy]

  root to: "dashboards#index"
end
