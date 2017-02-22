class PollOption < ApplicationRecord
	belongs_to :user
	belongs_to :poll
	has_many :votes
	validates_presence_of :user_id, :poll_id
end
