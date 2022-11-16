import userService from '../services/userService'
let addNewUser = async (req, res) => {
    try {
        let data = await userService.addNewUser(req.body);
        res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server ${error}`,
        })
    }
}
let getUser = async (req, res) => {
    try {
        console.log('check req', req.body);
        if (!req.body.email || !req.body.password) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing inputs parameter!'
            })
        }
        let data = await userService.getUser(req.body);
        res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: `error from server ${error}`,
        })
    }
}

module.exports = {
    addNewUser: addNewUser,
    getUser: getUser,
}