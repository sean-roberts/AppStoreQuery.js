/**
  AppStoreQuery.js is a utility for querying the Apple App Store.
  This utility requires the request module for sending the GET request
  to the iTunes API enpoints.
*/

// Required modules
var request = require('request');


// Our formal response cnstr function
// to make gathering information about the
// apps easier
var QueryData = function AppData( url, apps ){

  this.source = 'This data is happily provided by Apple :)';
  this.url = url;
  this.data = apps || [];
  this.each = function each(eachFunc){
    this.data.forEach(function(app, index){
      eachFunc(app, index);
    });
  };
  this.first = function(){
    return this.data.length > 0 ? this.data[0] : undefined;
  }
  this.last = function(){
    return this.data.length > 0 ? this.data[this.data.length - 1] : undefined;
  };
};



// Base Url for our requests
// Note: only http seems to be supported
var ITUNES_URL = 'http://itunes.apple.com/',


  // Handle sending the request to iTunes
  get = function( url, cbSuccess, cbFail){

    var start = new Date();

    request(url, function (error, response, body) {

      if(error){
        console.error('Unable to get app store data', error);
        cbFail && cbFail();
        return;
      }

      if (!error && response.statusCode === 200) {
        cbSuccess( new QueryData( url, processResponse(body), start ) );
      }
    });
  },


  // Handle taking the itunes data and putting it in a more
  // usable format for easier consumption
  processResponse = function (data){

    var storeResponse = JSON.parse(data),
      apps = [];

    if(storeResponse.resultCount === 0){
      return;
    }

    // make sure the items are actually apps and not developers info
    storeResponse.results = storeResponse.results.filter(function(respItem){
      return respItem && respItem.trackName !== undefined;
    });

    // build out a more usable object
    apps = storeResponse.results.map(function(respItem){

      return {

        id: respItem.trackId,
        name: respItem.trackName,
        bundleId: respItem.bundleId,
        version: respItem.version,
        byteSize: respItem.fileSizeBytes,
        contentRating: respItem.trackContentRating,

        developer: respItem.sellerName,
        developerUrl: respItem.sellerUrl,
        developerStoreUrl: respItem.artistViewUrl,
        developerId: respItem.artistId,
        storeUrl: respItem.trackViewUrl,

        price: respItem.price,
        currency: respItem.currency,
        formattedPrice: respItem.formattedPrice,

        models: respItem.supportedDevices,
        minOs: respItem.minimumOsVersion,

        releaseDate: new Date(respItem.releaseDate),
        releaseNotes: respItem.releaseNotes,

        rating: {
          allVers: {
            average: respItem.averageUserRating,
            count: respItem.userRatingCount
          },
          currentVer: {
            average: respItem.averageUserRatingForCurrentVersion,
            count: respItem.userRatingCountForCurrentVersion
          }
        },

        categories: respItem.genres,
        primaryCategory: respItem.primaryGenreName,

        icons: {
          url60: respItem.artworkUrl60,
          url100: respItem.artworkUrl100,
          url512: respItem.artworkUrl512
        },

        screenshots: {
          mobile: respItem.screenshotUrls,
          tablet: respItem.ipadScreenshotUrls
        },

        description: respItem.description,

        languages: respItem.languageCodesISO2A

      };

    });

    return apps;
  },


  // Handle processing what type of url we should use
  // based on the values passed in the query
  buildRequestFromQuery = function (query){

    var term = '',
      country = 'US',
      limit = 50,
      useLookup = false;

    if(!query){
      return;
    }

    // Handle query being passed as an object with search modifiers
    if(typeof query === 'object'){

      if(!query.term){
        console.error('A query term must be assigned to the query object');
        return;
      }

      term = query.term;
      country = query.country || 'US';
      limit = query.limit || 50;
      // enforce the itunes limit of 200 items per response
      limit = limit < 0 ? 1 : limit > 200 ? 200 : limit;
    }

    // Handle the query being passed as a string that should be searched on
    if(typeof query === 'string'){
      term = query;
    }

    // Given the term, see if it is an app id that is being searched for
    // so we can use the faster /lookup endpoint instead of the /search endpoint
    // After aggregating hundreds of apps it seems the ids are always 9 digits
    useLookup = !isNaN(term) && term.toString().length === 9;

    // Build the url
    return [
      ITUNES_URL,
      useLookup ? 'lookup?id=' : 'search?term=', term,
      '&country=', country,
      '&limit=', limit,
      '&entity=software'
      ].join('');
  };




// Export out public API
module.exports = {

  query : function(query, success, fail){

    var url = buildRequestFromQuery(query);

    if(url){
      get(url, success, fail);
    }else {
      console.error('Unable to parse query and build url');
    }
  }

};
