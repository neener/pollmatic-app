class PollSerializer < ActiveModel::Serializer
  attributes :id, :question, :vote_count
  has_many :poll_options
end
