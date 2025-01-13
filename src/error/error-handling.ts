//This is core of error handling
 export const ErrorControl = (error:any): {code: number, msg:string}=>{
	try{
		console.error(error);
		switch(error.name){
			case 'TokenExpiredError':
				return ErrorHandlingJwt(error);
			case 'SequelizeUniqueConstraintError':
				return ErrorHandlingDB(error);
			case 'Error':
				return ErrorHandling(error);
			case 'TypeError':
				return ErrorHandling(error);
			default: 
				throw new Error();
		}
	}catch{
		return {
			code: 500,
			msg: "Has an ocurred problem"
		};
	}
 }
const ErrorHandlingDB = (error: any): {code: number, msg: string} => {
	const {validatorKey} = error.errors[0];
	switch(validatorKey){
		case 'is_null':
			return {
				code: 400,
				msg: "The field is null"
			};
		case 'not_unique':
			return {
				code: 400,
				msg: "Value already exists"
			};
		default:
			throw new Error();
	}
}
const ErrorHandlingJwt = (error:Error): {code:number, msg: string} => {
	switch(error.message){
		case 'jwt expired':
			return {
				code: 401,
				msg: "Token expired"
			};
		case 'jwt must be provided':
			return {
				code: 401,
				msg: "Token must be provided"
			};
		case 'invalid token':
			return {
				code: 401,
				msg: "Invalid token"
			};
		default: 
			throw new Error();
	}
}
//This is to custom errors
const ErrorHandling = (error:Error): {code: number, msg: string} => {
	switch(error.message){
		case 'sintax_error':
			return {
				code: 400,
				msg: "The fields are incorrect"
			};
		case 'not_find_user':
			return {
				code: 404,
				msg: "Not find user"
			};
		case 'not_match_password':
			return {
				code: 401,
				msg: "The password is incorrect"
			};
		case 'not_find':
			return {
				code: 404,
				msg: "Not find your query"
			};
		case 'unauthorized':
			return {
				code: 401,
				msg: "Unauthorized"
			}
		default:
			throw new Error();
	}
}