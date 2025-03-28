/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Controller, Post, Delete, Body, Param, Req, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { CommentService } from "./comment.service";
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags("Comments")
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  create(@Req() request : Request & { user: { userId: number } }, @Body() createCommentDto : CreateCommentDto) {
    const userId = request.user.userId;
    return this.commentService.create(userId, createCommentDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("delete/:id")
  delete(@Req() request : Request & { user: { userId: number } }, @Param("id", ParseIntPipe) commentId: number, @Body("postId") postId: number) {
    const userId = request.user.userId;
    return this.commentService.delete(commentId, userId, postId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("update/:id")
  update(
    @Param("id", ParseIntPipe) commentId: number, @Req() request : Request & { user: { userId: number } },
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = request.user["userId"];
    return this.commentService.update(commentId, userId, updateCommentDto)
  }
}
