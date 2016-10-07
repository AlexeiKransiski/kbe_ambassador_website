/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function () {
  'use strict';

  angular
      .module('app.pages')
      .controller('LessonPassesController', LessonPassesController);

  LessonPassesController.$inject = ['$window', '$rootScope', '$http', '$state', '$location', '$filter', '$cookieStore', 'KloudoService', 'UserService'];
  function LessonPassesController($window, $rootScope, $http, $state, $location, $filter, $cookieStore, KloudoService, UserService) {
    var vm = this;

    activate();

    ////////////////

   


    function activate() {

      vm.showPleaseWait = false;
      $rootScope.bodyClass = 'bg-3';
      $rootScope.bgClass = 'hide-cloud-banner';
      
      vm.showPhoneNumber = false;
      vm.showLogin = false;

      vm.prices = [0, 0, 0];
      vm.tickets = [0, 0, 0];
      vm.savePercent = [0, 0, 0];
      vm.exchangeRate = 6.3; // default rate

      vm.discountGroupPrices = {
        '99': [0.01, 0.02, 0.03],
        '0': [6.99, 49.99, 199.99],
        '1': [5.99, 44.99, 179.99],
        '2': [4.99, 36.99, 149.99],
        '3': [2.99, 24.99, 99.99]
      };

      vm.discountGroupTickets = {
        '99': [3, 30, 200],
        '0': [3, 30, 200],
        '1': [3, 30, 200],
        '2': [3, 30, 200],
        '3': [3, 30, 200]
      };

      // return to login if not logged in
      if ($cookieStore.get('session') && !$rootScope.user) {
        KloudoService.getSession($cookieStore.get('session'))
          .success(function (data) {
            if (data.success) {
              UserService.setCurrentUser(data);
              $rootScope.user = UserService.getCurrentUser();
              console.log($rootScope.user);

              KloudoService.getDiscountGroupData()
              .success(function (data) {
                vm.discountGroupTickets = data.tickets;
                vm.discountGroupPrices = data.prices;
                vm.getRate();
                vm.loadPricesForDiscountGroup();
              });

            }
            else {
              $state.go('page.register');
            }
          })
          .error(function () {
            $state.go('page.register');
          });
      }
      else if ($rootScope.user) {
        KloudoService.getDiscountGroupData()
        .success(function (data) {
          vm.discountGroupTickets = data.tickets;
          vm.discountGroupPrices = data.prices;
          vm.getRate();
          vm.loadPricesForDiscountGroup();
        });
      }

      var popupVideo = document.getElementById('popupVideo');

      vm.popupVideoVisible = false;

      vm.showVideo = function () {
        vm.popupVideoVisible = true;
        popupVideo.play();
      };

      vm.closeVideo = function () {
        vm.popupVideoVisible = false;
        popupVideo.autoplay = false;
        popupVideo.load();
      };
      
      vm.isSinglePackage = function() {
        return (vm.tickets.length <= 1);
      }

       vm.getRate = function() {
          return $http.get(
            "https://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3DUSDCNY%253DX%26f%3Dl1n'%20and%20columns%3D'rate%2Cname'&format=json"
            ).then(function (response) {
             var rate = parseFloat(response.data.query.results.row.rate, 6.25);
             vm.exchangeRate = rate;
             console.log(vm.exchangeRate);

          });
        };

      vm.loadPricesForDiscountGroup = function () {
        var discountGroupID = $rootScope.user.discountGroupID;
        vm.prices = vm.discountGroupPrices[discountGroupID];
        vm.tickets = vm.discountGroupTickets[discountGroupID];

        //Super shitty fucking horribleness called hardcoding, jesus fucking christ
        if (vm.tickets[0] <= 0 && vm.tickets[1] <= 0) {
          vm.tickets = [vm.discountGroupTickets[discountGroupID][2]];
          vm.prices = [vm.discountGroupPrices[discountGroupID][2]];
        }

        //vm.prices[0] = vm.prices[0].toFixed();
        //vm.prices[1] = vm.prices[1].toFixed();
        //vm.prices[2] = vm.prices[2].toFixed();

        console.log(vm.prices);
        console.log(vm.tickets);
        // vm.savePercent = [
        //   Math.round((1 - vm.prices[0] / vm.discountGroupPrices['0'][0]) * 100.0),
        //   Math.round((1 - vm.prices[1] / vm.discountGroupPrices['0'][1]) * 100.0),
        //   Math.round((1 - vm.prices[2] / vm.discountGroupPrices['0'][2]) * 100.0),
        // ];
      };

      // get country code to set display accordingly
      //KloudoService.getCountryCode()
      //  .success(function (data) {
      //    if (data == 'CN') {
      //      //$rootScope.language.set('cn_zh');
      //    }
      //  });


      vm.buyLessonPass = function (productID) {
        console.log(productID);
        vm.showPleaseWait = true;
        $rootScope.purchased = true;
        KloudoService.getAlipayPurchaseUrl(productID)
          .success(function (data) {
            console.log(data);
            $window.location.href = data.url;
            //$rootScope.$broadcast('gateway.redirect', data);
          });
      };

      vm.enterDownloadPage = function(href) {
        $rootScope.purchased = false;
        $window.location.href = href;
      }
    }
  }
})();
