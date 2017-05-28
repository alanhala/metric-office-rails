Rails.application.routes.draw do
  root to: 'realtime#index'

  require 'sidekiq/web'

  resources :resources
  resources :historicals
  resources :stats

  mount Sidekiq::Web, at: 'sidekiq'
  mount PgHero::Engine, at: 'pghero'
end
