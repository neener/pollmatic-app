Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks", :registrations => "users/registrations" }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get 'polls/expired' => 'polls#expired'
  
  resources :polls, except: [:edit, :update]
  resources :votes, only: [:create]

  get 'users/:id/votes' => 'users#votes_index'

  root 'home#index'

  
end
