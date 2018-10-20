var App = angular.module('ClientMaster', ['ui.router',
                                          'ngCookies',
                                          'ClientMaster.login',
                                          'ClientMaster.profile',
                                          'ClientMaster.user',
                                          'ClientMaster.staff',
                                          'ClientMaster.file',
                                          'ClientMaster.complaint'
                                         ]);

App.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider.state('dashboard', {
        url: '/app',
        templateUrl: 'assets/template/dashboard.html',
        controller: 'ClientMasterCtrl'
    }).state('data', {
        parent: 'dashboard',
        url: '/dashboard',
        templateUrl: 'assets/template/dashboardTemp.html',
        controller: 'ClientMasterCtrl'
    }).state('profile', {
        parent: 'dashboard',
        url: '/dashboard/profile',
        templateUrl: 'assets/template/profile.html',
        controller: 'profileCtrl'
    }).state('users', {
        parent: 'dashboard',
        url: '/dashboard/users',
        templateUrl: 'assets/template/user.html',
        controller: 'userCtrl'
    }).state('staffs', {
        parent: 'dashboard',
        url: '/dashboard/staffs',
        templateUrl: 'assets/template/staff.html',
        controller: 'staffCtrl'
    }).state('staffAdd', {
        parent: 'dashboard',
        url: '/dashboard/staffs/add',
        templateUrl: 'assets/template/addstaff.html',
        controller: 'staffCtrl'
    }).state('files', {
        parent: 'dashboard',
        url: '/dashboard/files',
        templateUrl: 'assets/template/file.html',
        controller: 'fileCtrl'
    }).state('complaints', {
        parent: 'dashboard',
        url: '/dashboard/complaints',
        templateUrl: 'assets/template/complaint.html',
        controller: 'complainCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'assets/template/login.html',
        controller: 'loginCtrl'
    });

    //$locationProvider.html5Mode(true);
}]);

App.controller('ClientMasterCtrl', ['$scope', '$http', '$cookieStore', '$location', '$window', function ($scope, $http, $cookieStore, $location, $window) {
    console.log("client controller working");

    //console.log($window.localStorage.getItem('clientToken'));

    

    var Model = {
        "token": $window.localStorage.getItem('clientToken')
    };


    var service = function (url, model, obj) {
        $http.put(url, model).success(function (response) {
            console.log(response)
            obj = response;
        }).error(function (err) {
            console.log(err);
        });
    }

    if ($window.localStorage.getItem('clientToken') != undefined && $window.localStorage.getItem('clientToken') != '') {
        service('http://52.71.231.146:4096/api/user/count', Model, $scope.userCount);
        service('http://52.71.231.146:4096/api/admin/count', Model, $scope.staffCount);
        service('http://52.71.231.146:4096/api/file/count', Model, $scope.fileCount);
        service('http://52.71.231.146:4096/api/complaint/count', Model, $scope.complaintCount);
    }


    $scope.logout = function () {
        $window.localStorage.removeItem('clientToken');
        $window.localStorage.removeItem('clientId');
        $location.path('/login');
    };


}]);
