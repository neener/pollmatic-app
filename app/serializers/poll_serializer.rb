class PollSerializer < ActiveModel::Serializer
  attributes :id, :question, :vote_count, :results, :current_user_has_voted
  has_many :poll_options

  def current_user_has_voted
  	scope.current_user.voted_on?(object.id)
  end
end
