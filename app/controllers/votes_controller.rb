class VotesController < ApplicationController

	def create
		@vote = Vote.create!(vote_params.merge(:user_id => current_user.id))
		redirect_to poll_path(id: vote_params[:poll_id])
	end

	private

	def vote_params
		params.require(:vote).permit(:poll_id, :poll_option_id)
	end
end