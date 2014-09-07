
console.log('Start AppStoreQuery Testing');


var appStore = require('../src/AppStoreQuery.js');




appStore.query({
  term: 'angry birds',
  limit: 20
}, function(apps){

  apps.forEach(function(app, index){
    console.log(app.name);
  });

});





/*appStore.query('2344589674');
appStore.query('Angry Birds');
appStore.query({
  term: 'facebook',
  limit: 200,
  country: ''
});*/
