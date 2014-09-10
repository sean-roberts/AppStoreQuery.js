
// TODO: don't be afraid, this will go under a more legit testing process



console.log('Start AppStoreQuery Testing');


var appStore = require('../src/AppStoreQuery.js');


appStore.query({
  term: 'b',
  country: '***',
  limit: 1,
  rawResult: false
}, function(queryData){
  console.log(queryData.responseTime);
  /*queryData.data.forEach(function(app, index){
    console.log('apps starting with b: ', app.name);
  });*/

}, function fail(){
  console.error('Failed to get the query data');
});


// get PopCap stuff
/*
appStore.query({
  term: 284832145
}, function(queryData){

  console.log('request url', queryData.url);

  var app = queryData.first();

  console.log(app ? app.name + ' by ' + app.developer: 'App not found.');

});
*/


/*appStore.query('2344589674');
appStore.query('Angry Birds');
appStore.query({
  term: 'facebook',
  limit: 200,
  country: ''
});*/
