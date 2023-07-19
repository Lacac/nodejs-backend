import bcrypt from 'bcryptjs'
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email)
            if (isExist) {
                // user already exist

                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleid', 'password'],
                    raw: true
                });
                if (user) {
                    // compare password 
                    let check = await bcrypt.compareSync(password, user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        console.log(user);
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found~"
                }
            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = "Your email isn't exist."

            }
            resolve(userData);
        } catch (e) {
            reject(e)
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
        } catch (e) {
            reject(e);
        }
    })
}


let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }

                })
            }
            resolve(users);

        } catch (e) {
            reject(e);
        }
    })
}



let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email exist or not
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already in use. Try another email !!!'
                })
            }
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                phonenumber: data.phonenumber,
                roleId: data.roleId
            })
            resolve({
                errCode: 0,
                message: 'OK'
            })
        } catch (err) {
            reject(e);
            // resolve({
            //     errCode: 2,
            //     message: err.message
            // })

        }

        console.log("noc noc")
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }

    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            })

            // Thay bằng chỉnh: raw: false. Dùng: 
            // db.User.destroy({
            //     where: {id: userId}
            // })
            if (user) {
                console.log(user);
                await user.destroy();
                resolve({
                    errCode: 0,
                    errMessage: 'The user is deleted!'
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'The user is not exist!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2, 
                    errMessage: 'Missing required parameter!'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id }, 
                raw: false
            });
            if (user) {
                user.set({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                });
                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                });
            }else {
                resolve({
                    errCode: 1,
                    message: 'Not found the user!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}