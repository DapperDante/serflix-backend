export interface tokenBase{
	role: role
}
export interface tokenAccess extends tokenBase{
	idUser: number,
	email: string
}
export interface tokenProfile extends tokenAccess{
	idProfile: number
}
export interface tokenAuthentication extends tokenBase{
	idUser: number,
	email: string,
	username: string
}
export interface tokenPassword extends tokenBase{
	idUser: number,
	email: string
}
export enum role{
	user = "user",
	profile = "profile",
	auth = "auth",
	forgot_password = "forgot_password",
}