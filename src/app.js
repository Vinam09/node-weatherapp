const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views' )
const partialsPath = path.join(__dirname, '../templates/partials')


//setup handlebars engine
// to have a custom source for view engine instead of default views 
// app.set('views', viewsPath) where viewsPath is the path to where the source is located.

app.set('views', viewsPath )
hbs.registerPartials(partialsPath) //config for partials
app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))



app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Vinam Tuteja'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'Vinam Tuteja'
    })
})

app.get('/help', (req,res)=>{
    res.render('help', {
        title: 'Help',
        name: 'Vinam Tuteja',
        message: 'This is a demo help page!',

    })
})

app.get('/weather', (req, res) => {

    if(!req.query.address){
        return res.send({
            error: "Please provide a valid address."
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {

        if(error){
            return res.send({error})
        }
        
        forecast(latitude, longitude, (error,forecastData) => {
    
            if(error){
                return res.send({error})
            }
            
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })

    
})

app.get('/help/*', (req,res)=>{
    res.render('404', {
        title: 'Help',
        name: 'Vinam Tuteja',
        error: 'Help article not found',

    })
})
app.get('*', (req,res)=>{
    res.render('404', {
        title: '404',
        name: 'Vinam Tuteja',
        error: 'Page not found',
    })
})

app.listen(port, () => {
    console.log('Server is up on port' + port)
})