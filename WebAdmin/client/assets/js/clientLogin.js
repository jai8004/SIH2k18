angular.module('ClientMaster.login', ['ngCookies']).controller('loginCtrl', ['$scope', '$http', '$cookieStore', '$location', '$window', function ($scope, $http, $cookieStore, $location, $window) {
    console.log('client login Controller is working!!!!!!!');

    function checkIsLoggedIn() {
        if ($window.localStorage.getItem('clientToken')) {
            $location.path('app/dashboard');
        }
    }

    checkIsLoggedIn();

    $scope.clientDetail = {
        'email': '',
        'password': ''
    };

    var uri = 'http://52.71.231.146:4096/api/admin/login';
    $scope.clientLogin = function () {
        console.log('into login');
        console.log($scope.clientDetail);
        $http({
                method: 'PUT',
                url: uri,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                data: $scope.clientDetail
            }).error(function (err) {
                console.log(err);
            })
            .success(function (response) {
                console.log(response);
                $window.localStorage.setItem('clientToken', response.token);
                $window.localStorage.setItem('clientId', response._id);
                $location.path('app/dashboard');
            });
    };

}]);
