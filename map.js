require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Legend"
  ], function(Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Locate, Search, Legend) {

        // Create a basemap for the map view
        var myMap = new Map({
            basemap: "gray-vector"
        });

        

        // Create a map view for the HTML using the basemap
        // previously created.
        var myView = new MapView({
            container: "viewDiv",
            map: myMap
        });


        // Create a Graphics Layer which can be used to draw graphics
        // on the map
        var graphicsLayer = new GraphicsLayer();
        myMap.add(graphicsLayer);

        var xmlhttp = new XMLHttpRequest();

        // This long function below is what will happen when we get a result
        // The actual sending of the http request and reading response occurs
        // after the definition of this function.
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                for (feature of data){
                    var cat_color 
                    var cat = feature.category 

                    if (cat == "Nature"){
                        cat_color = [52, 168, 50] // green
                    }
                    else if (cat == "Museum"){
                        cat_color = [50, 54, 168] // blue
                    }
                    else if (cat == "Amusement"){
                        cat_color = [168, 78, 50] // red
                    }

                    var marker = {
                        type: "simple-marker",
                        style: "circle",
                        color: cat_color
                    }
                    var location = {
                        type: "point",
                        longitude: feature.coordinates[1],
                        latitude: feature.coordinates[0]
                    }

                    var popup_attributes = {
                        state: feature.state,
                        category: feature.category,
                        attraction: feature.attraction,
                        image: feature.image
                    }
            
                    var popup_template = {
                        title: "{attraction}",
                        content: "<b>State</b>: {state}<br> <b>Category</b>: {category}<br><b><img src = {image} style= width:128px;height:128px;/></b>",
                    }

                    
                    var graphic = new Graphic({
                        geometry: location,
                        symbol: marker,
                        attributes: popup_attributes,
                        popupTemplate: popup_template
                    })
            
                    graphicsLayer.add(graphic)
                }


            }

            
        }

        xmlhttp.open("GET", "https://raw.githubusercontent.com/mschenk7474/top-tourist-attraction-USA-states-json/main/top-tourist-att-state.json", true);
        xmlhttp.send();
        myView.popup.defaultPopupTemplateEnabled = true;
  });