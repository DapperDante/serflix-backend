import request from 'supertest';
import { movieTestData, profileTestData, userTestData } from "./testData";
import app from "../src/app";

/*
	To test the movie's route, we need to 
	create an user and profile
*/

describe("Movie's route", ()=>{
	let token: string;

	beforeAll(async()=>{
		token = (await request(app)
			.post("/api/user/register")
			.send(userTestData.validUser)).body.token;
		token = (await request(app)
			.post("/api/profile/add")
			.set("authorization", token)
			.send(profileTestData.newProfile)).body.token;
	});

	it("Add a favorite movie", async ()=>{
			const response = await request(app)
				.post("/api/movie/add")
				.set("authorization", token)
				.send(movieTestData);
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("msg");
			expect(response.body).toHaveProperty("goal");
	});

	describe("Get favorite movies", ()=>{

		it("Get all favorite movies of profile", async()=>{
			const response = await request(app)
				.get("/api/movie/get")
				.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("results");
		});

		it("Get only one favorite movie of profile", async()=>{
			const response = await request(app)
			.get(`/api/movie/get/${movieTestData.idMovie}`)
			.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("result");
			expect(response.body).toHaveProperty("is_favorite");
		});
		
	});

	it("Delete a favorite movie", async()=>{
		const response = await request(app)
			.delete(`/api/movie/delete/${movieTestData.idMovie}`)
			.set("authorization", token);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("msg");
	});
})