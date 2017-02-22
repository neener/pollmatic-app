class Poll < ApplicationRecord
	belongs_to :user
	has_many :poll_options
	has_many :votes, through: :poll_options
	validates_presence_of :user_id, :question
end
