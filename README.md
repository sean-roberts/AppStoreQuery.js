# AppStoreQuery.js
This a node.js utility for searching the Apple API endpoint for
applications available in the App Store.
The endpoints and data are provided by Apple. The goal for this
project is to write a useful utility that makes gathering data
about apps and aggregating that data easy.


## Dependency
The only dependency used in the utility is the `npm request` module.

## How to use

When you make a query to the AppStore, have a simple query function
available through the module that will take your query info, a success
callback, and optionally a failure callback (should anything go wrong).

So to start, simply require the AppStoreQuery module like so:
```javascript
var appStore = require('./AppStoreQuery.js');
```


Then make a query in one of three ways:

1) Input the search term as the first argument to the query function.

```javascript
appStore.query('my search term', function success(queryData){
  console.log('Query was fetched successfully');
});
```

2) Input an Apple ID as the first argument to the query function.
This ID can be either and App ID or a Developer ID.

```javascript
appStore.query('284832145', function success(queryData){
  console.log('Give me all apps developed by PopCap');
});
```
3) Input a query modifier object as the first argument. This object can
contain all of the following properties but the `term` property is required.

```javascript
appStore.query({
  term: 'search term or id',
  limit: 10, // default is 50 range is 1-200,
  country: 'US', //default is US
  rawResult: false // do you want us to give you the raw response
}, function success(queryData){
  console.log('Give me up to 10 results from my search term');
});
```
With that, you can choose which best suites your case for querying. If
you have a simple search you want to make with the default settings, use
the method 1 or 2. If you want to modify certain parts of how to query
or how you want your response, use the 3rd method for more granularity.  


Once you get your callback we will pass what we call a `QueryData` object.
This object has the following signature:

```javascript
var QueryData = {
  data: [], // this is your array of results
  url: '', // the string url sent to the endpoints
  first: function(){}, // returns the first item in the data set
  last: function(){}, // returns the last item in the data set
  source: 'This data is happily provided by Apple :)',
  responseTime: 0 // milliseconds it took to send the query and get results
}
```
## QueryData vs Raw Result
As you see you can pass the `{ rawResult: true }` property flag inside of
the query modifier object. This will tell us whether you want the raw JSON was
sent from itunes, or you want the cleaned up version of that data after we
parse it.

**What do we mean by "cleand up version"?**

Well, in the raw Apple response, could provide results in a way this is not
really expected when you are querying apps. For example, searching for a
developer ID will return the developer info object in the same result set
as your apps. This can lead to issues when parsing the results.

Another major weirdness that people run into is that the itunes API was
built around iTunes original data type: Music. So it contains a lot of property
names that refer to "tracks" and "artist".

With that, I added the QueryData object that has more info on both the query
and the data itself in a way that is more specific to apps. So when you loop
though the QueryData.data array you will only have apps and your app data will
be in a more app lingo that is easier to consume.

Below you will see what each data item will contain and what the corresponding
Apple result values would be if you use the raw result form.

```javascript

{

  id: 0, // => itunesItem.trackId
  name: '', // => itunesItem.trackName
  bundleId: '', // => itunesItem.bundleId
  version: '', // => itunesItem.version
  byteSize: 0, // => itunesItem.fileSizeBytes
  contentRating: '', // => itunesItem.trackContentRating

  developer: '',  // => itunesItem.sellerName
  developerUrl: '', // => itunesItem.sellerUrl
  developerStoreUrl: '',  // => itunesItem.artistViewUrl
  developerId: 0, // => itunesItem.artistId
  storeUrl: '', // => itunesItem.trackViewUrl

  price: 0.0, // => itunesItem.price
  currency: '', // => itunesItem.currency
  formattedPrice: '', // => itunesItem.formattedPrice

  models: [], // => itunesItem.supportedDevices
  minOs: '', // => itunesItem.minimumOsVersion

  releaseDate: Date, // => itunesItem.releaseDate
  releaseNotes: '', // => itunesItem.releaseNotes

  rating: {
    allVers: {
      average: 0, // => itunesItem.averageUserRating
      count: 0, // => itunesItem.userRatingCount
    },
    currentVer: {
      average: 0, // => itunesItem.averageUserRatingForCurrentVersion
      count: 0, // => itunesItem.userRatingCountForCurrentVersion
    }
  },

  categories: [], // => itunesItem.genres
  primaryCategory: '', // => itunesItem.primaryGenreName

  icons: {
    url60: '', // => itunesItem.artworkUrl60
    url100: '', // => itunesItem.artworkUrl100
    url512: '', // => itunesItem.artworkUrl512
  },

  screenshots: {
    mobile: [], // => itunesItem.screenshotUrls
    tablet: [], // => itunesItem.ipadScreenshotUrls
  },

  description: '', // => itunesItem.description

  languages: [] // => itunesItem.languageCodesISO2A
};

```

If you want to learn more about the raw values and endpoints from Apple,
check out the following Apple resource documentation: <br>
https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html


##Endpoint Courtesy
The data tied to App Store apps are not updated very frequently and it
is highly recommended that you architect your solution to cache
the results of your queries for as long as makes sense for your apps.
