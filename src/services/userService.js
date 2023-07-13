import bcrypt from 'bcryptjs'
import db from '../models/index';


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email)
            if (isExist) {
                // user already exist

                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email','roleid','password'],
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
    return new Promise(async(resolve, reject) => {
        try{
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
                    where: {id: userId}, 
                    attributes: {
                        exclude: ['password']
                    }
                
                })
            }
            resolve(users);

        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers
}