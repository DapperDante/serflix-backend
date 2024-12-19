import { Router } from 'express';
import { addFavoriteMovie, deleteFavoriteMovie, getAllMoviesOfProfile, getMovieByIdOfProfile } from '../../controllers/profile_movies.controller';
const routerMovie = Router();
routerMovie.get('/get-favorite/:idProfile', getAllMoviesOfProfile);
routerMovie.get('/get-favorite/:idProfile/:idMovie', getMovieByIdOfProfile);
routerMovie.post('/add-favorite', addFavoriteMovie);
routerMovie.delete('/delete-favorite/:id', deleteFavoriteMovie);
export default routerMovie;