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
    $(document.body).html($img); // set document content to image
  },
  build: function(position) {
    this.position = position;
    this.buildImage();
  }
};

// make call to geolocation API
navigator.geolocation.getCurrentPosition(map.build.bind(map));
