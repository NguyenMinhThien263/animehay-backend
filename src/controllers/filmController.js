import filmService from '../services/filmService'
let saveFilm = async (req, res) => {
    try {
        let data = await filmService.saveFilm(req.body);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server ${error}`
        })
    }
}
let getAllFilm = async (req, res) => {
    try {
        let { page, size } = req.query;
        let data = await filmService.getAllFilm(page, size);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server ${error}`
        })
    }
}
let getOneFilm = async (req, res) => {
    try {
        let { id } = req.query;
        let data = await filmService.getOneFilm(id);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server ${error}`
        })
    }
}
let editFilm = async (req, res) => {
    try {
        let data = await filmService.editFilm(req.body);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server ${error}`
        })
    }
}
let deleteFilm = async (req, res) => {
    try {
        let data = await filmService.deleteFilm(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server ${error}`
        })
    }
}
module.exports = {
    saveFilm: saveFilm,
    getAllFilm: getAllFilm,
    getOneFilm: getOneFilm,
    editFilm:editFilm,
    deleteFilm:deleteFilm,
}