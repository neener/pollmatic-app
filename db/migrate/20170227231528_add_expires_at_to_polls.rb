class AddExpiresAtToPolls < ActiveRecord::Migration[5.0]
  def change
    add_column :polls, :expires_at, :datetime
  	change_column_null :polls, :expires_at, false
  end
end
