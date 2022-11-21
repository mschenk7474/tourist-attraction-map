/* Pulls all of the necessary GIS Mapping Components*/
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Search",
  ], function(Map, MapView, Graphic, GraphicsLayer, Search) {

        // Creates a basemap layer to build off of
        var myMap = new Map({
            basemap: "streets-vector"
        });

        /* Integrates the map we just made with the HTML component, and
        centers and zooms in on the spot we want the map to focus on */
        var myView = new MapView({
            container: "viewDiv",
            map: myMap,
            center: [-90,40],
            zoom: 2.5
        });


        /* Creates a graph layer where we can add new things to the map*/
        var graphicsLayer = new GraphicsLayer();
        myMap.add(graphicsLayer);

        // Declaration for when we want to request data from a website
        var xmlhttp = new XMLHttpRequest();

        /* This function waits for the request from the website to go through
        and then adds everything we want to the graphics layer we created previously */
        xmlhttp.onreadystatechange = function() {
            // If the data is pulled correctly
            if (this.readyState == 4 && this.status == 200) {
                // Gets the JSON data in a format we can use
                var data = JSON.parse(this.responseText);
                /* Goes through each section in the JSON data,
                making points for each */
                for (feature of data){
                    var cat_color 
                    var cat = feature.category 
                    // Get's different colors based on category
                    if (cat == "Nature"){
                        cat_color = [52, 168, 50] // green
                    }
                    else if (cat == "Museum"){
                        cat_color = [50, 54, 168] // blue
                    }
                    else if (cat == "Amusement"){
                        cat_color = [168, 78, 50] // red
                    }

                    // Defintion of a marker that will appear on our map
                    var marker = {
                        type: "simple-marker",
                        style: "circle",
                        color: cat_color
                    }
                    // Where the marker will be located on the map
                    var location = {
                        type: "point",
                        longitude: feature.coordinates[1],
                        latitude: feature.coordinates[0]
                    }
                    // Handles the pop-up's and what will be in them
                    var popup_attributes = {
                        state: feature.state,
                        category: feature.category,
                        attraction: feature.attraction,
                        image: feature.image
                    }
                    // Has the actual structure of a pop-up
                    var popup_template = {
                        title: "{attraction}",
                        content: "<b>State</b>: {state}<br> <b>Category</b>: {category}<br><b><img src = {image} style= width:128px;height:128px;/></b>",
                    }
                    // put's all the of the things created previously into a graphic
                    var graphic = new Graphic({
                        geometry: location,
                        symbol: marker,
                        attributes: popup_attributes,
                        popupTemplate: popup_template
                    })
                    // adds that graphic to the graphic layer
                    graphicsLayer.add(graphic)
                }
            }
        }
        /* Get's the data from an online JSON file everytime it is ran. If something is updated 
        in the JSON data, it will be updated on the map */
        xmlhttp.open("GET", "https://raw.githubusercontent.com/mschenk7474/top-tourist-attraction-USA-states-json/main/top-tourist-att-state.json", true);
        xmlhttp.send();
        // Makes sure the pop-ups actually pop up
        myView.popup.defaultPopupTemplateEnabled = true;

        // Adds the ability to search and puts it on the map
        var search = new Search ({
            view: myView
        })

        // Adds the search ability to the map in the top right section
        myView.ui.add(search, "top-right")
        
  });