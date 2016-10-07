(function () {
  'use strict';

  var app = angular.module('kadho.services', []);
  //var serviceUrl = '//elpservice.kadho.com';
  var serviceUrl = '//elpservice.kadho.cn';
  //var serviceUrl = '//elpservice-dev.kadho.com';
  //var serviceUrl = '//localhost:59929';
  
  // Kloudo Web API service
  app.factory('KloudoService', ['$http', '$cookieStore', function ($http, $cookieStore) {
    var service = {

      getServiceUrl: function() {
        return serviceUrl;
      },

      getAlipayPurchaseUrl: function(productID) {
        return service.authHttpPost('/api/AliPay/GetAlipayPurchaseUrl',
          {
            value: productID
          });
      },

      checkEmail: function checkEmail(inputvalue) {
        var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
        if (pattern.test(inputvalue)) {
          return true;
        }
        else {
          return false;
        }
      },

      checkPhoneNumber: function checkPhoneNumber(inputvalue) {
        var pattern = /^([0-9])+/;
        if (pattern.test(inputvalue)) {
          return true;
        }
        else {
          return false;
        }
      },

      signup: function (email, phoneNumber, password, fullName, birthYear, birthMonth, giftCode) {
        return $http.post(serviceUrl + '/api/User/GiftCodeSignup',
          {
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            fullName: fullName,
            birthYear: birthYear,
            birthMonth: birthMonth,
            giftCode: giftCode
          });
      },

      giftcodeSignup: function (giftCode) {
        return service.authHttpPost('/api/User/CurrentUserGiftCodeSignup',
          {
            value: giftCode
          });
      },

      getCountryCode: function () {
        return $http.get(serviceUrl + '/api/User/GetCountryCode',
          {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      },

      getDiscountGroupData: function () {
        return $http.get(serviceUrl + '/api/ELP/GetDiscountGroupData',
          {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      },

      processGiftCode: function (code) {
        return service.authHttpPost('/api/ELP/ProcessSystemGiftCode',
        {
          value: code
        });
      },

      login: function (email, phoneNumber, password, expireMinutes) {
        return $http.post(serviceUrl + '/api/Auth/Authenticate',
          {
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            expireMinutes: expireMinutes
          });
      },
      logoff: function (token) {
        return $http.post(serviceUrl + '/api/Auth/Logoff',
          {
            token: token
          });
      },
      getSession: function (token) {
        return $http.post(serviceUrl + '/api/Auth/GetSession',
          {
            token: token
          });
      },

      // auth post get
      authHttpPost: function (path, data) {
        return $http.post(serviceUrl + path, data,
          {
            headers: {
              'Authorization': $cookieStore.get('session'),
              'Content-Type': 'application/json'
            }
          });
      },
      authHttpGet: function (path) {
        return $http.get(serviceUrl + path,
          {
            headers: {
              'Authorization': $cookieStore.get('session'),
              'Content-Type': 'application/json'
            }
          });
      }
    };
    return service;
  }]);

  // User services
  app.factory('UserService', ['$q', '$http', '$log', '$cookieStore', 'KloudoService',
    function ($q, $http, $log, $cookieStore, KloudoService) {
      var service = {
        _user: null,
        observerCallbacks: [],
        onChange: function (callback) {
          service.observerCallbacks.push(callback);
        },
        notifyObservers: function () {
          $log.info('Notifying observers of user change');
          angular.forEach(service.observerCallbacks, function (callback) {
            callback();
          });
        },

        getCurrentUser: function () {
          return service._user;
        },
        setCurrentUser: function (user) {
          service._user = user;
          service.notifyObservers();
        },

        getCurrentSession: function () {
          return $cookieStore.get('session');
        },

        signup: function (newUser) {
          var hashPassword = CryptoJS.SHA256(newUser.password).toString(CryptoJS.enc.Base64);
          return KloudoService.signup(newUser.email, hashPassword,
            newUser.firstName, newUser.lastName, newUser.birthYear, newUser.newsletter);
        },
        logoff: function () {
          service.setCurrentUser(null);
          KloudoService.logoff($cookieStore.get('session'));
          $cookieStore.remove('session');
        }
      };
      return service;
    }]);

})();