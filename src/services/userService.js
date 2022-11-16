import db from '../models/index';
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
let addNewUser = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('check input', input);
            let isExist = await checkUserEmail(input.email);
            if (!input.username && !input.password && !input.email) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameter"
                });
            } else if (isExist === true) {
                resolve({
                    errCode: 3,
                    errMessage: "Already exists"
                });
            }
            else {
                let hassPass = await hashUserPasswords(input.password);
                await db.User.create({
                    userName: input.username,
                    password: hassPass,
                    email: input.email,
                    roleId: 'R2',
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }
        } catch (error) {
            reeject(error);
        }
    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
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
let getUser = (input) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(input.email);
            if (isExist) {
                //user already exists
                //compare password
                let user = await db.User.findOne({
                    where: { email: input.email },
                }
                );
                if (user) {
                    let check = await bcrypt.compareSync(input.password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong Password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User isn't found`;
                }
            } else {
                //return error
                userData.errCode = 4;
                userData.errMessage = `Your's mail isn't exist.Please try another one`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    addNewUser: addNewUser,
    getUser: getUser,
}