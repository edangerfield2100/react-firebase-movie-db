import React,  { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';

import firebase from '../../firebase';


const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  },
  homepage: {
    marginBottom: theme.spacing(3),  
  },
  overview: {
    marginBottom: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 800,
  },
  ratings: {
    color: '#3f51b5',
    borderColor: '#3f51b5',
  }
}));

const USER = 'ted';

function MovieDetails({match}) {
    const { params: { id } } = match;
    const classes = useStyles();

    const [movieDetails, setMovieDetails] = useState({});
    const [movieImg, setMovieImg] = useState(null);
    const [rating, setRating] = React.useState(0);
    const [showRating, setShowRating] = React.useState(false);
    const [userRatingsInfo, setUserRatingsInfo] = React.useState({});

    const toggleShowRating = () => {
        console.log("toggleShowRating called");
        setShowRating(!showRating);
    }

    useEffect(() => {
        let movieURL = `https://api.themoviedb.org/3/movie/${id}?api_key=API-KEY`.replace('API-KEY', process.env.REACT_APP_MOVIE_DB_API_KEY);
        let moviePosterUrl = 'https://image.tmdb.org/t/p/original';

        // fetch movie details from themoviedb
        fetch(movieURL)
            .then(results => results.json())
            .then(data => {
                setMovieDetails(data);
                if (data.poster_path) {
                    moviePosterUrl = `${moviePosterUrl}${data.poster_path}`
                    setMovieImg(moviePosterUrl);
                }
            })
            .catch(err => console.log(err))

        // fetch user rating and docId of movie, from Firebase
        const fetchMovieRatings = async () => {
            const db = firebase.firestore();

            // hardcode test user until authentication in place
            const movieRatingRef = db.collection('users').doc(USER).collection('movieRatings');
            const query = movieRatingRef.where("id", "==", Number(id));
            await query.get().then(querySnapshot => {
                if (querySnapshot && querySnapshot.docs.length > 0) {
                    const usersCurrMovieRatingDoc = querySnapshot.docs[0];
                    let currMovieRatingData = usersCurrMovieRatingDoc.data();
                    currMovieRatingData.docId = usersCurrMovieRatingDoc.id;
                    setUserRatingsInfo(currMovieRatingData);
                    setShowRating(!showRating);
                }
            });
        }
        fetchMovieRatings();
    }, []);


    const buildMovieRatingObject = (id, rating, genres, title) => {
        return {
            id: Number(id), 
            rating: rating, 
            genres: genres && genres.length > 0 ? genres : [], 
            name: title 
        }
    }

    const updateMovieRating = (event, newValue) => {
        const db = firebase.firestore();
        const movieRatingCollRef = db.collection('users').doc(USER).collection('movieRatings');

        // save movie rating to Firebase
        if (userRatingsInfo.docId) {
            // user rating previously existed. update previous rating.            
            const currDocRef = movieRatingCollRef.doc(userRatingsInfo.docId);
            currDocRef.update({rating : newValue})
                .then(() => {
                    // update local state w/ new rating
                    setUserRatingsInfo({...userRatingsInfo, rating: newValue});
                })
                .catch((error) => console.log("error updating movie: ", error));
        } else {
            // user rating did not previously exist. insert user rating.
            // const currMovieGenre = movieDetails.genres && movieDetails.genres.length > 0 ? movieDetails.genres : [];
            const movieRating = buildMovieRatingObject(id, newValue, movieDetails.genres, movieDetails.title);
            movieRatingCollRef.add(movieRating)
                .then((response) => {
                    response.get().then(
                        // add successfull response to local state
                        (usersCurrMovieRatingDoc) => {
                            let currMovieRatingData = usersCurrMovieRatingDoc.data();
                            currMovieRatingData.docId = usersCurrMovieRatingDoc.id;
                            setUserRatingsInfo(currMovieRatingData);
                        }
                    );
                })
                .catch(err => console.log('Error setting movie rating: ', err));
        }
    }

    return (
        <div >   
            {movieDetails && !movieDetails.status_code && (
                <Paper className={classes.paper}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} className={classes.title}>
                            <h1>{movieDetails['title']}</h1>
                            <Divider></Divider>
                        </Grid>
                        <Grid item sm={12} md={5} >
                            {movieImg && (
                                <img
                                    src={movieImg}
                                    alt="Movie"
                                    crossOrigin="anonymous"
                                    width="250">                    
                                </img>
                            )}
                        </Grid>
                        <Grid item sm={12} md={7} >
                            <div className={classes.overview}>{movieDetails['overview']}</div>
                            <div>Release Date: {movieDetails['release_date']}</div>
                            <div>Revenue: {movieDetails['revenue']}</div>
                            <div  className={classes.homepage}>
                                <a href={movieDetails['homepage']}>{movieDetails['title']} Homepage</a>
                            </div>
                            {!showRating && (
                                <div>
                                    <Button 
                                        className={classes.ratings} 
                                        variant="outlined" 
                                        onClick={() => {setShowRating(!showRating)}}>
                                            Rate this Movie
                                    </Button>                                
                                </div>
                            )}
                            {showRating && (
                                <div>
                                    <Rating
                                        name="movieRating"
                                        value={userRatingsInfo.rating || 0}
                                        precision={0.5}
                                        onChange={updateMovieRating}
                                    />
                                </div>   
                            )}                      
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Handle unsuccessful retrieval of movie */}
            {movieDetails && movieDetails.status_code && (
                <div>{movieDetails['status_message']}</div>
            )}
        </div>
    )
}

export default MovieDetails;