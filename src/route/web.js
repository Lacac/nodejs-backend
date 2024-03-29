import express from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/hoidanit", (req, res) => {
        return res.send(' Hello world with Hoi dan IT')
    });
// CREATE user
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
// GET all users
    router.get('/get-crud', homeController.displayGetCRUD);
// UPDATE users
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
// DELETE users
    router.get('/delete-crud', homeController.deleteCRUD);


// React
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);


    return app.use("/", router);
}

module.exports = initWebRoutes