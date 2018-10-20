angular.module('ClientMaster.complaint', []).controller('complainCtrl', ['$scope', '$http','$state','$location','$window', function ($scope, $http,$state,$location,$window) {
    console.log('client complaint Controller is working!!!!!!!');
    
   var getList = function(){
        $http.put('http://52.71.231.146:4096/api/complaint/list', {
            "token": $window.localStorage.getItem('clientToken')
        }).success(function (response) {
            console.log(response)
            $scope.complaints = response;
        }).error(function (err) {
            console.log(err);
        });
    }
   
   getList();
    
    
}]);