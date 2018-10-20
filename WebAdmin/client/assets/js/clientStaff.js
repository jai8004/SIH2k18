angular.module('ClientMaster.staff', []).controller('staffCtrl', ['$scope', '$http', '$cookieStore','$location','$window', function ($scope, $http, $cookieStore,$location,$window) {
    console.log('client staff Controller is working!!!!!!!');
    
    var getList = function(){
        $http.put('http://52.71.231.146:4096/api/admin/list', {
            "token": $window.localStorage.getItem('clientToken')
        }).success(function (response) {
            console.log(response.data)
            $scope.staffs = response.data;
        }).error(function (err) {
            console.log(err);
        });
    }
    
    var blockStaff = function(staffId){
        $http.put('http://52.71.231.146:4096/api/admin/block', {
            "token": $window.localStorage.getItem('clientToken'),
            "_id": staffId
        }).success(function (response) {
            console.log(response.data)
            //$scope.staffs = response.data;
        }).error(function (err) {
            console.log(err);
        });
    }
    
    var deleteStaff = function(staffId){
        $http.put('http://52.71.231.146:4096/api/admin/delete', {
            "token": $window.localStorage.getItem('clientToken'),
            "_id": staffId
        }).success(function (response) {
            console.log(response.data)
            //$scope.staffs = response.data;
        }).error(function (err) {
            console.log(err);
        });
    }
    
    
    var addStaff = function(staff){
        $http.post('http://52.71.231.146:4096/api/admin/add', {
            "token": $window.localStorage.getItem('clientToken'),
            "email":staff.email,
            "name":staff.name,
            "adhaar":staff.adhaar,
            "password":staff.password,
            "dept_id":staff.dept_id,
            "dept_loc":staff.dept_loc,
            "dept_name":staff.dept_name
        }).success(function (response) {
            console.log(response.data)
            //$scope.staffs = response.data;
        }).error(function (err) {
            console.log(err);
        });
    }
    
    getList();

   }]);
