import express from "express";
// c2: var express = require('express')

let configViewEngine = (app) => {
    // arrow function
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
}

module.exports = configViewEngine;
