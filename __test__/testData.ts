export const userTestData = {
	validUser: {
		username: "FreedMan12345",
		password: "Pepew043vutjg",
		email: "tests@gmail.com"
	},
	invalidUser: {
		username: "Okman123odei",
		password: "nonPro2243fd",
	}
}
export const profileTestData = {
	newProfile: {
		name: "Fergie",
		img: "https://rickandmortyapi.com/api/character/avatar/9.jpeg"
	},
	newName: "Panfilo",
	newImg: "https://rickandmortyapi.com/api/character/avatar/6.jpeg"
}
export const movieTestData = {
	idMovie: 939243
}
export const serieTestData = {
	idSerie: 1396
}
export const scoreTestData = {
	movie: {
		idMovie: movieTestData.idMovie,
		score: 5,
		review: "This movie is awesome, my favorite"
	},
	serie: {
		idSerie: serieTestData.idSerie,
		score: 4,
		review: "This serie is very good, I like it"
	}
}