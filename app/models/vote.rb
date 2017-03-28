class Vote < ApplicationRecord
	belongs_to :poll_option
	has_one :poll, :through => :poll_option
	belongs_to :user
	validates_presence_of :user_id, :poll_option_id
	validates_uniqueness_of :user_id, scope: :poll_id

	validate :poll_is_active?

	after_create :increment_vote_count

	def poll_is_active?
		self.errors.add(:poll, "Poll must be active to create a new vote") if self.poll.expired?
	end

	private

	def increment_vote_count
		self.poll.update({vote_count: self.poll.vote_count + 1})
	end
end
