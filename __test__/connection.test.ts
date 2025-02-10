import sequelize from "../src/db/connection";
import db from "../src/db/connection";

describe('Connection', () => {

  it('to database', async ()=>{
    expect(await db.authenticate()).toBeUndefined();
  });
	
	describe('to tables', ()=>{
		it("Exist user's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('users')).toBeTruthy();
		});
		it("Exist profile's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('profiles')).toBeTruthy();
		});
		it("Exist goals's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('goals')).toBeTruthy();
		});
		it("Exist profile_goals's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('profile_goals')).toBeTruthy();
		});
		it("Exist log_views's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('log_views')).toBeTruthy();
		});
		it("Exist profile_movie's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('profile_movies')).toBeTruthy();
		});
		it("Exist profile_serie's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('profile_series')).toBeTruthy();
		});
		it("Exist score_movie's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('score_movies')).toBeTruthy();
		});
		it("Exist score_serie's table", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('score_series')).toBeTruthy();
		});
		it("Exist log_passwords's table ", async ()=>{
			expect(await sequelize.getQueryInterface().tableExists('log_passwords')).toBeTruthy();
		});

	})
})