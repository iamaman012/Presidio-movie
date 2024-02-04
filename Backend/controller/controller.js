import fs from "fs";

// Declare a movies array
let movies = [];

// function for loading the movies from movies.json file
export const loadMoviesFromFile = () => {
  try {
    const data = fs.readFileSync("./movies.json", "utf-8");
    movies = JSON.parse(data);
  } catch (error) {
    console.error("Error reading movies file:", error.message);
    movies = [];
  }
};

// function for storing the movies in the movies.json file
const storeMoviesInFile = () => {
  try {
    fs.writeFileSync("./movies.json", JSON.stringify(movies, null, 2), "utf-8");
  } catch (error) {
    console.log("error in saving the file", error.message);
  }
};

// controller for getting all the movies
export const getAllMoviesController = async (req, res) => {
  try {
    loadMoviesFromFile();
    res.status(200).json({ success: true, movies, languageCount: -1 });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in getting the movies", error });
  }
};

// controller for adding the new movie
export const addNewMovieController = async (req, res) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const director = req.body.director;
    const releaseYear = req.body.releaseYear;
    const language = req.body.language;
    const rating = req.body.rating;
    const imagePath = req.body.imagePath;

    switch (true) {
      case !id:
        return res.status(400).json({ error: " Movie Id is required" });
      case !name:
        return res.status(400).json({ error: " Movie name is required" });
      case !director:
        return res
          .status(400)
          .json({ error: " Movie  director name is required" });
      case !releaseYear:
        return res
          .status(400)
          .json({ error: " Movie release year is required" });
      case !language:
        return res.status(400).json({ error: " Movie language is required" });
      case !rating:
        return res.status(400).json({ error: " Movie rating is required" });
      case !imagePath:
        return res.status(400).json({ error: " Movie image is required" });
    }
    const newMovie = {
      id: parseInt(id),
      name,
      director,
      releaseYear,
      language,
      rating,
      imagePath,
    };
    movies.push(newMovie);
    storeMoviesInFile();
    res
      .status(201)
      .json({ success: true, message: "Movie added Successfully", newMovie });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in adding a new Movie",
      error: error.message,
    });
  }
};

// controller for deleting the movie
export const deleteMovieController = async (req, res) => {
  try {
    const { id } = req.params;
    loadMoviesFromFile();

    const index = movies.findIndex((movie) => movie.id === parseInt(id));
    if (index !== -1 && index < movies.length) {
      const deletedMovie = movies[index];
      movies.splice(index, 1);

      storeMoviesInFile();
      res.status(200).json({
        success: true,
        message: "Movie deleted successfully",
        deletedMovie,
      });
    } else
      res.status(400).json({
        success: false,
        message: "There is no movie corresponding to the id",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting the movie",
      error: error.message,
    });
  }
};

//controller for updating the movie
export const updateMovieController = (req, res) => {
  try {
    const { id } = req.params;
    const index = movies.findIndex((movie) => movie.id === parseInt(id));
    if (index !== -1 && index < movies.length) {
      const { id, name, director, releaseYear, language, rating, imagePath } =
        req.body;
      if (id) movies[index].id = id;
      if (name) movies[index].name = name;
      if (director) movies[index].director = director;
      if (releaseYear) movies[index].releaseYear = releaseYear;
      if (language) movies[index].language = language;
      if (rating) movies[index].rating = rating;
      if (imagePath) movies[index].imagePath = imagePath;
      storeMoviesInFile();
      res.status(200).json({
        success: true,
        message: "Movie updated Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No movie Found corressponding to the given id",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating the Movie",
      error: error.message,
    });
  }
};



// controller for searching the movie by its name
export const searchMovieController = (req, res) => {
  try {
    loadMoviesFromFile();
    let { name } = req.query;
    name = name.replace(/\s/g, "").toLowerCase();
    // console.log(name)
    // console.log(movies);
    movies = movies.filter((movie) =>
      movie.name.toLowerCase().replace(/\s/g, "").includes(name)
    );
    console.log(movies);
    if (movies && movies.length > 0) {
      return res.status(200).json({
        success: true,
        movies,
        languageCount: -1,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No movie found",
        movies,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Searching the movie",
      error: error.message,
    });
  }
};

// controller for filtering the movie
export const filterMovieController = (req, res) => {
  try {
    const { name, director, releaseYear, language, rating } = req.query;
    loadMoviesFromFile();
    // let newMovies = [...movies];
    if (name) {
      const names = name.split(",").map((n) => n.trim().toLowerCase());
      movies = movies.filter((movie) =>
        names.includes(movie.name.toLowerCase().replace(/\s/g, ""))
      );
    }

    if (director) {
      movies = movies.filter((movie) =>
        movie.director.toLowerCase().includes(director.toLowerCase())
      );
    }

    if (releaseYear) {
      const years = releaseYear.split(",");
      console.log(years[0]);
      console.log(years[1]);
      movies = movies.filter(
        (movie) =>
          movie.releaseYear >= years[0] && movie.releaseYear <= years[1]
      );
    }

    if (language) {
      movies = movies.filter((movie) =>
        language.includes(movie.language.toLowerCase())
      );
      const languageCount = movies.filter(
        (movie) => movie.language.toLowerCase() === language
      ).length;
      res.status(200).json({
        success: true,
        languageCount,
        movies,
      });
    }

    if (rating) {
      const ratings = rating.split(",").map((r) => parseFloat(r.trim()));
      // console.log(ratings);
      movies = movies.filter(
        (movie) => movie.rating >= ratings[0] && movie.rating <= ratings[1]
      );
    }
    res.status(200).json({
      success: true,
      movies,
      languageCount: -1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Error in filtering the movie",
      error: error.message,
    });
  }
};
