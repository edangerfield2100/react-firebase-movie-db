import React, { useState, useEffect }  from "react";
import { Link } from "react-router-dom";

function Home() {

    const [top20Movies, setTop20Movies] = useState([]);

    useEffect(() => {
        let url = 'https://api.themoviedb.org/3/discover/movie?primary_release_year=2019&sort_by=revenue.desc&api_key=API-KEY'.replace('API-KEY', process.env.REACT_APP_MOVIE_DB_API_KEY);
        fetch(url)
            .then(results => results.json())
            .then(data => {
                setTop20Movies(data.results);
            });
    }, []);

    return (
        <div>
            <h1>Welcome to Movie Central</h1>

            <h2>Top 2019 Movies by Revenue</h2>
            <ol>
            {top20Movies.map((movie, index) => (
                <li key={index}>
                    {movie && (
                        <Link to={`/movieDetails/${movie.id}`}>{movie.title}</Link>
                    )}
                </li>
            ))}
            </ol>
        </div>
    )
}

export default Home;