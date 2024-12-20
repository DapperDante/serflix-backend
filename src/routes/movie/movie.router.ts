import { Router } from 'express';
import { addFavoriteMovie, deleteFavoriteMovie, getAllMoviesOfProfile, getMovieByIdOfProfile } from '../../controllers/profile_movies.controller';
const routerMovie = Router();
routerMovie.post('/add', addFavoriteMovie);
routerMovie.get('/get/:idProfile', getAllMoviesOfProfile);
routerMovie.get('/get/:idProfile/:idMovie', getMovieByIdOfProfile);
routerMovie.delete('/delete/:id', deleteFavoriteMovie);
export default routerMovie;