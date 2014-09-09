# AppStoreQuery.js
This a node.js utility for searching the Apple API endpoint for applications available in the App Store.
The endpoints and data are provided by Apple.

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
  console.log('Query was sent successfully');
});
```

2) Input an Apple ID as the first argument to the query function.
This ID can be either and App ID or a Developer ID.

```javascript
appStore.query('284832145', function success(queryData){
  console.log('This query should get me all apps developed by PopCap');
});
```
3) Input a query modifier object as the first argument. This object can
contain all of the following properties but the `term` property is required.

```javascript
appStore.query({
  term: 'search term or id',
  limit: 10, // default is 50 range is 1-200,
  country: 'US' //default is US
}, function success(queryData){
  console.log('Give me up to 10 results from my search term');
});
```

Once you get your callback we will pass what we call a `QueryData` object.
This object has the following signature:

```javascript
{
  data : [], // this is your array of results
  url : '', // the string url sent to the endpoints
  first : function(){}, // returns the first item in the data set
  last : function(){} // returns the last item in the data set
}
```
