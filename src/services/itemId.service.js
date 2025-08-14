define(['app'], function(app) {
  app.factory('ItemIdService', function() {
    let itemId = null;
    return {
      get: function() { return itemId; },
      set: function(id) { itemId = id; }
    };
  });
});