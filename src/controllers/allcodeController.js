import allcodeService from "../services/allcodeService";
let getAllcodeByType = async (req, res) => {
    try {
        let data = await allcodeService.getAllCodeByType(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server: ${error}`
        })
    }
}
module.exports = {
    getAllcodeByType: getAllcodeByType
}