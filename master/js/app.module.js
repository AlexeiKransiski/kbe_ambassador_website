/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS Material
 * 
 * Version: 3.2.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function () {
  'use strict';

  angular
      .module('angle', [
          'app.core',
          'app.routes',
          'app.translate',
          'app.settings',
          'app.pages',
          'app.utils'
      ])
      .config(['$cookiesProvider', function ($cookiesProvider) {
        // Set $cookies defaults
        // comment out when on localhost
        $cookiesProvider.defaults.domain = 'kadho.cn';
        //$cookiesProvider.defaults.domain = 'kadho.com';
      }]);
})();

