
console.log('Start AppStoreQuery Testing');

var appStore = require('../src/AppStoreQuery.js');

appStore.query({
  term: 'angry birds',
  limit: 2
}, function(apps){
  console.log(apps);

  apps.forEach(function(app, index){
    console.log(app);
  });

});





/*appStore.query('2344589674');
appStore.query('Angry Birds');
appStore.query({
  term: 'facebook',
  limit: 200,
  country: ''
});*/
