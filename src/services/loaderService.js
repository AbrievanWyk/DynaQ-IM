define(['app'], function(app) {
  return app.service('LoaderService', function($rootScope) {
      this.show = function() {
        $rootScope.globalLoaderVisible = true;
      };
      this.hide = function() {
        $rootScope.globalLoaderVisible = false;
      };
    });
});
