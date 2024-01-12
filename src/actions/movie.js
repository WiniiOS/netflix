import { ADD_MOVIE,REMOVE_MOVIE,GET_MOVIES,GET_NUMBER } from "./index"

// l'action creator addMovie qui retourne l'action ajouter un film dans la liste de souhaits
// movie est un objet qui contient les info relatives a ce film
export const addMovie = movie =>{
    let movies = JSON.parse(localStorage.getItem("movies"))

    if(movies){
        movies = [...movies,movie]
    }else{
        movies = []
        movies.push(movie)
    }
    localStorage.setItem("movies",JSON.stringify(movies))

    return {
        type:ADD_MOVIE,
        payload:movies
        // movies est un tableau au format [{...},{...}]
    }
}

// action creator removeMovie qui prend l'id du film que l'on veut supprimer
// action 2
export const removeMovie = movieId =>{
    const oldMovies = JSON.parse(localStorage.getItem("movies"))
    const movies = oldMovies.filter(movie => movie.id !== movieId)
    // mise a jour du localStorage
    localStorage.setItem('movies',JSON.stringify(movies))
    return {
        type:REMOVE_MOVIE,
        payload:movies
    }
}

// Action creator getMovie
export const getMovies = () => {
    const movies = JSON.parse(localStorage.getItem("movies"))
    return {
        type:GET_MOVIES,
        payload:movies
    }
}

export const getNumber = () =>{
    const movies = JSON.parse(localStorage.getItem("movies"))
    let number
    if (movies) {
        number = movies.length
    } else {
        number = 0
    }
    return {
        type:GET_NUMBER,
        payload:number
    }
} 
