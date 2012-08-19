Inbook::Application.routes.draw do
  resources :users, only: [:create, :update, :destroy] do
    member do
      resources :counts, only: [:index]
      resources :friends, only: [:index]
    end
  end

  root to: "dashboards#index"
end
