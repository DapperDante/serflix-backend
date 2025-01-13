import { Router } from 'express';
import { addFavoriteMovie, deleteFavoriteMovie, getMovieByProfile, getMoviesByProfile } from '../../controllers/profile_movies.controller';
const routerMovie = Router();
routerMovie.post('/add', addFavoriteMovie);
routerMovie.get('/get', getMoviesByProfile);
routerMovie.get('/get/:idMovie', getMovieByProfile);
routerMovie.delete('/delete/:id', deleteFavoriteMovie);
export default routerMovie;