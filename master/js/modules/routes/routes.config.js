/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(true);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/page/register');

        // 
        // Application Routes
        // -----------------------------------   
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
          })
          //
          // Single Page Routes
          // -----------------------------------
          .state('page', {
              url: '/page',
              templateUrl: 'app/pages/page.html',
              resolve: helper.resolveFor('modernizr', 'icons'),
              controller: ['$rootScope', function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
              }]
          })
          .state('page.register', {
              url: '/register',
              title: 'Registration',
              templateUrl: 'app/pages/register.html',
              resolve: helper.resolveFor('cryptoJS')
          })
          .state('page.lessonpasses', {
            url: '/lessonpasses',
            title: 'Lesson Passes',
            templateUrl: 'app/pages/lessonpasses.html',
            resolve: helper.resolveFor('cryptoJS')
          })
          .state('page.giftreceived', {
            url: '/giftreceived',
            title: 'Gift Received',
            templateUrl: 'app/pages/giftreceived.html',
            resolve: helper.resolveFor('cryptoJS')
          })
          .state('page.download', {
            url: '/download',
            title: 'Download',
            templateUrl: 'app/pages/download.html',
            resolve: helper.resolveFor('cryptoJS')
          })
          .state('page.tos-en', {
            url: '/tos-en',
            title: 'Terms of Service',
            templateUrl: 'app/pages/TOS-en.html'
          })
          .state('page.tos-cn', {
            url: '/tos-cn',
            title: 'Terms of Service',
            templateUrl: 'app/pages/TOS-cn.html'
          })
          .state('page.privacy-en', {
            url: '/privacy-en',
            title: 'Privacy Policy',
            templateUrl: 'app/pages/privacy-en.html'
          })
          .state('page.privacy-cn', {
            url: '/privacy-cn',
            title: 'Privacy Policy',
            templateUrl: 'app/pages/privacy-cn.html'
          })
          .state('page.404', {
              url: '/404',
              title: 'Not Found',
              templateUrl: 'app/pages/404.html'
          })
          .state('page.change-language', {
            url: '/changeLanguage',
            title: 'Changing Language',
            templateUrl: 'app/pages/change-language.html'
          });

    } // routesConfig

})();

