(function () {
  'use strict';

  angular
      .module('kadho.dashboard')
      .controller('KadhoDashboardController', KadhoDashboardController);

  KadhoDashboardController.$inject = ['$scope', '$state', '$timeout', '$filter', '$cookieStore', 'UserService', 'NavigationService', 'KloudoService', 'Colors'];

  function KadhoDashboardController($scope, $state, $timeout, $filter, $cookieStore, UserService, NavigationService, KloudoService, Colors) {

    var vm = this;

    // return to login if not logged in
    if ($cookieStore.get('session') && !$scope.user) {

      KloudoService.getSession($cookieStore.get('session'))
        .success(function (data) {
          if (data.success) {
            UserService.setCurrentUser(data);
            $scope.user = UserService.getCurrentUser();
            activate();
          }
          else {
            $state.go('page.login');
          }
        })
        .error(function () {
          $state.go('page.login');
        });
    }

    //activate();
    
    ////////////////

    function activate() {

      $scope.noChildWarning = false;

      // return to login if not logged in
      if (!UserService.getCurrentUser()) {
        $state.go('page.login');
        return;
      }

      $scope.changeSelectedChild = function (child) {
        console.log(child);
        $scope.selectedChild = child;
      };
      
      var overallProgressData = {};
      $scope.overallProgressData = overallProgressData;
      overallProgressData.labels = [$filter('translate')('dashboard.COMPLETE'), $filter('translate')('dashboard.INCOMPLETE')];
      overallProgressData.data = [60, 300];
      overallProgressData.colors = [
          { // primary
            fillColor: 'rgba(148,200,1,1)',
            strokeColor: 'rgba(148,200,1,1)',
            pointColor: 'rgba(63,81,181,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(63,81,181,0.8)'
          },
          { // 2nd
            fillColor: 'rgba(148,1,1,0)',
            strokeColor: 'rgba(234,234,233,1)',
            pointColor: 'rgba(63,81,181,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(210,210,210,0.8)'
          }
      ];
      overallProgressData.progressPercent = Math.round(overallProgressData.data[0] / 360 * 1000) / 10;
      overallProgressData.options = {
        // String - Template string for single tooltips
        tooltipTemplate: "<%= Math.round(value / 360 * 1000) / 10 %>% <%=label%>",
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 80, // This is 0 for Pie charts
      };

      var speechScoreData = {};
      $scope.speechScoreData = speechScoreData;
      speechScoreData.labels = [$filter('translate')('dashboard.COMPLETE'), $filter('translate')('dashboard.INCOMPLETE')];
      speechScoreData.data = [100, 260];
      speechScoreData.colors = [
          { // primary
            fillColor: 'rgba(148,200,1,1)',
            strokeColor: 'rgba(148,200,1,1)',
            pointColor: 'rgba(63,81,181,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(63,81,181,0.8)'
          },
          { // 2nd
            fillColor: 'rgba(148,1,1,0)',
            strokeColor: 'rgba(234,234,233,1)',
            pointColor: 'rgba(63,81,181,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(210,210,210,0.8)'
          }
      ];
      speechScoreData.options = {
        // String - Template string for single tooltips
        tooltipTemplate: "<%= Math.round(value / 360 * 1000) / 10 %>% <%=label%>",
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 80, // This is 0 for Pie charts
      };

      var performanceData = {};
      $scope.performanceData = performanceData;
      performanceData.labels = [];
      performanceData.series = [$filter('translate')('dashboard.CHILD'), $filter('translate')('dashboard.NATIONALAVERAGE')];
      performanceData.data = [];
      performanceData.colors = [
          { // primary
            fillColor: 'rgba(148,200,1,0)',
            strokeColor: 'rgba(148,200,1,1)',
            pointColor: 'rgba(148,200,1,1)',
            pointStrokeColor: 'rgba(159,207,69,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(159,207,69,1)'
          },
          { // 2nd
            fillColor: 'rgba(148,1,1,0)',
            strokeColor: 'rgba(105,167,206,1)',
            pointColor: 'rgba(105,167,206,1)',
            pointStrokeColor: 'rgba(105,167,206,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(105,167,206,1)'
          }
      ];
      performanceData.options = {
        scaleOverride: true,
        // Number - The number of steps in a hard coded scale
        scaleSteps: 10,
        // Number - The value jump in the hard coded scale
        scaleStepWidth: 10,
        // Number - The scale starting value
        scaleStartValue: 0,
        //Boolean - Whether the line is curved between points
        bezierCurve: false,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 5,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 3,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(200,200,200,1)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: false,
      };

      var shortVowels = [];
      $scope.shortVowels = shortVowels;

      $scope.selectedChild = {};
      $scope.selectedName = "";
      $scope.showDashboard = 'hidden';

      $scope.$watch('selectedChild', function () {
        if ($scope.selectedChild.id != undefined) {
          $scope.showDashboard = 'hidden';
          $scope.selectedName = $scope.selectedChild.name;
          vm.pieData = [
                {
                  value: 40,
                  color: Colors.byName('purple'),
                  highlight: Colors.byName('purple'),
                  label: 'Purple'
                },
                {
                  value: 300,
                  color: Colors.byName('yellow'),
                  highlight: Colors.byName('yellow'),
                  label: 'Yellow'
                },
                {
                  value: 120,
                  color: Colors.byName('info'),
                  highlight: Colors.byName('info'),
                  label: 'Info'
                }
          ];

          $timeout(function () {
            $scope.showDashboard = 'show';
            //console.log($scope.selectedChild);
            $scope.loadCurriculumLogsForChild($scope.selectedChild.id);
            $scope.loadActivityProgressLogForChild($scope.selectedChild.id);
            $scope.showWeekPerformance();
          }, 500);

        }
      });

      $scope.httpDataRequestFinishCount = 0;
      $scope.curriculumGrouping = {};
      $scope.hearingCurriculumLogs = {};
      $scope.speakingCurriculumLogs = {};
      $scope.childrenActivityProgressLogs = {};
      $scope.averagePerformanceData = {};

      $scope.curriculumLogs = {};
      $scope.activityProgressLog = {};

      $scope.showGroup = "";
      $scope.showCurriculum = "hearing";

      //Functions

      $scope.toggleShowGroup = function (group) {
        if ($scope.showGroup == group)
          $scope.showGroup = "";
        else
          $scope.showGroup = group;
      };

      $scope.addHearingCurriculumToGrouping = function (groups, curriculumLog) {
        for (var key in groups) {
          for (var i = 0; i < groups[key].logs.length; i++) {
            if (groups[key].logs[i].soundKey == curriculumLog.curriculumID) {
              groups[key].logs[i].hearingLog = curriculumLog;
              groups[key].completedHearingCount += 1;
              return;
            }
          }
        }
      };

      $scope.addSpeakingCurriculumToGrouping = function (groups, curriculumLog) {
        for (var key in groups) {
          for (var i = 0; i < groups[key].logs.length; i++) {
            if (groups[key].logs[i].soundKey == curriculumLog.curriculumID) {
              groups[key].logs[i].speakingLog = curriculumLog;
              groups[key].completedSpeakingCount += 1;
              return;
            }
          }
        }
      };

      $scope.formatTimePlayed = function (timePlayed) {
        var seconds = timePlayed % 60;
        var minutes = parseInt(timePlayed / 60);
        var hours = parseInt(timePlayed / 3600);

        var s = "";
        if (hours < 10)
          s += "0";
        s += hours;
        s += ":";
        if (minutes < 10)
          s += "0";
        s += minutes;
        s += ":";
        if (seconds < 10)
          s += "0";
        s += seconds;

        return s;
      };

      $scope.checkDataLoadCompletion = function () {
        if ($scope.httpDataRequestFinishCount >= 5) {

          // load children 
          KloudoService.getChildren()
            .success(function (data) {
              $scope.children = data.children;

              if (data.children.length > 0)
                $scope.noChildWarning = false;
              else
                $scope.noChildWarning = true;

              // set avatar img url
              for (var i = 0; i < $scope.children.length; i++) {
                var child = $scope.children[i];
                child.birthdate = new Date(child.birthdate);
              }

              if (data.children.length > 0) {
                $scope.changeSelectedChild(data.children[0]);
              }
            })
            .error(function () {
            });

        }
      };

      KloudoService.getChildrenActivityProgressLogs()
        .success(function (data) {
          //console.log(data);
          $scope.childrenActivityProgressLogs = data;
          $scope.httpDataRequestFinishCount += 1;
          $scope.checkDataLoadCompletion();
        })
        .error(function () {
        });

      KloudoService.getELPCurriculumGroupingLookups()
        .success(function (data) {
          $scope.curriculumGrouping = data;
          for (var i = 0; i < $scope.curriculumGrouping.length; i++) {
            $scope.curriculumGrouping[i].soundKey = $scope.curriculumGrouping[i].soundKey.replace("/", "_");
          }
          $scope.httpDataRequestFinishCount += 1;
          $scope.checkDataLoadCompletion();

        })
        .error(function () {
        });

      KloudoService.getChildrenELPHearingCurriculumLogs()
        .success(function (data) {
          $scope.hearingCurriculumLogs = data;
          $scope.httpDataRequestFinishCount += 1;
          $scope.checkDataLoadCompletion();
        })
        .error(function () {
        });

      KloudoService.getChildrenELPSpeakingCurriculumLogs()
        .success(function (data) {
          $scope.speakingCurriculumLogs = data;
          $scope.httpDataRequestFinishCount += 1;
          $scope.checkDataLoadCompletion();

        })
        .error(function () {
        });

      KloudoService.getAveragePerformanceData()
        .success(function (data) {
          $scope.averagePerformanceData = data;

          for (var i = 0; i < $scope.averagePerformanceData.nationalAverage.length; i++) {
            $scope.averagePerformanceData.nationalAverage[i].date = new Date($scope.averagePerformanceData.nationalAverage[i].date);
          }
          for (var i = 0; i < $scope.averagePerformanceData.childrenAverage.length; i++) {
            $scope.averagePerformanceData.childrenAverage[i].date = new Date($scope.averagePerformanceData.childrenAverage[i].date);
          }
          $scope.httpDataRequestFinishCount += 1;
          $scope.checkDataLoadCompletion();
        })
        .error(function () {
        });

      $scope.overallScore = 20;

      $scope.loadActivityProgressLogForChild = function (childID) {
        for (var i = 0; i < $scope.childrenActivityProgressLogs.length; i++) {
          if ($scope.childrenActivityProgressLogs[i].childID == childID) {
            $scope.activityProgressLog = $scope.childrenActivityProgressLogs[i];

            // calculate overall progress
            var pct = $scope.activityProgressLog.overallLessonsCompleted / $scope.activityProgressLog.totalLessons;
            var total = 360;
            var complete = total * (pct);
            total -= complete;
            $scope.overallScore = pct * 100;
            $scope.overallProgressData.data = [complete, total];

            // calculate speech score
            pct = $scope.activityProgressLog.speechScore / 100.0;
            total = 360;
            complete = total * (pct);
            total -= complete;
            $scope.speechScoreData.data = [complete, total];
            return;
          }
        }
      };

      $scope.loadCurriculumLogsForChild = function (childID) {
        var groups = {};

        for (var i = 0; i < $scope.curriculumGrouping.length; i++) {
          var groupName = $scope.curriculumGrouping[i].translation;
          if (groups[groupName] == undefined) {
            groups[groupName] = {
              logs: [],
              completedHearingCount: 0,
              completedSpeakingCount: 0
            };
          }
          groups[groupName].logs.push($scope.curriculumGrouping[i]);
        }

        for (var i = 0; i < $scope.hearingCurriculumLogs.length; i++) {
          if ($scope.hearingCurriculumLogs[i].childID == childID) {
            $scope.hearingCurriculumLogs[i].timePlayedFormatted = $scope.formatTimePlayed($scope.hearingCurriculumLogs[i].timePlayed);
            $scope.addHearingCurriculumToGrouping(groups, $scope.hearingCurriculumLogs[i]);
          }
        }

        for (var i = 0; i < $scope.speakingCurriculumLogs.length; i++) {
          if ($scope.speakingCurriculumLogs[i].childID == childID) {
            $scope.speakingCurriculumLogs[i].timePlayedFormatted = $scope.formatTimePlayed($scope.speakingCurriculumLogs[i].timePlayed);
            $scope.addSpeakingCurriculumToGrouping(groups, $scope.speakingCurriculumLogs[i]);
          }
        }

        $scope.curriculumLogs = groups;
      };

      $scope.loadAveragePerformanceForChild = function (childID, prevDays) {

        var endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);

        var startDate = new Date();
        startDate.setDate(startDate.getDate() - prevDays);

        performanceData.data = [];
        performanceData.labels = [];
        performanceData.data[1] = new Array();
        performanceData.data[0] = new Array();

        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - prevDays);
        for (var i = 0; i < prevDays; i++) {
          performanceData.labels.push(tempDate.getMonth() + "/" + tempDate.getDate());
          tempDate.setDate(tempDate.getDate() + 1);
          performanceData.data[0].push(0);
          performanceData.data[1].push(0);
        }


        for (var i = 0; i < $scope.averagePerformanceData.nationalAverage.length; i++) {
          var avg = $scope.averagePerformanceData.nationalAverage[i];
          if (avg.date >= startDate && avg.date <= endDate) {
            var label = avg.date.getMonth() + "/" + avg.date.getDate();
            //performanceData.labels.push(avg.date.getMonth() + "/" + avg.date.getDate());
            var indexLabel = performanceData.labels.indexOf(label);
            //console.log(indexLabel);
            performanceData.data[1][indexLabel] = avg.score;
          }
        }

        var j = 0;
        for (var i = 0; i < $scope.averagePerformanceData.childrenAverage.length; i++) {
          var avg = $scope.averagePerformanceData.childrenAverage[i];
          if (avg.childID == childID) {
          }
          if (avg.date >= startDate && avg.date <= endDate && avg.childID == childID) {
            var dateLabel = avg.date.getMonth() + "/" + avg.date.getDate();
            var indexLabel = performanceData.labels.indexOf(dateLabel);
            performanceData.data[0][indexLabel] = avg.score;
            //if (dateLabel == performanceData.labels[j]) {
            //  performanceData.data[0].push(avg.score);
            //  j++;
            //}
          }
        }
      };

      $scope.showWeekPerformance = function () {
        $scope.monthSelected = "";
        $scope.weekSelected = "dashboard-week-selected";
        $scope.loadAveragePerformanceForChild($scope.selectedChild.id, 7);
      };

      $scope.showMonthPerformance = function () {
        $scope.monthSelected = "dashboard-month-selected";
        $scope.weekSelected = "";
        $scope.loadAveragePerformanceForChild($scope.selectedChild.id, 30);

      };

    }
  }

})();