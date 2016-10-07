(function() {
    'use strict';

    angular
        .module('app.translate')
        .run(translateRun)
        ;
    translateRun.$inject = ['$rootScope', '$translate', '$state', '$route', '$timeout'];
    
    function translateRun($rootScope, $translate, $state, $route, $timeout) {

      // Internationalization
      // ----------------------

      $rootScope.language = {
        // Handles language dropdown
        listIsOpen: false,
        // list of available languages
        available: {
          'en':       'English',
          'cn_zh':    'Chinese'
        },
        // display always the current ui language
        init: function () {
          var proposedLanguage = $translate.proposedLanguage() || $translate.use();
          var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
          $rootScope.language.selected = $rootScope.language.available[ (proposedLanguage || preferredLanguage) ];
        },
        set: function (localeId) {
          // Set the new idiom
          $translate.use(localeId);
          // save a reference for the current language
          $rootScope.language.selected = $rootScope.language.available[localeId];
          // finally toggle dropdown
          $rootScope.language.listIsOpen = !$rootScope.language.listIsOpen;
          //$rootScope.prevPage = $state.current.name; 
          //$state.go("page.change-language");

          //$timeout(function () {
          //  $state.go($rootScope.prevPage);
          //}, 2000);
        }
      };

      $rootScope.language.init();

    }
})();