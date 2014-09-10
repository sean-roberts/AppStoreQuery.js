
// Jasmine Tests

describe('AppStoreQuery', function(){

  var appStore = require('../../src/AppStoreQuery.js');


  it('Should be loaded', function(){
    expect(appStore).toBeDefined();
  });



  it('Should load apps with data and query properties', function( done ){

    //doneHelper.waitForMe();

    appStore.query('angry birds', function(queryData){

      expect(queryData.data.length > 0).toBe(true);
      expect(queryData.url).toBeTruthy();
      expect(queryData.responseTime).toBeTruthy();
      expect(queryData.source).toBeTruthy();

      done();
    });
  });



  it('Should find app by ID and use lookup url', function( done ){

    var id = 331786748,

      dones = {
        stringTest : 0,
        numberTest : 0,
        objStringTest : 0,
        objNumberTest : 0
      },

      checkDone = function(){
        if(dones.stringTest && dones.numberTest && dones.objStringTest && dones.objNumberTest){
          done();
        }
      },

      asserts = function(queryData){
        expect(queryData.data[0].id).toBe(id);
        expect(queryData.url).toContain('/lookup');
      };


    // when string
    appStore.query(id.toString(), function(queryData){
      asserts(queryData);
      dones.stringTest = true;
      checkDone();
    });


    // when a number
    appStore.query(id, function(queryData){
      asserts(queryData);
      dones.numberTest = true;
      checkDone();
    });


    // when using a query modifier with a string term
    appStore.query({
      term : id.toString()
    }, function(queryData){
      asserts(queryData);
      dones.objStringTest = true;
      checkDone();
    });


    // when using a query modifier with a number term
    appStore.query({
      term : id
    }, function(queryData){
      asserts(queryData);
      dones.objNumberTest = true;
      checkDone();
    });

  });



  it('Should modify the URL based on the query modifiers', function( done ){

    appStore.query({
      term: 'facebook',
      limit: 1,
      country: 'MX'
    }, function(queryData){

      expect(queryData.url).toContain('term=facebook');
      expect(queryData.url).toContain('limit=1');
      expect(queryData.url).toContain('country=MX');

      // also make sure we got back only one item
      expect(queryData.data.length).toBe(1);

      done();
    });

  });



  it('Should give raw results from apple when passed as a query modifier', function( done ){

    appStore.query({
      term: 'facebook',
      limit: 1,
      rawResult: true
    },function(queryData){

      // we don't send the parsed data to the callback
      // so it will come as a string if it is raw
      expect(typeof queryData).toBe('string');

      done();
    });
  });



  it('Should handle calling the fail callback when we give invalid endpoint values', function( done ){

    var fail = function(){
      console.log('fail called');
    };

    fail = jasmine.createSpy();

    waitsFor(function() {
        return fail.callCount > 0;
    }, "The fail callback timed out.", 5000);

    runs(function() {
        expect(fail).toHaveBeenCalled();
        done();
    });


    appStore.query({
      term: 'facebook',
      country: 'XX'
    }, function( queryData ){
      //should not come here
    }, fail);

  });

});
