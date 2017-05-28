Rails.application.routes.draw do
  root to: 'stats#index'

  require 'sidekiq/web'

  resources :resources
  mount Sidekiq::Web, at: 'sidekiq'
  mount PgHero::Engine, at: 'pghero'
end
