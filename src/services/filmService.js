import _ from 'lodash';
// const { QueryTypes } = require('sequelize');
import db, { sequelize } from '../models/index';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let saveFilm = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkData = await checkRequiredFields(inputData);
            if (checkData.isValid === false) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing Parameter ${checkData.missingElement}`
                })
            } else {
                let id = ''
                let dataFilm = await db.Films.findOne({
                    where: { title: inputData.filmName, },
                    raw: false,
                })
                if (dataFilm) {
                    resolve({
                        errCode: 3,
                        errMessage: "This title already exists!!!"
                    })
                } else {
                    await db.Films.create({
                        title: inputData.filmName,
                        subTitle: inputData.subFilmName,
                        statusId: inputData.selectedStatus,
                        scrores: inputData.scorePoint,
                        releaseDate: inputData.selectedYear,
                        totalEpisode: inputData.totalEps,
                        description: inputData.description,
                        image: inputData.avatar,
                    }).then(result => id = result.id)
                }
                let genreInput = inputData.selectedGenre;
                genreInput.map(item => {
                    item.filmId = id
                })
                await db.Genries.bulkCreate(genreInput);
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let checkRequiredFields = (inputData) => {
    let arrFields = [
        'selectedStatus',
        'selectedGenre',
        'selectedYear',
        'filmName',
        'subFilmName',
        'scorePoint',
        'totalEps',
        'description',
        'avatar',
    ];
    let isValid = true;
    let missingElement = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            missingElement = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        missingElement: missingElement,
    }
}
let getAllFilm = (page, size) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { limit, offset } = await getPagination(page, size);
            let films = await db.Films.findAndCountAll({
                attributes: {
                    // exclude: ['image'],
                }, include: [
                    {
                        model: db.Allcodes,
                        as: 'genreData',
                        required: false,
                        attributes: ['keyMap', 'value'],
                        through: {
                            model: db.Genries,
                            as: 'genre',
                            attributes: []
                        }
                    },
                    {
                        model: db.Allcodes,
                        as: 'statusData',
                        attributes: ['keyMap', 'value'],
                    },
                    {
                        model: db.Allcodes,
                        as: 'yearData',
                        attributes: ['keyMap', 'value'],
                    },
                ],
                limit,
                offset,
                distinct: true,
                raw: false,
                nest: true,
            })
            let data = {};
            if (films && films.rows.length > 0) {
                data = getPagingData(films, page, limit)
            }
            resolve({
                errCode: 0,
                data
            });
        } catch (error) {
            reject(error);
        }
    })
}
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: films } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, films, totalPages, currentPage };
};
let getOneFilm = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing Id'
                });
            } else {
                let data = await db.Films.findOne({
                    where: { id: inputId },
                    // attributes: {
                    //     // exclude: ['image'],
                    // },
                    include: [
                        {
                            model: db.Allcodes,
                            as: 'genreData',
                            required: false,
                            attributes: ['keyMap', 'value'],
                            through: {
                                model: db.Genries,
                                as: 'genre',
                                attributes: []
                            }
                        },
                        {
                            model: db.Allcodes,
                            as: 'statusData',
                            // Pass in the Product attributes that you want to retrieve
                            attributes: ['keyMap', 'value'],
                        },
                        {
                            model: db.Allcodes,
                            as: 'yearData',
                            // Pass in the Product attributes that you want to retrieve
                            attributes: ['keyMap', 'value'],
                        },
                    ],
                    raw: false,
                    nest: true,
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getFilmByGenre = (inputGenre, page, size) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { limit, offset } = await getPagination(page, size);
            if (!inputGenre) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing genre'
                });
            } else {
                let films = await db.Allcodes.findAndCountAll({
                    where: { keyMap: inputGenre },
                    attributes: ['keyMap', 'value'],
                    include: [
                        {
                            model: db.Films,
                            as: 'filmsData',
                            attributes: ['id',
                                'image',
                                'title', 'scrores', 'totalEpisode'],
                            required: false,
                            through: {
                                model: db.Genries,
                                as: 'genre',
                                attributes: []
                            },
                        }
                    ],
                    limit,
                    offset,
                    // distinct: true,
                    raw: false,
                    nest: true,
                })
                let data = {};
                if (films && films.rows.length > 0) {
                    data = getPagingData(films, page, limit)
                }
                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}
let editFilm = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isCheck = checkRequiredFields(inputData);
            if (!inputData.id && isCheck.isValid === false) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing Parameter ${checkData.missingElement} or Id`
                })
            } else {
                let film = await db.Films.findOne({
                    where: { id: inputData.id },
                    raw: false,
                })
                if (film) {
                    await film.set({
                        title: inputData.filmName,
                        subTitle: inputData.subFilmName,
                        statusId: inputData.selectedStatus,
                        scrores: inputData.scorePoint,
                        releaseDate: inputData.selectedYear,
                        totalEpisode: inputData.totalEps,
                        description: inputData.description,
                    })
                    if (inputData.avatar) {
                        film.image = inputData.avatar;
                    }
                    await film.save();
                }
                let genreInput = inputData.selectedGenre;
                genreInput.map(item => {
                    item.filmId = inputData.id
                })
                let genreDataExisting = await db.Genries.findAll({
                    where: { filmId: inputData.id }
                })
                let toCreate = _.differenceWith(genreInput, genreDataExisting, (a, b) => {
                    return a.keyMap === b.keyMap && a.filmId === b.filmId
                })
                if (toCreate && toCreate.length > 0) {
                    await db.Genries.bulkCreate(toCreate);
                } else {
                    await db.Genries.destroy({
                        where: { filmId: inputData.id },
                        force: true,
                    });
                    await db.Genries.bulkCreate(genreInput);
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }
        } catch (error) {
            reject(error);
        }
    })

}
let deleteFilm = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) { resolve({ errCode: 2, errMessage: "Missing Id" }) }
            else {
                let filmData = db.Films.findOne({
                    where: { id: id },
                    raw: false
                })
                let genre = db.Genries.findOne({
                    where: { filmId: id },
                    raw: false
                })
                if (!filmData && !genre) {
                    resolve({
                        errCode: 3,
                        errMessage: "Film not exist"
                    })
                }
                await db.Films.destroy({
                    where: { id: id },
                    force: true,
                })
                await db.Genries.destroy({
                    where: { filmId: id },
                    force: true,
                })
                resolve({
                    errCode: 0,
                    errMessage: "Film has been deleted"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getFilmBySearch = (inputSearch) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputSearch) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing search input'
                });
            } else {
                let film = await db.Films.findAll({
                    where: {
                        [Op.or]: {
                            title: {
                                [Op.like]: `%${inputSearch}%`,
                            },
                            subTitle: {
                                [Op.like]: `%${inputSearch}%`,
                            }
                        }
                    },
                    // attributes: {
                    //     exclude: ['image'],
                    // },
                    include: [
                        {
                            model: db.Allcodes,
                            as: 'genreData',
                            required: false,
                            attributes: ['keyMap', 'value'],
                            through: {
                                model: db.Genries,
                                as: 'genre',
                                attributes: []
                            }
                        },
                        {
                            model: db.Allcodes,
                            as: 'statusData',
                            // Pass in the Product attributes that you want to retrieve
                            attributes: ['keyMap', 'value'],
                        },
                        {
                            model: db.Allcodes,
                            as: 'yearData',
                            // Pass in the Product attributes that you want to retrieve
                            attributes: ['keyMap', 'value'],
                        },
                    ],
                    raw: false,
                    nest: true,
                })

                if (film) {
                    resolve({
                        errCode: 0,
                        data: film
                    })
                } else {
                    resolve({
                        errCode: 3,
                        errMessage: 'Film not found'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    saveFilm: saveFilm,
    getAllFilm: getAllFilm,
    getOneFilm: getOneFilm,
    editFilm: editFilm,
    deleteFilm: deleteFilm,
    getFilmByGenre: getFilmByGenre,
    getFilmBySearch: getFilmBySearch,
}