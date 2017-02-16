/* =====================
 Copy your code from Week 4 Lab 2 Part 2 part2-app-state.js in this space
===================== */
//List of datasets
var phillyBikeCrashesDataUrl = "https://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/json/philadelphia-bike-crashes-snippet.json";
var phillySolarInstallationDataUrl = "https://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/json/philadelphia-solar-installations.json";
var phillyCrimeDataUrl = "https://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/json/philadelphia-crime-snippet.json";

var datasetUrls = [phillyBikeCrashesDataUrl, phillySolarInstallationDataUrl, phillyCrimeDataUrl];

//Store inputs
var inputs = {
  "markers": [L.marker([39.9522, -75.1639])],
  "datasets": undefined,
  "url": undefined,
  "latkey": undefined,
  "lngkey": undefined
};

/* =====================
 Leaflet setup - feel free to ignore this
===================== */

var map = L.map('map', {
  center: [39.9522, -75.1639],
  zoom: 12
});
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

/* =====================
  Add our dummy marker to the map
===================== */
_.each(inputs.markers, function(marker) { marker.addTo(map); });

/* =====================
  Map cleaning/reseting
===================== */
var resetMap = function(markers) {
  _.each(inputs.markers, function(mk, i){
    map.removeLayer(mk);
  });
  inputs.markers = [];
};


/* =====================
  Preloading the three available datasets
===================== */
var getAndParseDatasets = function(){
  inputs.datasets = [];

  _.map(datasetUrls, function(urlString){
    $.ajax({url: urlString, async: false}).done(function(rawData){
      var parsedData = JSON.parse(rawData);
      inputs.datasets.push(parsedData);
      return inputs.datasets;
    });
  });
};


/* =====================
  Plot function
===================== */
var plotInputs = function(){

  var unfilled = (inputs.url===""||inputs.url==="undefined")||
  (inputs.latkey==="undefined"||inputs.latkey==="")||
  (inputs.lngkey==="undefined"||inputs.lngkey==="");

  var selecting = _.filter(datasetUrls, function(urlStr){
    return inputs.url.includes(urlStr); //considering spaces when copy and paste
  });

  var isBike = datasetUrls.indexOf(selecting[0])===0 && inputs.latkey.toUpperCase()==="LAT" && inputs.lngkey.toUpperCase()==="LNG";
  var isSolar = datasetUrls.indexOf(selecting[0])===1 && inputs.latkey.toUpperCase()==="Y" && inputs.lngkey.toUpperCase()==="X";
  var isCrime = datasetUrls.indexOf(selecting[0])===2 && inputs.latkey.toUpperCase()==="LAT" && inputs.lngkey.toUpperCase()==="LNG";

  if (unfilled){
    alert("It seems you left some field blank!");
  } else if (selecting.length === 1){

  if(isBike){
    console.log("bike is choosen.");
    inputs.markers = _.map(inputs.datasets[0], function(obj0){
      return L.marker([obj0.LAT, obj0.LNG]).bindPopup(obj0.CRASH_DATE);
    });

  } else if (isSolar) {
    console.log("Solar is choosen.");
    inputs.markers = _.map(inputs.datasets[1], function(obj1){
      return L.marker([obj1.Y, obj1.X]).bindPopup(obj1.NAME);
    });

  } else if (isCrime) {
    console.log("Crime is choosen.");
    inputs.markers = _.map(inputs.datasets[2], function(obj2){
      return L.marker([obj2.Lat, obj2.Lng]).bindPopup(obj2['General Crime Category']);
    });

  } else {
    alert ("Unmatching Lat Key and Lng Key inputs...");
  }
}else {
  alert("Unrecognized url input...");
}
//console.log("this is the one", inputs.markers); //checking..

_.each(inputs.markers, function(mk){
  mk.addTo(map);
});

};

/* =====================
  The whole app executes
===================== */

getAndParseDatasets();
//console.log(inputs.datasets[2]); // [obj,....]

$('button#go-button').click(function(e){
    inputs.url = $("#url-input1").val();
    console.log("url:", inputs.url);
    inputs.latkey = $("#lat-key-input").val();
    console.log("latkey:", inputs.latkey);
    inputs.lngkey = $("#lng-key-input").val();
    console.log("lngkey:", inputs.lngkey);

    resetMap();

    plotInputs();
});
