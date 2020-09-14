class CommentsController < ApplicationController
  include NotificationsHelper

  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id
    @post = @comment.post

    if @comment.save
      create_activity(:create_comment, comment_activity_params)

      if @comment.parent_id
        parent_comment_user = Comment.find(@comment.parent_id).user

        if @comment.user != parent_comment_user
          create_notification(
            "Someone **has replied** to your comment on **\"==#{ @comment.post.title }==\"**",
            "#{ post_path(@comment.post.code) }##{@comment.id}",
            parent_comment_user.id,
            :comment_reply,
            "comment",
            @comment.id
          )
        end
      else
        if @comment.user != @comment.post.user
          create_notification(
            "Someone **has left a comment** on **\"==#{ @comment.post.title }==\"**",
            "#{ post_path(@comment.post.code) }##{@comment.id}",
            @comment.post.user.id,
            :comment,
            "comment",
            @comment.id
          )
        end
      end

      respond_to do |format|
        format.js
      end
    end
  end

  def update
    @comment = Comment.find_by_id_and_user_id(params[:id], current_user.id)
    @post = @comment.post

    if @comment.update(comment_params)
      create_activity(:update_comment, comment_activity_params)

      respond_to do |format|
        format.js
      end
    end
  end

  def destroy
    @comment = Comment.find_by_id_and_user_id(params[:id], current_user.id)

    if @comment.destroy
      create_activity(:destroy_comment, comment_activity_params)

      respond_to do |format|
        format.js
      end
    end
  end

  def create_reply_form
    @parent_id = params[:comment_id]
    @post = Comment.find(@parent_id).post

    respond_to do |format|
      format.js
    end
  end

  def create_edit_form
    @comment = Comment.find(params[:comment_id])
    @comment_id = @comment.id
    @post = @comment.post

    respond_to do |format|
      format.js
    end
  end

  private

  def comment_activity_params
    { id: @comment.id }
  end

  def comment_params
    params.require(:comment).permit(:post_id, :content, :parent_id)
  end
end
