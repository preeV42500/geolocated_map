var map = {
  width: 600,
  height: 420,
  buildURL: function() { // build url to receive image from Google Maps API
    var base = "http://maps.googleapis.com/maps/api/staticmap?zoom=14&size=",
        coords = this.position.coords.latitude + "," + this.position.coords.longitude;
    base += this.width + "x" + this.height + "&center=" + coords;
    return base + "&markers=" + coords;
  },
  buildImage: function() { // create image element with width and height in object and set src to url
    var $img = $("<img />", {
      width: this.width,
      height: this.height,
      src: this.buildURL()
    });
    $("#map").html($img); // set document content to image
  },
  latLng: function() { // create formatted string of latitude and longitude to use as parameters in url for weather API
    return "lat=" + this.position.coords.latitude + "&lon=" + this.position.coords.longitude;
  },
  build: function(position) {
    this.position = position;
    this.buildImage();
    weather.get(); // get weather data
  }
};

var weather = {
  endpoint: "http://api.openweathermap.org/data/2.5/weather",
  template: Handlebars.compile($("#weather_card").html()),
  $el: $("#weather"),
  url: function() {
    return this.endpoint + "?" + map.latLng() + "&APPID=d51017b3d34e1c86b6e6c5e073843e29";
  },
  get: function() {
    var dfd = $.ajax({ // make request to weather API
      url: this.url(),
      dataType: "json"
    });
    dfd.done(this.render.bind(this));
  },
  temp: function(kelvin) {
    return kelvinToFahrenheit(kelvin).toFixed(1) + "&deg;F";
  },
  processData: function(json) { // process returned json from ajax request
    return {
      temp: this.temp(json.main.temp),
      description: json.weather[0].description,
      location: json.name,
      icon: json.cod
    };
  },
  render: function(json) {
    this.$el.html(this.template(this.processData(json))).addClass("slide");
  }
};

function kelvinToFahrenheit(temp) { // convert kelvin temperature to fahrenheit
  return 9 / 5 * (temp - 273.15) + 32;
}

// make call to geolocation API
navigator.geolocation.getCurrentPosition(map.build.bind(map));
