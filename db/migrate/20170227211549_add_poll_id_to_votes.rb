class AddPollIdToVotes < ActiveRecord::Migration[5.0]
  def change
  	add_column :votes, :poll_id, :integer
  	change_column_null :votes, :poll_id, false
  end
end
