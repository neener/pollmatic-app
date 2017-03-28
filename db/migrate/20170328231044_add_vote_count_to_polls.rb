class AddVoteCountToPolls < ActiveRecord::Migration[5.0]
  def change
    add_column :polls, :vote_count, :integer, null: false, default: 0
    Poll.where("vote_count is null or vote_count=0").find_each do |poll|
    	poll.update({vote_count: poll.votes.count})
    end
  end
end
