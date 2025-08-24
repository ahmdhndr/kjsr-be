import { AbstractDocument } from '@common/abstracts/mongo/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category extends AbstractDocument {
  @Prop()
  name: string;

  @Prop({ type: String, default: null })
  description: string | null;

  @Prop({ type: String, default: null })
  iconUrl: string | null;

  @Prop({ type: String, default: null })
  iconPath: string | null;
}

export const CategoriesSchema = SchemaFactory.createForClass(Category);
