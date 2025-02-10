import request from "supertest";
import app from "../src/app";
import { profileTestData, scoreTestData, userTestData } from "./testData";

describe("Score's route", ()=>{
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
	describe("Score movies", ()=>{
		it("Add a score to a movie", async()=>{
			const response = await request(app)
				.post("/api/score/movie/add")
				.set("authorization", token)
				.send(scoreTestData.movie);
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("msg");
		});
		
		it("Get all score of a movie", async()=>{
			const response = await request(app)
				.get(`/api/score/movie/get/${scoreTestData.movie.idMovie}`)
				.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("results");
		});
	})

	describe("Score series", ()=>{
		it("Add a score to a serie", async()=>{
			const response = await request(app)
				.post("/api/score/serie/add")
				.set("authorization", token)
				.send(scoreTestData.serie);
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("msg");
		});
		
		it("Get all score of a serie", async()=>{	
			const response = await request(app)
				.get(`/api/score/serie/get/${scoreTestData.serie.idSerie}`)
				.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("results");
		});
	})

})