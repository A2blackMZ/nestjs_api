/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, UseGuards, Get, ParseIntPipe, Delete, Param, Put } from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Posts")
@Controller('posts')
export class PostController {
  constructor(private readonly postService : PostService) {}

  @Get()
  getAll() {
    return this.postService.getAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  create(@Body() createPostDto : CreatePostDto, @Req() request : Request & { user: { userId: number } }) {
    const userId = request.user.userId;
    return this.postService.create(createPostDto, userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("delete/:id")
  delete(@Param("id", ParseIntPipe) postId: number, createPostDto : CreatePostDto, @Req() request : Request & { user: { userId: number } }) {
    const userId = request.user.userId;
    return this.postService.delete(postId, userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("update/:id")
  update(@Param("id", ParseIntPipe) postId: number, @Body() updatePostDto : UpdatePostDto, @Req() request : Request & { user: { userId: number } }) {
    const userId = request.user.userId;
    return this.postService.update(postId, userId, updatePostDto)
  }
}

