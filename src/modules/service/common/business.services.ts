import settingsServices from "@src/modules/settings/settings.services";
import { ErrorCodes } from "@src/errors/ErrorCodes";
import { BusinessInfoSetting } from "@prisma/client";

export async function getBusiness(userId: number | unknown): Promise<BusinessInfoSetting> {
	if (!userId) throw Error(ErrorCodes.Unauthorized + "your unauthorized for this action");
	const businessInfo = await settingsServices.findBusinessInfo({ where: { userId } });
	if (!businessInfo) throw Error(ErrorCodes.Unauthorized + " Please Complete your Onboarding");
	return businessInfo;
}
