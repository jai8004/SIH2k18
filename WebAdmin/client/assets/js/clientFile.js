angular.module('ClientMaster.file',[]).controller('fileCtrl', ['$scope', '$http','$window',  function ($scope, $http,$window) {
    console.log('client file Controller is working!!!!!!!');
   
    var getList = function(){
        $http.put('http://52.71.231.146:4096/api/file/list/all', {
            "token": $window.localStorage.getItem('clientToken')
        }).success(function (response) {
            console.log(response.data)
            $scope.files = response.data;
        }).error(function (err) {
            console.log(err);
        });
    }
    
    getList();
      
    
                             

}]);