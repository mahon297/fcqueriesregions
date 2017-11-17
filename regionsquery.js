var regions = require('./regions.json');
var request = require('request');
var rp = require('request-promise');
var fs = require('fs');

var regionsWiki = regions;
var noWiki = [];
var promiseArray = [];


String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

for (i = 0; i < 300; i++) {
  var name = regions.features[i].properties.name.toProperCase();
  promiseArray.push(requestWiki(name, i));
}


//j = i + 200
//var name = regions.features[i].properties.name.toProperCase();

  //while (j < 200 && i < regions.features.length){
  //j++;
    //promiseArray.push(requestWiki(name, i));
//}

Promise.all(promiseArray)
  .then(response => {
    addNames(response)
  })

function addNames(response) {
  for (i = 0; i < response.length; i++) {
    var data = response[i];
    console.log(data)

    if (data.query.pages['-1']) {
      console.log('fail');
      regions.features[i].properties["wikiName"] = "fail"
    }
    else {
      console.log('success')
      regions.features[i].properties["wikiName"] = regions.features[i].properties.name.toProperCase();

    }
  }
}

function requestWiki(name, i) {
  var url = ['https://en.wikipedia.org/w/api.php?action=query&prop=extracts&redirects=1&format=json&titles=', name].join('');
  return rp({
    uri: url,
    json: true
  });
}
