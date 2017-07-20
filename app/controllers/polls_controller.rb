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
		binding.pry
		@poll = Poll.create(poll_params.merge(:expires_at => Time.now + 24.hours, :user_id => current_user.id))
		respond_to do |f|
      		f.html { redirect_to poll_path(@poll) }
      		f.json { 
      			if @poll.persisted?
	      			render json: @poll 
	      		else 
	      			render json: {errors: @poll.errors.full_messages}, status: 422
	      		end

      		}
		end	
	end

	def next
		@poll = Poll.find(params[:id])
		@next_poll = @poll.next
		render json: @next_poll
	end

	def show
		@poll = Poll.find(params[:id])
		
		respond_to do |f|
  			f.html { render :show }
  			f.json { render json: @poll }
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
		params.require(:poll).permit(:question, :poll_options => [])
	end
end
