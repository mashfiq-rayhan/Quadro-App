export const returnVal = (data: any): { success: boolean; data?: any; errors: any } => ({
	success: true,
	data: data ? data : undefined,
	errors: null,
});
