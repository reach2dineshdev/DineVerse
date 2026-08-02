import { Routes, Route } from 'react-router-dom'
import { Home, MovieDetails, MovieList, PageNotFound, Search, Login, Account, MyList, HelpCenter } from '../Pages'

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path='/login' element={<Login />} />
        <Route path='/account' element={<Account />} />
        <Route path='/my-list' element={<MyList />} />
        <Route path='/help' element={<HelpCenter />} />

        {/* Home — Netflix-style carousel + hero */}
        <Route path='/' element={<Home />} />

        {/* Category list pages */}
        <Route path='/movies/top'      element={<MovieList title="Top Rated Movies"  apiPath="movie/top_rated"  />} />
        <Route path='/movies/popular'  element={<MovieList title="Popular Movies"    apiPath="movie/popular"    />} />
        <Route path='/movies/upcoming' element={<MovieList title="Upcoming Movies"   apiPath="movie/upcoming"   />} />

        {/* Detail + search */}
        <Route path='movie/:id' element={<MovieDetails />} />
        <Route path='tv/:id'    element={<MovieDetails />} />
        <Route path='search'    element={<Search apiPath="search/movie" />} />
        <Route path='*'         element={<PageNotFound />} />
      </Routes>
    </>
  )
}
