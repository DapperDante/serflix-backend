export interface tokenLogUser{
	idUser: number,
	email: string,
	type: typeToken.accessAccount
}
export interface tokenLogProfile{
	idUser: number,
	email: string,
	idProfile: number,
	type: typeToken.accessProfile
}
export interface tokenAuthentication{
	idUser: number,
	username: string
	type: typeToken.authenticateUser
}
export interface tokenPassword{
	idUser: number,
	username: string,
	type: typeToken.password
}
enum typeToken{
	accessAccount = 1,
	accessProfile = 2,
	authenticateUser = 3,
	password = 4
}