class PollsController < ApplicationController
	before_action :authenticate_user!, only: [:new, :create, :destroy]
	
	def index
		@polls = Poll.most_popular.active
		respond_to do |f|
      		f.html { render :index }
      		f.json { render json: @polls }
    	end
	end

	def new
		@poll = Poll.new
	end

	def create
		@poll = Poll.create(poll_params.merge(:expires_at => Time.now + 24.hours, :user_id => current_user.id))
		if @poll.persisted? 
			redirect_to poll_path(@poll)
		else
			render :new
		end
	end

	# def next
	# 	@next_poll = @poll.next
	# 	render json: @next_poll
	# end

	def show
		@poll = Poll.find(params[:id])
		if !user_signed_in? || current_user.voted_on?(params[:id]) || @poll.expired?
			@results = @poll.results
			respond_to do |f|
      			f.html { render :show }
      			f.json { render json: @results }
    		end
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

	def expired
		@polls = Poll.expired
		respond_to do |f|
      		f.html { render :index }
      		f.json { render json: @polls }
    	end
	end


	private

	def poll_params
		params.require(:poll).permit(:question, :poll_option_options => [])
	end
end
