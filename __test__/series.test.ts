import request from "supertest";
import { serieTestData, profileTestData, userTestData } from "./testData";
import app from "../src/app";

describe("Serie's route", ()=>{
	let token: string;

	beforeAll(async()=>{
		token = (await request(app)
			.post("/api/user/register")
			.send(userTestData.validUser)).body.token;
		token = (await request(app)
			.post("/api/profile/add")
			.set("authorization", token)
			.send(profileTestData.newProfile)).body.token;
	})

	it("Add a favorite serie", async ()=>{
		const response = await request(app)
			.post("/api/serie/add")
			.set("authorization", token)
			.send(serieTestData);
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("msg");
		expect(response.body).toHaveProperty("goal");
	});

	describe("Get favorite series", ()=>{

		it("Get all favorite series of profile", async()=>{
			const response = await request(app)
				.get("/api/serie/get")
				.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("results");
		});
	
		it("Get only one favorite serie of profile", async()=>{
			const response = await request(app)
				.get(`/api/serie/get/${serieTestData.idSerie}`)
				.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("result");
			expect(response.body).toHaveProperty("is_favorite");
		});
	});

	it("Delete a favorite serie", async()=>{
		const response = await request(app)
			.delete(`/api/serie/delete/${serieTestData.idSerie}`)
			.set("authorization", token);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("msg");
	})
})