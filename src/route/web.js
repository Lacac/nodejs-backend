import express from "express";
import homeController from "../controllers/homeController"
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/hoidanit", (req, res) => {
        return res.send(' Hello world with Hoi dan IT')
    });

    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);




    return app.use("/", router);
}

module.exports = initWebRoutes