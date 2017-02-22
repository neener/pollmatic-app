class Vote < ApplicationRecord
	belongs_to :poll_option
	belongs_to :user
	validates_presence_of :user_id, :poll_option_id
	# allow each user to only be able to vote on a poll once
	validates_uniqueness_of :user_id, scope: :poll_option_id
end
