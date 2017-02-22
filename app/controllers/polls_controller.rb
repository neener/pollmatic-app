class PollsController < ApplicationController
	before_action :authenticate_user!, only: [:new, :create, :destroy]
	
	def index
		@polls = Poll.all
	end

	def new
		@poll = Poll.new
	end

	def create
		@poll = Poll.create!(poll_params.merge(:user_id => current_user.id))
	end

	def show
		@poll = Poll.find(params[:id])
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
		params.require(:poll).permit(:question)
	end
end
