class PollSerializer < ActiveModel::Serializer
  attributes :id, :question, :vote_count, :results
  has_many :poll_options
end
