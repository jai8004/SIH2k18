angular.module('ClientMaster.profile', ['ngCookies']).controller('profileCtrl', ['$scope', '$http', '$state', '$location', '$cookieStore','$window',  function ($scope, $http, $state, $location, $cookieStore,$window) {
    console.log('client profile Controller is working!!!!!!!');
    
    $scope.clientProfile = {};
    
    
    var getDetail = function(){
        $http.put('http://52.71.231.146:4096/api/admin/detail', {
            "token": $window.localStorage.getItem('clientToken'),
            "staffId": $window.localStorage.getItem('clientId')
        }).success(function (response) {
            console.log(response)
            $scope.clientProfile = response.data;
        }).error(function (err) {
            console.log(err);
        });
    }
    getDetail();
    var updateDetail = function(){
        
    }
    
}]);
