const filmsModel = require("../models/FilmsModel");
const usersModel = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// Retrieves all films from the database if a valid JWT token is provided.
const showAllfilms = async (token) => {
    try {
        if (token) {
            let tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
            if (!tokenVerified) {
                return "Error: please register/log in";
            } else {
                let films = await filmsModel.find({});
                return films;
            }
        }
        else {
            return 'no token provided'
        }
    } catch (error) {
        console.log(error.message);
        return error.message;
    }

};

// Retrieves films from the databaseand filter by filmId if a valid JWT token is provided.
const showFilmsById = async (token, id) => {
    try {
        let tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        if (!tokenVerified) {
            return "Error: please register/log in";
        } else {
            let filmsById = await filmsModel.findById(id);
            if (filmsById) {
                return filmsById
            }
            else {
                return 'Film not found';
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
        return error.message;
    }
};

//* Retrieves films posted by a specific user from the database.
const showFilmsByUserId = async (token, userId) => {
    try {
        let tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        if (!tokenVerified) {
            return "Error: please register/log in";
        } else {
             // Check if the token belongs to the specified user
            if (tokenVerified._doc._id == userId) {
                let userById = await usersModel.findById(tokenVerified._doc._id)
                // Retrieve films posted by the user
                let filmsPosted = userById.filmsPosted
                // Find films by IDs posted by the user
                let filmsByUserId = await filmsModel.find({ _id: { $in: filmsPosted }});
                if (filmsByUserId) {
                    return filmsByUserId
                }
                else {
                    return 'no films found';
                }
            }
            else {
                return 'unautorised request';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        return error.message;
    }
};

// Saves a new film to the database and associates it with the user who created it.
const saveNewFilm = async (token, obj, userId) => {
    try {
        // Verify the token
        let tokenVerified;
        try {
            tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        } catch (verifyError) {
            return "Error: please register/log in";
        }
        
        if (tokenVerified) {
            // Check if the token belongs to the user
            if (tokenVerified._doc._id == userId) {
                // Create a new film document
                let film = new filmsModel(obj);
                let user = await usersModel.findById(tokenVerified._doc._id);
                
                if (!user) {
                    return "Error: User not found";
                }

                // Add the film's _id to the user's filmsPosted array
                let filmsData = user.filmsPosted;
                filmsData.push(film._id.toString());

                // Save the film document
                try {
                    await film.save();
                } catch (saveError) {
                    return `Error saving film: ${saveError.message}`;
                }

                // Update the user's filmsPosted array
                try {
                    await usersModel.findOneAndUpdate(
                        { _id: tokenVerified._doc._id },
                        { $set: { filmsPosted: filmsData } },
                        { new: true }
                    );
                } catch (updateError) {
                    return `Error updating user: ${updateError.message}`;
                }

                return "New film created successfully!";
            } else {
                return 'Unauthorized request';
            }
        } else {
            return "Error: Token verification failed";
        }
    } catch (error) {
        console.log(error);
        return `Unhandled error: ${error.message}`;
    }
}

//Updates details of a film by its ID if the user is authorized
const updateFilmById = async (token, userId, updatedDetails) => {
    try {
        let tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        if (!tokenVerified) {
            return "Error: please register/log in";
        } else {
            //// Check if the token belongs to the specified user
            if (tokenVerified._doc._id == userId) {
                // Extract film ID from updated details
                let filmId = updatedDetails._id
                // Find the film by ID and ensure it belongs to the user
                let film = await usersModel.findOne({ _id: tokenVerified._doc._id, filmsPosted: filmId });
                // // If the film is found, update its details
                if (film) {
                    let updatedFilm = await filmsModel.findOneAndUpdate(
                        { _id: filmId },
                        { $set: updatedDetails },
                        { new: true }
                    );
                    // If the film is updated successfully, return success message
                    if (updatedFilm) {
                        return "Film updated successfully!";
                    }
                    else {
                        return "update faild"
                    }
                }
                else {
                    return 'Film not found'
                }
            }
            else {
                return "unauthorised request";
            }
        }
    } catch (error) {
        console.log(error);
        return error.message;
    }

}

//Deletes a film by its ID and Remove the film ID from the user's database- if the user is authorized.
const deleteFilmById = async (token, userId, filmId) => {
    try {
        let tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        if (!tokenVerified) {
            return "Error: please register/log in";
        } else {
            // Check if the token belongs to the specified user
            if (tokenVerified._doc._id == userId) {
                // Find the user by ID and ensure the film belongs to the user
                let film = await usersModel.findOne({ _id: tokenVerified._doc._id, filmsPosted: filmId });
                if (film) {
                    // Delete the film from the database
                    const deletedFilm = await filmsModel.findByIdAndDelete(filmId);
                    // Remove the film ID from the user's filmsPosted array
                    const indexToRemove = film.filmsPosted.indexOf(filmId);
                    const updatedFilmsPosted = film.filmsPosted.splice(0, indexToRemove);
                    // Update the user's filmsPosted array
                    const updateUsersFilmPosted = await usersModel.findOneAndUpdate(
                        { _id: tokenVerified._doc._id },
                        { $set: { filmsPosted: updatedFilmsPosted } },
                        { new: true }
                    );;
                    // If the film is deleted and the user is updated successfully, return success message
                    if (deletedFilm && updateUsersFilmPosted) {
                        return "Film deleted successfully!";
                    }
                    else {
                        return "faild to delete"
                    }
                }
                else {
                    return "film not found, cannot delete other users films";
                }
            }
        }
    } catch (error) {
        console.log(error);
        return error.message;
    }
}



module.exports =
{
    showAllfilms,
    saveNewFilm,
    showFilmsById,
    showFilmsByUserId,
    updateFilmById,
    deleteFilmById

}