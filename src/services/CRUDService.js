let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findAll({
                raw: true,
            });
            resolve(user)
        } catch (error) {
            reject(error);
        }
    })

}
let hashUserPasswords = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswords = await bcrypt.hashSync(password, salt);
            resolve(hashPasswords);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    getAllUser:getAllUser,
    hashUserPasswords:hashUserPasswords,
}