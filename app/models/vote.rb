class Vote < ApplicationRecord
	belongs_to :poll_option
	has_one :poll, :through => :poll_option
	belongs_to :user
	validates_presence_of :user_id, :poll_option_id
	validate :uniqueness_of_vote

	private

	def uniqueness_of_vote
	
	end
end
