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

}