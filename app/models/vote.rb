class Vote < ApplicationRecord
	belongs_to :poll_option
	has_one :poll, :through => :poll_option
	belongs_to :user
	validates_presence_of :user_id, :poll_option_id
	validates_uniqueness_of :user_id, scope: :poll_id
end
