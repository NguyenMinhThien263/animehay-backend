import express from 'express';
import homeController from '../controllers/homeController'
import filmController from '../controllers/filmController'
import allcodeController from '../controllers/allcodeController';
import userController from '../controllers/userController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    //Allcodes
    router.get('/api/get-allcode-by-type', allcodeController.getAllcodeByType);
    //film
    router.post('/api/save-film', filmController.saveFilm);
    router.put('/api/edit-film', filmController.editFilm);
    router.delete('/api/delete-film', filmController.deleteFilm);
    router.get('/api/get-all-film', filmController.getAllFilm);
    router.get('/api/get-one-film', filmController.getOneFilm);
    router.get('/api/get-film-by-genre', filmController.getFilmByGenre);
    router.get('/api/get-film-by-search', filmController.getFilmBySearch);
    //user
    router.post('/api/add-new-user', userController.addNewUser);
    router.post('/api/get-user', userController.getUser);
    return app.use('/', router);
}

module.exports = initWebRoutes