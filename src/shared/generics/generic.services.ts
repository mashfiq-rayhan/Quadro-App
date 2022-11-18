import { Document, FilterQuery, Model, PopulateOptions, QueryOptions, UpdateQuery } from "mongoose";

export abstract class GenericServices<T extends Document> {
	public constructor(protected readonly entityModel: Model<T>) {}

	public async findOne(
		entityFilterQuery: FilterQuery<T>,
		projection?: Record<string, unknown>,
		options?: QueryOptions,
	): Promise<T | null> {
		return this.entityModel.findOne(entityFilterQuery, { __v: 0, ...projection }, options).exec();
	}

	public async findById(id: string, projection?: Record<string, unknown>, options?: QueryOptions): Promise<T | null> {
		return this.entityModel.findById(id, { __v: 0, ...projection }, options).exec();
	}

	public async find(
		entityFilterQuery: FilterQuery<T>,
		projection?: Record<string, unknown>,
		options?: QueryOptions,
		populates?: PopulateOptions[],
	): Promise<T[] | null> {
		if (populates) {
			return this.entityModel
				.find(entityFilterQuery, { __v: 0, ...projection }, options)
				.populate(populates)
				.exec();
		} else {
			return this.entityModel.find(entityFilterQuery, { __v: 0, ...projection }, options).exec();
		}
	}

	public async create(createEntityData: unknown): Promise<T> {
		const entity = new this.entityModel(createEntityData);
		return entity.save();
	}

	public async findAndUpdate(
		entityFilterQuery: FilterQuery<T>,
		updateEntityData: UpdateQuery<unknown>,
		options?: QueryOptions,
	): Promise<T | null> {
		return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, { new: true, ...options });
	}

	public async deleteMany(entityFilterQuery: FilterQuery<T>, options?: QueryOptions): Promise<number> {
		const deletedResult = await this.entityModel.deleteMany(entityFilterQuery, options);
		return deletedResult.deletedCount;
	}

	public async delete(entityFilterQuery: FilterQuery<T>, options?: QueryOptions): Promise<number> {
		const deletedResult = await this.entityModel.deleteOne(entityFilterQuery, options);
		return deletedResult.deletedCount;
	}
}
