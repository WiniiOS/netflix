import React, {Component} from 'react'
import axios from 'axios'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store'
import {initFirebase} from './utils/firebase-config'
import {Header,Spinner} from './components'
import {Home,Details, NotFound,MoviePlayer,Login,Payment,MoviePlayMovie} from './routes'
import {API_URL,API_KEY,IMAGE_BASE_URL,BACKDROP_SIZE} from './config'
import './App.css'

class App extends Component {

  state={
    loading:true,
    movies:[],
    badge:0,
    image:null,
    mTitle:"",
    mDesc:'',
    activePage:0,
    totalPages:0,
    searchText:''
  }
  
  async componentDidMount(){
      try{
        // connexion a firebase
        initFirebase()

        const {data:{results,page,total_pages}} = await this.loadMovies()
        this.setState({
            movies:results,
            loading:false,
            activePage:page,
            totalPages:total_pages,
            image:`${IMAGE_BASE_URL}/${BACKDROP_SIZE}${results[0].backdrop_path}`,
            mTitle:results[0].title,
            mDesc:results[0].overview
        })

      } catch(e){
        console.log('erreur',e)
      }
  }

  loadMore = async () => {
    try{
      this.setState({loading:true})

      const {data:{results,page,total_pages}} = await this.loadMovies()
      this.setState({
        movies:[...this.state.movies,...results],
        loading:false,
        activePage:page,
        totalPages:total_pages,
        image:`${IMAGE_BASE_URL}/${BACKDROP_SIZE}${results[0].backdrop_path}`,
        mTitle:results[0].title,
        mDesc:results[0].overview
      })

    }catch(erreur){
        console.log('erreur',erreur)
    }
  }

  loadMovies = () =>{
    const page = this.state.activePage + 1
    const url = `${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=fr`
    return axios.get(url)
  }

  handleSearch = value => {
    // lancer la recherche ici
    try{

      this.setState({loading:true,searchText:value,image:null}, async () => {
            const {data:{results,page,total_pages}} = await this.searchMovie()
            this.setState({
              movies:results,
              loading:false,
              activePage:page,
              totalPages:total_pages,
              image:`${IMAGE_BASE_URL}/${BACKDROP_SIZE}${results[0].backdrop_path}`,
              mTitle:results[0].title,
              mDesc:results[0].overview
            })
          })

    } catch(e){
      
        console.log('error',e)
    }
   
  }

  searchMovie = () =>{
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${this.state.searchText}&language=fr`
    return axios.get(url)
  }

  render(){
    return (
      <Provider store={store} >
        <BrowserRouter>
            <div className="App">
              <Header badge={this.state.badge} />
              {!this.state.image ? 
                (
                  <Spinner />
                ) : (
                <Switch>
                    <Route path='/' exact render={() => (
                        <Home
                          {...this.state}
                          onSearchClick={this.handleSearch}
                          onButtonClick={this.loadMore}
                        />
                      )} 
                    />
                    <Route path="/player" exact component={MoviePlayer} />
                    <Route path="/player/:id" exact component={MoviePlayMovie} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/payment" exact component={Payment}/>
                    <Route path="/:id" exact component={Details} />
                    <Route component={NotFound} />
                </Switch>
              )}
            </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App;
