import express from "express";
import {
  addNewMovieController,
  deleteMovieController,
  filterMovieController,
  getAllMoviesController,
  searchMovieController,
  updateMovieController,
} from "../controller/controller.js";

import multer from "multer";
const upload = multer();
const router = express.Router();

// route for getting all the movies
router.get("/movies", getAllMoviesController);

// route for adding a new movie
router.post("/movies/add", upload.none(), addNewMovieController);

// route for deleting the movie
router.delete("/movies/delete/:id", deleteMovieController);

// route for updating the movie
router.put("/movies/update/:id", upload.none(), updateMovieController);

// route for searching the movie based on name
router.get("/movies/search", searchMovieController);

// route for filter the movie
router.get("/movies/filter", filterMovieController);

export default router;
