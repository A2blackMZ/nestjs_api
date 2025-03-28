/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

/* Vérifier d'abord s'il existe une publication à laquelle on peut rattacher un commentaire, avec son utilisateur */
@Injectable()
export class CommentService {
  constructor(private readonly prismaService : PrismaService) {}
  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { postId, content } = createCommentDto
    const post = await this.prismaService.post.findUnique({where : {postId}})
    if(!post) throw new NotFoundException("Post NoT Found")
    await this.prismaService.comment.create({
      data: {
        content,
        userId,
        postId
      },
    });

    return {data : "Comment Created"}
  }

  async delete(commentId: number, userId: number, postId: number) {
    const comment = await this.prismaService.comment.findFirst({where : {commentId}})
    if(!comment) throw new NotFoundException("Post Not Found");
    if(comment.postId !== postId) throw new UnauthorizedException("Post id doesn't match")
    if(comment.userId !== userId) throw new ForbiddenException("Forbidden action")
    await this.prismaService.comment.delete({where : {commentId}})
    return {data : "Comment deleted!"}
  }

  async update(commentId: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const {content, postId} = updateCommentDto;
    const comment = await this.prismaService.comment.findFirst({where : {commentId}})
    if(!comment) throw new NotFoundException("Comment Not Found");
    if(comment.postId !== postId) throw new UnauthorizedException("Post id doesn't match")
    if(comment.userId !== userId) throw new ForbiddenException("Forbidden action")
    await this.prismaService.comment.update({ where : {commentId}, data : {content}})
    return {data : "Comment updated!"}
  }
}
