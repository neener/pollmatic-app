class PollSerializer < ActiveModel::Serializer
  attributes :id, :question, :vote_count, :results, :current_user_has_voted, :expired
  has_many :poll_options

  def current_user_has_voted
  	return false unless scope.current_user
  	scope.current_user.voted_on?(object.id)
  end

  def expired
  	object.expired?
  end
  
end
