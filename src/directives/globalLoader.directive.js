define(['app'], function (app) {
   return app.directive('globalLoader', function () {
      return {
         restrict: 'E',
         template: `
          <div class="global-loader-backdrop" ng-show="globalLoaderVisible">
            <div class="global-loader-spinner">
              <img src="https://i.imgur.com/llF5iyg.gif" alt="Loading..." />
            </div>
          </div>
        `
      };
   });
});
