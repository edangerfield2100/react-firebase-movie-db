import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from "./components/pages/home";
import Search from "./components/pages/search";
import Error from "./components/pages/error";
import MovieDetails from "./components/pages/movieDetails";
import ResponsiveDrawer from "./components/layout/responsiveDrawer";

function App() {
  return (
    <ResponsiveDrawer>
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/search" component={Search} />
        <Route path="/movieDetails/:id" component={MovieDetails} />
        <Route component={Error} />
      </Switch>
    </ResponsiveDrawer>
  );
}

export default App;
