/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function () {
  'use strict';

  angular
      .module('app.pages')
      .run(logoffRun);
  logoffRun.$inject = ['$rootScope', '$state', 'UserService'];

  function logoffRun($rootScope, $state, UserService) {
    
    $rootScope.logoff = function () {
      UserService.logoff();
      $rootScope.user = undefined;
      $state.go('page.register');
    };

  }

  angular
      .module('app.pages')
      .controller('RegisterFormController', RegisterFormController);

  RegisterFormController.$inject = ['$window', '$rootScope', '$http', '$state', '$location', '$filter', '$cookieStore', 'KloudoService', 'UserService'];
  function RegisterFormController($window, $rootScope, $http, $state, $location, $filter, $cookieStore, KloudoService, UserService) {
    var vm = this;

    activate();

    ////////////////


    function activate() {

      $rootScope.bodyClass = '';
      $rootScope.bgClass = '';

      // return to register if not logged in
      if ($cookieStore.get('session') && !$rootScope.user) {
        KloudoService.getSession($cookieStore.get('session'))
          .success(function (data) {
            if (data.success) {
              UserService.setCurrentUser(data);
              $rootScope.user = UserService.getCurrentUser();

              KloudoService.giftcodeSignup(vm.promoCode)
                .success(function (data) {
                  $rootScope.giftCodeData = data;
                  $state.go('page.giftreceived');
                });
            }
          });
      }

      var userAgent = $window.navigator.userAgent;
      var isWeChat = isWeChat = /micromessenger/i.test(navigator.userAgent);

      vm.downloadApple = "http://rd.wechat.com/redirect/confirm?block_type=1&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fid1031367468";
      vm.downloadAndroid = "http://rd.wechat.com/redirect/confirm?block_type=1&url=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Fid1031367468";
      if (!isWeChat) {
        vm.downloadApple = "https://itunes.apple.com/us/app/mochus-kitchen-learn-english/id1031366472?ls=1&mt=8";
        vm.downloadAndroid = "https://play.google.com/store/apps/details?id=com.Kadho.KCG.MK";
      }

      vm.isAppleDevice = false;
      vm.isAndroidDevice = false;
      vm.showPhoneNumber = false;
      vm.showLogin = false;
      vm.highlightName = '';
      vm.highlightEmail = '';
      vm.highlightPhone = '';
      vm.highlightPassword = '';
      vm.highlightBirthday = '';
      vm.highlightTos = '';


      // check if device is an apple device
      if (userAgent.indexOf("iPhone") > 0 || userAgent.indexOf("iPad") > 0 || userAgent.indexOf("iPod") > 0)
        vm.isAppleDevice = true;
      // check if android device
      if (userAgent.indexOf("Android") > 0)
        vm.isAndroidDevice = true;

      var serviceUrl = KloudoService.getServiceUrl();

      // forgot password link
      if (serviceUrl.indexOf('kadho.cn') != -1)
        vm.forgotPasswordLink = 'https://www.kadho.cn/resetpasswordphone';
      else
        vm.forgotPasswordLink = 'http://beta.kadho.com/resetpasswordphone';

      // show phone number for China
      if (serviceUrl.indexOf('kadho.cn') != -1)
        vm.showPhoneNumber = true;
      else
        vm.showPhoneNumber = false;

      // grab promo code
      vm.promoCode = $location.search()["promo"];
      vm.allowPromoInput = false;

      if (vm.promoCode == undefined) {
        if ($rootScope.savedPromoCode != undefined) {
          vm.promoCode = $rootScope.savedPromoCode;
        }
        else {
          vm.promoCode = "";
          vm.allowPromoInput = true;
        }
      }
      else
        $rootScope.savedPromoCode = vm.promoCode;

      // bind here all data from the form
      vm.account = {};
      // place the message if something goes wrong
      vm.authMsg = '';

      vm.tosAgree = false;

      var curDate = new Date();
      vm.birthdateRequiredError = false;
      vm.years = [];
      vm.selectedYear = undefined;
      vm.months = [];
      vm.selectedMonth = undefined;
      vm.showSuccess = false;
      vm.disableSubmit = false;
      vm.checkBoxImg = "../app/img/checkbox_inactive.png";


      for (var i = curDate.getFullYear() - 18; i > curDate.getFullYear() - 100; i--) {
        vm.years.push(i);
      }

      for (var i = 1; i <= 12; i++) {
        vm.months.push(i);
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

      vm.changeSelectedYear = function (year) {
        vm.selectedYear = year;
      };

      vm.changeSelectedMonth = function (month) {
        vm.selectedMonth = month;
      };

      vm.toggleTosAgree = function () {
        vm.tosAgree = !vm.tosAgree;
        if (vm.tosAgree) {
          vm.checkBoxImg = "../app/img/checkbox_active.png";
        }
        else {
          vm.checkBoxImg = "../app/img/checkbox_inactive.png";
        }
      };

      vm.register = function () {
        vm.disableSubmit = true;
        vm.authMsg = '';
        vm.errorPassword = '';
        vm.errorTerms = '';
        vm.showError = false;
        vm.highlightName = '';
        vm.highlightEmail = '';
        vm.highlightPhone = '';
        vm.highlightPassword = '';
        vm.highlightBirthday = '';
        vm.highlightTos = '';

        // check for name
        if (vm.account.fullName == undefined || vm.account.fullName.length < 1) {
          vm.showError = true;
          vm.highlightName = 'text-danger';
        }

        // check for birthdate
        if (vm.selectedYear !== parseInt(vm.selectedYear) || vm.selectedMonth !== parseInt(vm.selectedMonth)) {
          vm.highlightBirthday = 'text-danger';
          vm.showError = true;
        }

        // check for email
        if (!vm.showPhoneNumber && (vm.account.email == undefined || !KloudoService.checkEmail(vm.account.email))) {
          vm.highlightEmail = 'text-danger';
          vm.showError = true;
        }

        // check for phone number
        if (vm.showPhoneNumber && (vm.account.phoneNumber == undefined || !KloudoService.checkPhoneNumber(vm.account.phoneNumber))) {
          vm.highlightPhone = 'text-danger';
          vm.showError = true;
        }

        // check for password
        if (vm.account.password == undefined || vm.account.password.length < 6 || vm.account.password.length > 32) {
          vm.showError = true;
          vm.highlightPassword = 'text-danger';
          vm.errorPassword = 'register.ERROR10';
        }

        // check tos
        if (!vm.tosAgree) {
          vm.showError = true;
          vm.highlightTos = 'text-danger';
          vm.errorTerms = 'register.ERROR11';
        }

        if (vm.showError) {
          if (vm.showPhoneNumber) {
            vm.authMsg = 'register.ERROR13';
          }
          else {
            vm.authMsg = 'register.ERROR1';
          }
          vm.disableSubmit = false;
        }
        if (!vm.showError) {
          var hashPassword = CryptoJS.SHA256(vm.account.password).toString(CryptoJS.enc.Base64);

          var phoneNumber = '';
          if (vm.account.phoneNumber != undefined && vm.account.phoneNumber.length > 0)
            phoneNumber = "86" + vm.account.phoneNumber;

          //email, password, fullName, birthYear, birthMonth, giftCode
          KloudoService.signup(vm.account.email, phoneNumber, hashPassword, vm.account.fullName, vm.selectedYear, vm.selectedMonth, vm.promoCode)
            .success(function (data) {
              vm.disableSubmit = false;

              if (data.success) {
                vm.showSuccess = true;
                $rootScope.giftCodeData = data;
                
                // login
                KloudoService.login(vm.account.email, phoneNumber, hashPassword, 60)
                  .success(function (data) {
                    if (data.success) {
                      UserService.setCurrentUser(data);
                      // save session
                      $cookieStore.put('session', data.token);
                      $rootScope.savedPromoCode = vm.promoCode;
                      $state.go('page.giftreceived');
                    }
                    else {
                      vm.authMsg = 'register.ERROR12';
                      vm.disableSubmit = false;
                    }
                  })
                  .error(function () {
                    vm.authMsg = 'register.ERROR7';
                    vm.disableSubmit = false;
                  });

              }
              else {
                vm.authMsg = data.message;

                switch (data.message) {
                  case 'EmailExists':
                    vm.highlightEmail = 'text-danger';
                    vm.authMsg = 'register.ERROR2';
                    break;
                  case 'InvalidPhoneNumber':
                    vm.highlightPhone = 'text-danger';
                    vm.authMsg = 'register.ERROR8';
                    break;
                  case 'PhoneNumberExists':
                    vm.highlightPhone = 'text-danger';
                    vm.authMsg = 'register.ERROR9';
                    break;
                  case 'InvalidAge':
                    vm.highlightBirthday = 'text-danger';
                    vm.authMsg = 'register.ERROR1';
                    break;
                  case 'GiftCodeInvalid':
                    vm.authMsg = 'register.ERROR3';
                    break;
                  case 'GiftCodeAlreadyUsed':
                    vm.authMsg = 'register.ERROR4';
                    break;
                  case 'GiftCodeExpired':
                    vm.authMsg = 'register.ERROR5';
                    break;
                  case 'GiftCodeReachedMaxUses':
                    vm.authMsg = 'register.ERROR6'
                    break;
                }
              }
            })
            .error(function () {
              vm.disableSubmit = false;
              vm.authMsg = 'register.ERROR7'
            });
        }
      };

      vm.login = function () {
        vm.authMsg = '';
        vm.disableSubmit = true;

        if (vm.loginForm.$valid) {

          var hashPassword = CryptoJS.SHA256(vm.accountLogin.password).toString(CryptoJS.enc.Base64);
          var loginDuration = 60;

          var phoneNumber = '';
          if (vm.accountLogin.phoneNumber != undefined && vm.accountLogin.phoneNumber.length > 0)
            phoneNumber = "86" + vm.accountLogin.phoneNumber;

          KloudoService.login(vm.accountLogin.email, phoneNumber, hashPassword, loginDuration)
            .success(function (data) {

              if (data.success) {
                UserService.setCurrentUser(data);
                // save session
                $cookieStore.put('session', data.token);

                KloudoService.giftcodeSignup(vm.promoCode)
                  .success(function (data) {
                    $rootScope.giftCodeData = data;
                    $rootScope.promoCode = vm.promoCode;
                    if($rootScope.giftCodeData.message == 'ALREADY_USED')
                    {
                      vm.authMsg = 'register.ERROR4';
                      vm.disableSubmit = false;
                    }
                    else
                    {
                      $state.go('page.giftreceived');
                    }
                  });
              }
              else {
                vm.authMsg = 'register.ERROR12';
                vm.disableSubmit = false;
              }
            })
            .error(function () {
              vm.authMsg = 'register.ERROR7';
              vm.disableSubmit = false;
            });
        }
        else {
          vm.disableSubmit = false;
          // set as dirty if the user click directly to login so we show the validation messages
          /*jshint -W106*/
          if (vm.loginForm.account_email != undefined)
            vm.loginForm.account_email.$dirty = true;
          if (vm.loginForm.account_phoneNumber != undefined)
            vm.loginForm.account_phoneNumber.$dirty = true;
          vm.loginForm.account_password.$dirty = true;
        }
      };

    }
  }
})();
