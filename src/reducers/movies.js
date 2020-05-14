// un reducer pour gerer nos films
import { ADD_MOVIE,REMOVE_MOVIE,GET_MOVIES,GET_NUMBER } from "../actions"

const initialState = {
    movies : [],
    number:0
}

export const movieReducer = (state = initialState,action) =>{

    switch (action.type) {
        case ADD_MOVIE:
            return {
                movies:action.payload,
                number:action.payload.length
            }
            
        break

        case REMOVE_MOVIE:
            return {
                movies:action.payload,
                number:state.number - 1
            }

        break

        case GET_MOVIES:
            return{
                ...state,
                movies:action.payload
            }
        break
        
        case GET_NUMBER:
            return {
                ...state,
                number:action.payload
            }
        break

        default:
            return state
    }
}