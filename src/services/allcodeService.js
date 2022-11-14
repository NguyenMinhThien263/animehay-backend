import db from '../models/index';
let getAllCodeByType = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 2,
                    errMessage: `missing parameter Type`
                })
            }
            let data = await db.Allcodes.findAll({
                where: { type: typeInput },
                attributes: ['keyMap', 'value']
            })
            if (!data) { data = [] }
            resolve({
                errCode: 0,
                data
            })
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    getAllCodeByType: getAllCodeByType
}