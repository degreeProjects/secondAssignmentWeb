import { Model, Document, Types } from "mongoose";

export class BaseRepository<ModelType extends Document> {
  model: Model<ModelType>;

  constructor(model: Model<ModelType>) {
    this.model = model;
  }

  async create(data: Partial<ModelType>): Promise<ModelType> {
    const doc = new this.model(data);
    return await doc.save();
  }

  async getAll(): Promise<ModelType[]> {
    return await this.model.find();
  }

  async getById(id: string | Types.ObjectId): Promise<ModelType | null> {
    return await this.model.findById(id);
  }

  async getBySender(
    senderId: string | Types.ObjectId
  ): Promise<ModelType[] | null> {
    return await this.model.find({ sender: senderId });
  }

  async update(
    id: string | Types.ObjectId,
    data: Partial<ModelType>
  ): Promise<ModelType | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string | Types.ObjectId): Promise<ModelType | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
