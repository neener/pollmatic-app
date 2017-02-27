class PollOption < ApplicationRecord
	has_one :user, :through => :poll
	belongs_to :poll
	has_many :votes
end
