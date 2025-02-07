import { Router } from 'express';
import { addFavoriteMovie, deleteFavoriteMovie, getMovieByProfile, getMoviesByProfile } from '../../controllers/movie.controller';
const routerMovie = Router();
routerMovie.post('/add', addFavoriteMovie);
routerMovie.get('/get', getMoviesByProfile);
routerMovie.get('/get/:idMovie', getMovieByProfile);
routerMovie.delete('/delete/:idMovie', deleteFavoriteMovie);
export default routerMovie;