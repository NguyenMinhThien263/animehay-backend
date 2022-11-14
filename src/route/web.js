import express from 'express';
import homeController from '../controllers/homeController'
import filmController from '../controllers/filmController'
import allcodeController from '../controllers/allcodeController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    //Allcodes
    router.get('/api/get-allcode-by-type',allcodeController.getAllcodeByType)
    //film
    router.post('/api/save-film', filmController.saveFilm)
    router.put('/api/edit-film', filmController.editFilm)
    router.delete('/api/delete-film', filmController.deleteFilm)
    router.get('/api/get-all-film',filmController.getAllFilm)
    router.get('/api/get-one-film',filmController.getOneFilm)
    return app.use('/', router);
}

module.exports = initWebRoutes