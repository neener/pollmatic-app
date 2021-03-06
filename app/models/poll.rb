class Poll < ApplicationRecord
	belongs_to :user
	has_many :poll_options
	has_many :votes, through: :poll_options
	validates :poll_options, presence: true, length: { minimum: 2, too_short: "(minimum is 2)"}
	validates_presence_of :user_id, :question

	def poll_options=(poll_options)
		poll_options.reject(&:blank?).each do |option|
			self.poll_options.build(option: option)
		end
	end

	def results
		poll_options.map do |poll_option|
			[poll_option.option, poll_option.votes.count]
		end
	end

	def expired?
		self.expires_at < Time.now
	end

	def self.expired
		where "expires_at < ?", Time.now
	end

	def self.active
		where "expires_at >= ?", Time.now
	end

	def self.most_popular
		where("1 = 1").order('vote_count DESC')
	end

	def next
		poll = Poll.where("id > ?", id).first

		if poll
			poll
		else
			Poll.first
		end
	end

end
