export interface UserWithoutPassword {
	id: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
	roles: number[];
	verificationStatus: boolean;
}
