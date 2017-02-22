class PollOption < ApplicationRecord
	has_one :user, :through => :poll
	belongs_to :poll
	has_many :votes
	validates_presence_of :poll_id
end
