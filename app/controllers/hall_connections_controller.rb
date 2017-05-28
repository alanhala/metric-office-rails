class HallConnectionsController < ApplicationController
  def connect
    user = User.find_or_create_by(mac_address: params[:mac_address])
    HallConnection.create(user: user, from: DateTime.current)
    head :created
  end

  def disconnect
    user = User.find_by(mac_address: params[:mac_address])
    hall_connection = HallConnection.where(user: user).order(:created_at).last
    hall_connection.update_attributes(to: DateTime.current)
    head :created
  end

  def index
    hall_connections = HallConnection.where(to: nil)
    json = hall_connections.map { |hall_connection| { from: hall_connection.from, to: hall_connection.to, user: { mac_address: hall_connection.user.mac_address, role: hall_connection.user.role } } }
    render json: json
  end
end
