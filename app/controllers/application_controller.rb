class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  serialization_scope :view_context
end
