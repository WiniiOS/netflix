import React, { Component } from 'react'
import {VideoPlayer,MvPlayerList, Spinner} from '../components'
import axios from 'axios'
import _ from 'lodash'
// import * as firebase from 'firebase'
import '../css/MoviePlayer.css'
import {API_KEY,API_URL, IMAGE_BASE_URL, BACKDROP_SIZE} from '../config'
import {calcTime } from '../utils/helpers'
import { renderLogin } from '../utils/helpers'


const flag = renderLogin()

let newMovies = []

class MoviePlayer extends Component {
    state = {
        movies:[],
        selectedMovie:{},
        loading:true,
        flag:flag
    }

    async componentDidMount(){

    //     // gestion de la restriction aux non connectes
        if (!this.state.flag) {
            this.props.history.push({ pathname:"/login" })
            return
        }

        // abonnement non valide //restriction aux non abonnes
        // setTimeout( () => {

        //     const user = firebase.auth().currentUser
        //     console.log('user',user)
        //     let dbRef
        //     // si l'utilisateur est connecte et present dans la liste des connectes firebase
        //     if(user){
        //         // on recupere le chemin |document qui contient les donnees de l'utilisateur ds firebase
        //         dbRef = firebase.database().ref(`users/${user.uid}`)
        //         // on capture ces donnees et on les stocke dans data
        //         dbRef.on('value', async snapshot =>{
        //             const data = snapshot.val()
        //             console.log('data',data)
        //             if (data) { 
        //                 //si les donnees de la base de donnee sont presentes ds data
        //                 const targetDate = data.validUntil
        //                 const now = new Date().getTime()
        //                 if(targetDate > now ){
        //                 // maintenant que l'on est connecté et qu'on a un abonnement valide

        //                     console.log('Abonnement valide')
                            

        //                 }else{

        //                     this.props.history.push({pathname:'/payment'})
        //                 }
        //             } else {
        //                 this.props.history.push({pathname:'/payment'})
        //             }
        //         })
        //     } else {
        //         this.props.history.push({pathname:"/login"})
        //         console.log("user n'a pas pu etre recupere dans firebase")
        //     }
        // },3000);

        const oldMovies = JSON.parse(localStorage.getItem('movies'))
            const results = await this.getNewMovies(oldMovies)
            newMovies = oldMovies.map((oldMovie,index) => {
                return {
                    id : oldMovie.id,
                    position:index + 1,
                    title:oldMovie.title,
                    duration:results[index],
                    imageUrl:`${IMAGE_BASE_URL}/${BACKDROP_SIZE}/${oldMovie.backdrop_path}`,
                    // on ne peut qu'avoir acces aux bandes d'annonce. tmdb ne nous fournie pas l'url du film complet
                    videoUrl:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                }
            })
    
            const id = this.props.match.params.id
    
            if (id) {
                const selectedMovie = this.getSelectedMovie(newMovies,id)
                this.setState({
                    loading:false,
                    movies:[...newMovies],
                    selectedMovie
                })
            }else{
                const selectedMovie = newMovies[0]
                this.setState({
                    loading:false,
                    movies:[...newMovies],
                    selectedMovie
                })
                this.props.history.push({
                    pathname:`/player/${selectedMovie.id}`
                })
            }

    }

    // pour selectionner un item apres le click
    componentDidUpdate(prevProps){
        if(prevProps.match.params.id !== this.props.match.params.id ) {
            const id = this.props.match.params.id
            const selectedMovie = this.getSelectedMovie(newMovies,id)
            this.setState({selectedMovie})
        }
    }

    getSelectedMovie = (movies, movieId) => {
        // _.find() de lodash
        const selectedMovie = _.find(movies,{ id:parseInt(movieId, 10) })
        return selectedMovie
    }

    handleEnded = () =>{
        const {movies,selectedMovie} = this.state
        const movieIndex = movies.findIndex(movie => selectedMovie.id === movie.id)
        const nextMovieIndex = movieIndex === movies.length + 1 ? 0 : movieIndex + 1
        const newSelectedMovie = movies[nextMovieIndex]
        this.props.history.push({pathname:`/player/${newSelectedMovie.id}`})
        this.setState({selectedMovie:newSelectedMovie})
    }

    getTime = movieId =>{
        return new Promise( 
            (resolve,reject) => {
                const url = `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr`
                axios.get(url)
                   .then(data =>{
                    const duration = data.data.runtime
                    resolve(duration)
                   })
                    .catch(e =>{
                        console.log('erreur',e)
                        reject('erreur',e)
                    })
        }
      )
    }

    getNewMovies = async oldMovies =>{
        let promises = []
        for(let i =0;i < oldMovies.length; i++){
            const element = oldMovies[0]
            const id = element.id
            const time = await this.getTime(id)
            promises.push( calcTime(time) )
        }
        return Promise.all(promises)
    }
  
    render(){
        const {movies,selectedMovie} = this.state
        console.log("result",selectedMovie.imageUrl)
        console.log("result",selectedMovie.videoUrl)
        return (
            <div className="moviePlayer">
                {this.state.loading ? (
                    <Spinner/>
                ) : (
                    <>
                        <VideoPlayer
                            handleEnded={this.handleEnded}
                            videoUrl={selectedMovie.videoUrl}
                            imageUrl={selectedMovie.imageUrl}
                        />
                        <MvPlayerList
                            movies={movies}
                            selectedMovie={selectedMovie}
                        />
                    </>
                )}
            </div>
        )
    }
}

export {MoviePlayer}