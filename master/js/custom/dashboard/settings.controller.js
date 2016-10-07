(function () {
  'use strict';

  angular
      .module('kadho.dashboard')
      .controller('KadhoSettingsController', KadhoSettingsController);

  KadhoSettingsController.$inject = ['$scope', '$location', '$state', 'UserService', 'NavigationService'];

  function KadhoSettingsController($scope, $location, $state, UserService, NavigationService) {

    var vm = this;

    activate();

    ////////////////

    function activate() {

      // return to login if not logged in
      if (!UserService.getCurrentUser()) {
        $state.go('page.login');
        return;
      }

      var user = UserService.getCurrentUser();
      vm.user = user;

      console.log(user);
      
      $scope.thankYouShown = false;
      $scope.formDisabled = false;
      $scope.message = '';

      /*Functions*/

      $scope.submit = function () {
        console.log("submit");
        $scope.formDisabled = true;
        UserService.sendSupportMessage($scope.message)
          .success(function () {
            $scope.formDisabled = false;
            $scope.thankYouShown = true;
          })
          .error(function () {
            $scope.formDisabled = false;
            $scope.thankYouShown = false;
          });
      };
    }
  }

})();