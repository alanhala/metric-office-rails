class CreateHallConnections < ActiveRecord::Migration[5.0]
  def change
    create_table :hall_connections do |t|
      t.belongs_to :user, foreign_key: true
      t.datetime :from
      t.datetime :to

      t.timestamps
    end
  end
end
