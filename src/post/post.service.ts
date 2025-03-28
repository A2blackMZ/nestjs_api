/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: number) {
    const { title, body } = createPostDto;
    await this.prismaService.post.create({
      data: { body, title, userId },
    });
    return { message: 'Post created successfully' };
  }

  async getAll() {
    return await this.prismaService.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            password: false,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
                password: false,
              },
            },
          },
        },
      },
    });
  }

  async delete(postId: number, userId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('Post Not Found');
    if (post.userId !== userId)
      throw new ForbiddenException('Forbidden action');
    await this.prismaService.post.delete({ where: { postId } });
    return { data: 'Post deleted' };
  }

  async update(postId: number, userId: number, updatePostDto: UpdatePostDto) {
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('Post Not Found');
    if (post.userId !== userId)
      throw new ForbiddenException('Forbidden action');
    await this.prismaService.post.update({ where: { postId }, data: { ...updatePostDto } });
    return { data: 'Post Updated!' };
  }
}
