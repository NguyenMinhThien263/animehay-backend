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