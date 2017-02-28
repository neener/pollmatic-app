class UsersController < ApplicationController

	def votes_index
		@user = User.find(params[:id])
	end
end