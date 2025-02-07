import request from "supertest";
import app from "../src/app";
import { movieTestData, profileTestData, serieTestData, userTestData } from "./testData";
describe("Recommendation's test", ()=>{
	let token: string; 
	beforeAll(async()=>{
		token = (await request(app)
			.post("/api/user/register")
			.send(userTestData.validUser)).body.token;
		token = (await request(app)
			.post("/api/profile/add")
			.set("authorization", token)
			.send(profileTestData.newProfile)).body.token;
		await request(app)
			.post("/api/movie/add")
			.set("authorization", token)
			.send(movieTestData);
		await request(app)
			.post("/api/serie/add")
			.set("authorization", token)
			.send(serieTestData);
	});
	it("Get recommendation to all", async()=>{
		const response = await request(app)
			.get("/api/recommendation/get")
			.set("authorization", token);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("results");
	});
	
	it("Get recommendation to one profile", async()=>{
		const response = await request(app)
			.get("/api/recommendation/get-profile")
			.set("authorization", token);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("last_viewed");
		expect(response.body).toHaveProperty("recommendations");
		expect(response.body.recommendations).toHaveLength(5);
	})
});