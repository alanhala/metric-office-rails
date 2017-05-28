Rails.application.routes.draw do
  root to: 'realtime#index'

  require 'sidekiq/web'

  resources :resources
  resources :historicals
  resources :stats

  mount Sidekiq::Web, at: 'sidekiq'
  mount PgHero::Engine, at: 'pghero'

  post '/hall_connections/connect', to: 'hall_connections#connect'
  post '/hall_connections/disconnect', to: 'hall_connections#disconnect'
  get '/hall_connections', to: 'hall_connections#index'
end
