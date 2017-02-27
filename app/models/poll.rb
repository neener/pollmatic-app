class Poll < ApplicationRecord
	belongs_to :user
	has_many :poll_options
	has_many :votes, through: :poll_options
	validates_presence_of :user_id, :question

	def poll_option_options=(options)
		options.each do |option|
			self.poll_options.build(option: option)
		end
	end
end
