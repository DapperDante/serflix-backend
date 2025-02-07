import request from "supertest";
import app from "../src/app";
import { profileTestData, userTestData } from "./testData";


describe("Profile's route", () => {
	let token: string;
	
	beforeAll(async () => {
		token = (await request(app)
			.post("/api/user/register")
			.send(userTestData.validUser)).body.token;
	});

	it("Add a profile", async () => {
		const response = await request(app)
			.post("/api/profile/add")
			.set("authorization", token)
			.send(profileTestData.newProfile);
		token = response.body.token;
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("msg");
		expect(response.body).toHaveProperty("token");
	});
	
	describe("Get profiles", () => {
		it("get all profiles", async () => {
			const response = await request(app)
				.get("/api/profile/get-all")
				.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("results");
		});
		it("get a profile", async () => {
			const response = await request(app)
				.get("/api/profile/get")
				.set("authorization", token);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("name");
			expect(response.body).toHaveProperty("img");
			expect(response.body).toHaveProperty("results");
			expect(response.body).toHaveProperty("goals");
		});
	});
	
	describe("Update profile's data", () => {
		
		it("Change name", async () => {
			const response = await request(app)
				.put("/api/profile/put")
				.set("authorization", token)
				.send({ name: profileTestData.newName });
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("msg");
		});

		it("Change image", async () => {
			const response = await request(app)
				.put("/api/profile/put")
				.set("authorization", token)
				.send({ img: profileTestData.newImg });
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("msg");
		});

	});

});
