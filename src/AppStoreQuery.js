

var request = require('request');

var ITUNES_URL = 'http://itunes.apple.com/';

var get = function( url, cbSuccess, cbFail){

  request(url, function (error, response, body) {

    if(error){
      console.error('Unable to get app store data', error);
      cbFail && cbFail();
      return;
    }

    if (!error && response.statusCode === 200) {
      cbSuccess( processResponse(body) );
    }
  });
};

var processResponse = function (data){

  var storeReponse = JSON.parse(data),
    apps = [];

  if(storeReponse.resultCount === 0){
    return;
  }

  apps = storeReponse.results.map(function(respItem){

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
      developerStoreId: respItem.artistId,
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

      description: respItem.description
    };

  });

  return apps;
};

var buildRequestFromQuery = function(query){

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

  // given the term, see if it is an app id that is being searched for
  // so we can use the faster /lookup endpoint instead of the /search endpoint
  useLookup = !isNaN(term) && term.length === 10;

  // Build the url
  return [
    ITUNES_URL,
    useLookup ? 'lookup?id=' : 'search?term=', term,
    '&country=', country,
    '&limit=', limit,
    '&entity=software'
    ].join('');
};




var AppStore = {
  query : function(query, success, fail){

    var url = buildRequestFromQuery(query);

    if(url){
      get(url, success, fail);
    }else {
      console.error('Unable to parse query and build url');
    }
  }
};

module.exports = AppStore;
