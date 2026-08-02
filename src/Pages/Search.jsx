import { useSearchParams } from "react-router-dom"
import { Card } from "../Components"
import { UseFetch } from "../Hooks/UseFetch"
import { useEffect } from "react"

export const Search = ({ apiPath /* NOSONAR */ }) => {

  const [searchParams] = useSearchParams();
  const queryTerm = searchParams.get("q");
  const { data: movies } = UseFetch(apiPath, queryTerm);

  useEffect(() => {
    document.title = `"${queryTerm}" — DineVerse Search`;
  }, [queryTerm]);

  const heading = movies.length === 0
    ? `No results found for "${queryTerm}"`
    : `Results for "${queryTerm}"`;

  return (
    <div className="page-transition">
      <main className="container">
        <h2 className="section-heading">{heading}</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 pb-5">
          {movies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  )
}
