class PollsController < ApplicationController
	before_action :authenticate_user!, only: [:new, :create, :destroy]
	
	def index
		@polls = Poll.active
	end

	def new
		@poll = Poll.new
	end

	def create
		@poll = Poll.create!(poll_params.merge(:expires_at => Time.now + 24.hours, :user_id => current_user.id))
		redirect_to poll_path(@poll)
	end

	def show
		@poll = Poll.find(params[:id])
		if current_user.voted_on?(params[:id]) || @poll.expired?
			@results = @poll.results
			render :show
		else 
			@vote = Vote.new
			render :form
		end
	end

	def destroy
		@poll = Poll.find(params[:id])
		if current_user.id = poll.user_id
			@poll.destroy
			redirect_to polls_path
		else
			render :file => "public/401.html", :status => :unauthorized
		end

	end


	private

	def poll_params
		params.require(:poll).permit(:question, :poll_option_options => [])
	end
end
