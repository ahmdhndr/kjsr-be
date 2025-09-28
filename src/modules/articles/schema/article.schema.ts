import { AbstractDocument } from '@common/abstracts/mongo/abstract.schema';
import { ArticleStatus } from '@common/constants/global.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

import { ContentNode } from '../dto/article.dto';

@Schema({ timestamps: true })
export class Article extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, unique: true, default: null })
  slug: string | null;

  @Prop({ type: Object, required: true, default: null })
  content: ContentNode | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: String, default: null })
  coverUrl: string | null;

  @Prop({ type: String, default: null })
  coverPath: string | null;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }],
    default: [],
  })
  categories: Types.ObjectId[];

  @Prop({
    type: String,
    enum: Object.values(ArticleStatus),
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Prop({
    type: String,
    default: '',
  })
  note: string | null;

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;
}

export const ArticlesSchema = SchemaFactory.createForClass(Article);

ArticlesSchema.index({ title: 'text' }); // untuk search dengan $text
ArticlesSchema.index({ author: 1 }); // kalau sering query artikel by user ASC
ArticlesSchema.index({ categories: 1 }); // kalau sering query artikel by kategori ASC
