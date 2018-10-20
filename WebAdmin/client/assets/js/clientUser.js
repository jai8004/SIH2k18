angular.module('ClientMaster.user', []).controller('userCtrl', ['$scope', '$http', '$state', '$location','$window', function ($scope, $http, $state, $location,$window) {
    console.log('client user Controller is working!!!!!!!');
    
    $scope.users =[];
    
    var getUsers = function(){
        $http.put('http://52.71.231.146:4096/api/user/list', {
            "token": $window.localStorage.getItem('clientToken')
        }).success(function (response) {
//            console.log(response)
            $scope.users = response;
            console.log($scope.users)
        }).error(function (err) {
            console.log(err);
        });
    }
    getUsers();


}]);
