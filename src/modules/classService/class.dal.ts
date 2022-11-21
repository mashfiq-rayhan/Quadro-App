import { ClassInput, ClassDocument, ClassID } from "./class.interfaces";
import ClassModel from "./class.model";
import { HydratedDocument } from "mongoose";
import { ErrorCodes } from "../../errors/ErrorCodes";

export async function create(payload: ClassInput): Promise<HydratedDocument<ClassDocument>> {
	const newClass = await ClassModel.create(payload);
	return newClass;
}

export async function getById(id: ClassID): Promise<ClassDocument> {
	const newClass = await ClassModel.findById(id);
	if (!newClass) throw Error(ErrorCodes.NotFound);
	return newClass;
}

export async function update(id: ClassID, payload: ClassInput): Promise<ClassDocument> {
	const updatedClass = await ClassModel.findByIdAndUpdate(
		id,
		{
			$set: payload,
		},
		{ new: true },
	).exec();
	if (!updatedClass) throw Error(ErrorCodes.NotFound);
	return updatedClass;
}

export async function getAll(): Promise<Array<ClassDocument>> {
	const ClasssList = await ClassModel.find({});
	return ClasssList;
}

export async function deleteById(id: ClassID): Promise<void> {
	await ClassModel.findByIdAndDelete(id);
}
