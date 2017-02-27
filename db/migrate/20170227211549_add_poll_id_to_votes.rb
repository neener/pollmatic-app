class AddPollIdToVotes < ActiveRecord::Migration[5.0]
  def change
  	add_column :votes, :poll_id, :integer
  end
end
