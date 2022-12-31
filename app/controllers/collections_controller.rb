class CollectionsController < ApplicationController
  before_action except: [:show, :partial] do
    redirect_to login_path unless current_user
  end

  def index
    @collections = current_user.collections.order(created_at: :desc)
  end

  def show
    @collection = Collection.find_by_nice_url!(params[:nice_url].downcase)
    @posts = @collection.posts.visible?.order(created_at: :desc).page params[:page]
    @display_type = @collection.display_type

    respond_to do |format|
      format.html
      format.js { render "posts/infinite_scroll_posts" }
    end
  end

  def partial
    @post = Post.select(:id, :collection_id).includes(:collection).find(params[:id])

    render partial: "collections"
  end

  def new
    @collection = Collection.new
  end

  def create
    @collection = Collection.new(collection_params)
    @collection.nice_url = SecureRandom.alphanumeric(6).downcase
    @collection.user_id = current_user.id

    if @collection.save
      flash[:notice] = "Collection created"
      redirect_to edit_collection_path(@collection.nice_url)
    else
      render :new
    end
  end

  def edit
    @collection = Collection.where(user_id: current_user.id).find_by_nice_url!(params[:nice_url].downcase)
  end

  def update
    @collection = Collection.where(user_id: current_user.id).find_by_nice_url!(params[:nice_url].downcase)

    if @collection.update(collection_params)
      flash[:alert] = "Successfully saved"
      redirect_to edit_collection_path(@collection.nice_url)
    else
      render :edit
    end
  end

  def destroy
    @collection = Collection.where(user_id: current_user.id).find_by_nice_url!(params[:nice_url].downcase)

    if @collection.posts.none? && @collection.destroy
      redirect_to collections_path
    else
      render "application/error"
    end
  end

  private

  def collection_params
    params.require(:collection).permit(:title, :cover_image, :description, :display_type)
  end
end
