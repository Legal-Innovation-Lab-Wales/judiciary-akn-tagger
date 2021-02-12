# Judiciary Akn Tagger Front-End

JAT's front-end is a React app that was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
In order to run the app or build a production ready ```JAR``` you only need to follow the instructions in the
projects main ```README``` file.

However, if you're doing local development for JAT then having to rebuild and startup the JAR anytime a front-end change 
is made would be cumbersome, instead it is recommended that you run the back-end app server and the front-end
app separately on different ports. (Thankfully this is a common use case of React and so very easy to do).

---
### Build

To build the front-end app you will need to have [Node.js](https://nodejs.org/en/) installed which should come
bundled with npm.

To run the app in development mode you can run ```npm start```, you can now visit the app at ```http://localhost:3000```.
When in development mode any changes you make to the code will be automatically detected and the app refreshed.

---
### Production

You can compile the app and create the production build via ```npm build``` however there's no reason you should need to
do this as the parent Maven project will handle running the production build and copying the compiled files in the 
appropriate location (```src/main/resources/static-content```).

---
### Proxying
You may be wondering "If I'm running the back-end application on localhost:8080 (default), and the front-end application 
on localhost:3000 (default) then how do fetch requests to the back-end that utilise a relative path (i.e. GET /api/cases) 
go to the right place? Won't they just get routed to the front-end and return an unwanted response?" This is indeed what 
would happen if the ```proxy``` variable in the applications ```package.json``` file wasn't set, by setting this variable
we tell the front-end app that when running in development mode (via ```npm start```) any relative fetch requests we 
make should actually go to the configured address.

---
### Routing

As well as generating this application with ```create-react-app``` I've also added in [React Router](https://reactrouter.com/web/guides/quick-start)
which is a node package that gives us access to some useful components to handle routing the requests to the relevant
component set given the path the user is visiting. This gives JAT the appearance of a multi-page application when in 
actuality it is single-page application with the user always being served the ```index.html``` page. 

---
### Bootstrap

I've also added in [React Bootstrap](https://react-bootstrap.github.io/) which is a rebuild of the bootstrap utility using
React components. This package gives us the ability to easily lay objects out and includes a number of out of the box
components for quick development and stylish design.