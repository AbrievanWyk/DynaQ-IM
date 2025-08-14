define(['app'], function(app) {
  app.factory('InstanceIdService', function() {
    let itemId = null;
    return {
      get: function() { return itemId; },
      set: function(id) { itemId = id; }
    };
  });
});