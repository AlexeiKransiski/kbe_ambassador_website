/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function () {
  'use strict';

  angular
      .module('app.pages')
      .controller('DownloadController', DownloadController);

  DownloadController.$inject = ['$window', '$rootScope', '$http', '$state', '$location', '$filter', '$cookieStore', 'KloudoService', 'UserService'];
  function DownloadController($window, $rootScope, $http, $state, $location, $filter, $cookieStore, KloudoService, UserService) {
    var vm = this;

    activate();

    ////////////////

    function activate() {

      $rootScope.bodyClass = 'bg-3';
      $rootScope.bgClass = 'hide-cloud-banner';

      var userAgent = $window.navigator.userAgent;
      var isWeChat = isWeChat = /micromessenger/i.test(navigator.userAgent);

      vm.downloadApple = "http://rd.wechat.com/redirect/confirm?block_type=1&url=https%3A%2F%2Fitunes.apple.com%2Fapp%2Fid1079971191";
      vm.downloadAndroid = "http://rd.wechat.com/redirect/confirm?block_type=1&url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.kadho.games.learning.elp.mandarin2english";
      if (!isWeChat) {
        vm.downloadApple = "https://itunes.apple.com/app/id1079971191";
        vm.downloadAndroid = "https://play.google.com/store/apps/details?id=com.kadho.games.learning.elp.mandarin2english";
      }

      vm.isAppleDevice = false;
      vm.isAndroidDevice = false;
      vm.showPhoneNumber = false;
      vm.showLogin = false;

      // check if device is an apple device
      if (userAgent.indexOf("iPhone") > 0 || userAgent.indexOf("iPad") > 0 || userAgent.indexOf("iPod") > 0)
        vm.isAppleDevice = true;
      // check if android device
      if (userAgent.indexOf("Android") > 0)
        vm.isAndroidDevice = true;


    }
  }
})();
