import React from "react"
import axios from "axios"
import {useEffect, useState} from "react"
import Navbar from "../Navbar/Navbar"
import "./News.css";
import {Paper, CardContent, Typography, CardActions, Grid, Button,Link, Card, CardMedia, IconButton, ImageList, ImageListItem}from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./newsData.js"
import { newsApi } from "./newsData.js";

const apiKey = import.meta.env.VITE_NEWS_API; // should be in environment file


export default function News({selectedDailyLanguage, userId, handleLogout, dailyLanguages,setSelectedDailyLanguage, loggedIn}){


    const [newsArticles, setNewsArticles] = useState(newsApi)
    const [loadNum, setLoadNum]  = useState(1) // manages page data
    const [displayedArticles, setDisplayArticles] = useState([])
    const [usersLanguages, setUsersLanguages] = useState([])
   

    let countryLanguage = ""; 

    if(selectedDailyLanguage === "1"){
        countryLanguage = "us"
      

    }else if(selectedDailyLanguage === "2"){
        countryLanguage = "fr"
       

    }else if(selectedDailyLanguage === "3"){
        countryLanguage = "de"
      

    }else if(selectedDailyLanguage === "4"){
        countryLanguage = "it"
       

    }else if(selectedDailyLanguage === "5"){
        countryLanguage = "mx"
       

    }else{
        countryLanguage = "se"
      
    }

    const handleLoadMore = () => {
        
        let newNum = loadNum + 1;
        setLoadNum(newNum);
        setDisplayArticles(newsArticles.slice(0, (newNum*5)))
    }

    const handleLanguageChange =(event) =>{

        let selectedLang = event.target.value
       
        setSelectedDailyLanguage(selectedLang)
        

    }

    //will run whenever selectedDailyLanguage is updated
    useEffect(()=>{
            try{
                //API call for perigon news https://api.goperigon.com/v1/all?country=${countryLanguage}&apiKey=${apiKey} 
                //API call for News API https://newsapi.org/v2/top-headlines?country=${countryLanguage}&apiKey=${apiKey}
                axios.get(`https://api.goperigon.com/v1/all?country=${countryLanguage}&apiKey=${apiKey} `).then((response)=>{
                    setNewsArticles(response.data.articles)
                    setDisplayArticles(response.data.articles.slice(0, loadNum*5))
                
                   
                })
    
            }catch(error){
                console.error(error)
            }
        
    },[selectedDailyLanguage])

    return(

        <>
        {!loggedIn ? 
        (
        <>
            <div> <Navbar userId={userId} handleLogout={handleLogout} loggedIn={loggedIn}/></div>
            <h1 className="please-login-header">Please log in to see this page</h1>
        </>
       ) :

        (
            <div id="newsComponent">  
            <div>
            <Navbar userId={userId} handleLogout={handleLogout} loggedIn={loggedIn}/>
               <div className="daily-news-container">Daily News</div>

               <div className="dropdown-lang-containter">
                       {/* drop down menu for user to change language to get news articles in different languages */}
                       <label className="lang-dropdown">Change Language </label>

                       <select onChange={handleLanguageChange}>
                               <option value={null}>Select a language</option>

                                   {dailyLanguages?.map((languages)=>(
                       
                                       <option className="lang-option" key={languages.linguaid} value={languages.linguaid}>{languages.linguaname}</option>
                       
                                   ))}

                       </select>
               </div>
                

           <div className="articles-grid">
               {displayedArticles?.map((articles)=>{

                   return(
                       <>
                           <Grid>
                               <Grid item>
                           
                                   <Card  sx={{ maxWidth: 450, minWidth: 450, maxHeight:600, minHeight: 600, backgroundColor: "#001427", border:5, borderColor:"brown"}}>

                                       <img src={articles.imageUrl}
                                       className="imageStyle"
                                       onError={(e)=> {
                                           e.currentTarget.onerror = null; 
                                           e.currentTarget.src = "https://www.lifeloveandsugar.com/wp-content/uploads/2023/03/Gingerbread-Cookies5E.jpg"}}/>
                                       <CardActions>
                                           <Link target="_blank" href={articles.url} underline="hover" style={{color:'white', fontSize: 24, textAlign:"center", }}>{articles.title}</Link>
                                       </CardActions>

                                       <CardContent>
                                           <Typography style={{color:'white', fontSize: 24, paddingTop:10, textAlign:"center"}}> {articles.description}</Typography>
                                       </CardContent>
                                   </Card>
                               </Grid>
                           </Grid>
                       </>
                      
                   )
               })}
           </div>

           <div className="loadMore-btn-container">
                  <Button  variant="outlined" style={{color: 'brown', borderColor: 'brown', border: 4, fontSize:24}} onClick={handleLoadMore}>Load More</Button>
           </div>      
          
           </div>
       </div>
        )}
       
        </>
        
    )
}