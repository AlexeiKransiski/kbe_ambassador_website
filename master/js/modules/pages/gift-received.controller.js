/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function () {
  'use strict';

  angular
      .module('app.pages')
      .controller('GiftReceivedController', GiftReceivedController);

  GiftReceivedController.$inject = ['$window', '$rootScope', '$http', '$state', '$location', '$filter', '$cookieStore', 'KloudoService', 'UserService'];
  function GiftReceivedController($window, $rootScope, $http, $state, $location, $filter, $cookieStore, KloudoService, UserService) {
    var vm = this;

    activate();

    ////////////////


    function activate() {

      $rootScope.bodyClass = 'bg-2';
      $rootScope.bgClass = 'hide-cloud-banner';

      // return to register if not logged in
      if ($cookieStore.get('session') && !$rootScope.user) {
        KloudoService.getSession($cookieStore.get('session'))
          .success(function (data) {
            console.log(data);
            if (data.success) {
              UserService.setCurrentUser(data);
              $rootScope.user = UserService.getCurrentUser();
            }
            else {
              $state.go('page.register');
            }
          })
          .error(function () {
            $state.go('page.register');
          });
      }

      vm.showPhoneNumber = false;
      vm.showLogin = false;

      if ($rootScope.giftCodeData == undefined) {
        //$state.go('page.register');

        vm.giftMessage = 'giftReceived.INVALID';
        vm.showGiftFullMessage = false;
        return;
      }

      vm.giftMessage = 'giftReceived.' + $rootScope.giftCodeData.message;
      vm.showGiftFullMessage = false;


      if ($rootScope.giftCodeData.success) {
        vm.giftCodeData = $rootScope.giftCodeData.giftCodeData;
        vm.showGiftFullMessage = true;
        console.log("promo code: " + $rootScope.giftCodeData.giftCodeData.code);
        $window.trackEvent("giftCode","used",$rootScope.giftCodeData.giftCodeData.code);
        switch (vm.giftCodeData.giftTypeID) {
          case 1:
            vm.giftCodeData.name = 'register.LESSONPASSES';
            break;
          case 2:
            vm.giftCodeData.name = 'register.DISCOUNT';
            break;
            }
        }
      }


    }
  }
)();
