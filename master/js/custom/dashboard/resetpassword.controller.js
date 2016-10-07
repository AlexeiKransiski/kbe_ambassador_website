(function () {
  'use strict';

  angular
      .module('kadho.dashboard')
      .controller('ResetPasswordController', ResetPasswordController);

  ResetPasswordController.$inject = ['$scope', '$location', '$state', 'UserService', 'NavigationService', 'KloudoService'];

  function ResetPasswordController($scope, $location, $state, UserService, NavigationService, KloudoService) {

    var vm = this;

    activate();

    ////////////////

    function activate() {

      $scope.email = "";
      $scope.showResetRequestForm = true;
      $scope.showResetForm = false;
      $scope.buttonAttempt = false;
      $scope.invalidResetRequest = false;
      $scope.resetRequestFormSuccess = false;
      $scope.disableSubmit = false;
      $scope.resetRequest = {};
      $scope.resetInfo = {};
      $scope.resetError = '';
      $scope.resetSuccess = false;

      // password request submit
      vm.submitRequestForm = function () {

        if ($scope.email != null && $scope.email.length > 0) {
          $scope.disableSubmit = true;
          $scope.buttonAttempt = true;
          KloudoService.requestPasswordReset($scope.email)
            .success(function (data) {
              $scope.buttonAttempt = false;
              $scope.invalidResetRequest = false;
              if (data.success) {
                $scope.resetRequestFormSuccess = true;
                $scope.showResetRequestForm = false;
              }
              else {
                $scope.invalidResetRequest = true;
                $scope.disableSubmit = false;
              }
            })
            .error(function () {
              $scope.disableSubmit = false;
              $scope.invalidResetRequest = true;
              $scope.buttonAttempt = false;
            });
        }
        else {
          $scope.invalidResetRequest = true;
        }
      };

    }
  }

})();