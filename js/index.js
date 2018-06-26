var app = angular.module('VUWPortalApp', []);

//variables for startup here
app.controller('MainCtrl', function($scope, $http) {

  $scope.hideStudentView = true;
  $scope.hideStaffView = true;
  $scope.loggedIn = false;
  $scope.username = null;

  //retrieve Course Directory list from server
  $http.get('https://caab.sim.vuw.ac.nz/api/handsszavi/course_directory.json')
    .then(function successCall(response) {
      $scope.courses = response.data.courses;
    }, function errorCall() {});

  //retrieve student course association from server
  $http.get('https://caab.sim.vuw.ac.nz/api/handsszavi/course_association_directory.json')
    .then(function successCall(response) {

      $scope.courseAssociations = response.data.courseAssociations;
    }, function errorCall() {
      window.alert("Error")
    });
    //retrieve all assignments from server
  $http.get('https://caab.sim.vuw.ac.nz/api/handsszavi/assignment_directory.json')
    .then(function successCall(response) {
      $scope.assignments = response.data.assignments;
    }, function errorCall() {});

  //Checks list of usernames & passwords against inputed text
  $http.get("https://caab.sim.vuw.ac.nz/api/handsszavi/user_list.json")
    .then(function sucessCall(response) {
      $scope.users = response.data.users;
    }, function errorCall() {});

  //check username and password against JSON file
  $scope.logIn = function() {

    for (var i = 0; i < $scope.users.length; i++) {
      if ($scope.uName == $scope.users[i].LoginName && $scope.pWord == $scope.users[i].Password && $scope.userType == $scope.users[i].UserType) {

//username and password must exist in file, and user must have selected the correct Radio type
        $scope.username = $scope.users[i].LoginName;
        $scope.userID = $scope.users[i].ID;
        $scope.loginFeedback = null;
        $scope.loggedIn = true;
        runLogin();
        // break to end the for loop
        break;
      } else {
        $scope.loginFeedback = "Wrong Information";
      }
    }
  };

  filterCourses = function() {
    $scope.filteredCourses = [];
    for (var i = 0; i < $scope.courseAssociations.length; i++) {
      if ($scope.courseAssociations[i].StudentID == $scope.userID) {
        filteredCourses.add($scope.courseAssociations[i].CourseID)
      }
    }
  };

  //function runs when correct credentials entered, and displays correct divs to corresponding ID login
  runLogin = function() {
   
   // If Student Login then this happens
    if ($scope.userType == 'student') {
      $scope.hideLogin = "true";
      $scope.loggedIn = true;
      $scope.hideStudentView = false;
      $scope.hideStudentCourses = false;
      $scope.hideCourseDirectory = true;
      $scope.hideStudentAssignments = true;
      filterCourses();
    }
   // else if Staff creditentials entered into the text area and Lecturer Radio button, then this function takes place
    else if ($scope.userType == 'lecturer') {
      $scope.hideLogin = "true";
      $scope.loggedIn = true;
      $scope.hideStaffView = false;
      $scope.hideStaffCourses = false;
      $scope.hideStaffCourseDirectory = true;
      $scope.hideStaffAssignments = true;
      $scope.hideStaffAssignmentDirectory = true;
    } else {
      $scope.feedback = "Incorrect Credentials";
    }

    //navbar button presses to show student divs
    $scope.navBarStudentCourses = function() {
      $scope.hideStudentCourses = false;
      $scope.hideCourseDirectory = true;
      $scope.hideStudentAssignments = true;
    };

    $scope.navBarStudentCourseDirectory = function() {
      $scope.hideStudentCourses = true;
      $scope.hideCourseDirectory = false;
      $scope.hideStudentAssignments = true;
    };

    $scope.navBarStudentAssignments = function() {
      $scope.hideStudentCourses = true;
      $scope.hideCourseDirectory = true;
      $scope.hideStudentAssignments = false;
    };

    //navbar button presses to show staff divs
    $scope.navBarStaffCourses = function() {
      $scope.hideStaffCourses = false;
      $scope.hideStaffCourseDirectory = true;
      $scope.hideStaffAssignments = true;
      $scope.hideStaffAssignmentDirectory = true;
    };

    $scope.navBarStaffCourseDirectory = function() {
      $scope.hideStaffCourses = true;
      $scope.hideStaffCourseDirectory = false;
      $scope.hideStaffAssignments = true;
      $scope.hideStaffAssignmentDirectory = true;
      $scope.hideNewCourseShow = true;
    };
    
    $scope.newCourseShow = function () {
      $scope.hideStaffCourse = true;
      $scope.hideStaffDirectory = false;
      $scope.hideStaffAssignments = true;
      $scope.hideStaffAssignmentDirectory = true;
      $scope.hideNewCourseShow = false;
    };
    
    $scope.closeCreateCourse = function() {
      $scope.hideStaffCourse = true;
      $scope.hideStaffDirectory = false;
      $scope.hideStaffAssignments = true;
      $scope.hideStaffAssignmentDirectory = true;
      $scope.hideNewCourseShow = true;
    }



    $scope.navBarStaffAssignmentDirectory = function() {
      $scope.hideStaffCourses = true;
      $scope.hideStaffCourseDirectory = true;
      $scope.hideStaffAssignments = true;
      $scope.hideStaffAssignmentDirectory = false;
    };

    //function to run when log out button clicked
    $scope.logOut = function() {
      $scope.loggedIn = false;
      $scope.hideStudentView = true;
      $scope.hideStaffView = true;
      $scope.hideLogin = false;
    };
  };
 $scope.courses = []; //declare an empty array

 $http.get('https://caab.sim.vuw.ac.nz/api/handsszavi/course_directory.json')
    .then(function successCall(response) {
      $scope.courses = response.data.courses;
    }, function errorCall() {});
    
  //create a new course for lecturers, store the entered text as a new list variable
  $scope.createNewCourse = function() {

    var newCourse = {
      ID: $scope.newID,
      Name: $scope.newName,
      Year: $scope.newYear,
      Trimester: $scope.newTrimester,
      LectureTimes: $scope.newLectureTimes,
      Overview: $scope.newOverview,
    };
    
    $http.post("https://caab.sim.vuw.ac.nz/api/handsszavi/update.course_directory.json", newCourse)
    .success(function(newCourse){
      //if successfully posted, download the refreshed course directory
      $scope.courses = response.data.courses;
      window.alert("Course Successfully Updated");
    }, function errorCallback(){
       window.alert("Error Updating Course");
    })
    
    $http.get('https://caab.sim.vuw.ac.nz/api/handsszavi/course_directory.json')
    .then(function successCall(response) {
      $scope.courses = response.data.courses;
    }, function errorCall() {});
  };
  
  $scope.deleteCourse=function(idx){
   if(confirm("Are you sure you want to delete this course?"))
   $scope.courseDirectory.splice(idx,1);
 };
  
// Below is code for the edit course section 
    $scope.hideCourseEdit = true; 
  
  $scope.modifyCourse = function(){
    
    $scope.hideCourseEdit = false;
  };
  $scope.closeCourseEdit = function(){
    
    $scope.hideCourseEdit = true;
    
  };
      $scope.eidtass=function(){
      var modifycourse = {
        ID:$scope.modifyID,
        Name:$scope.modifyName,
        Overview:$scope.modifyOverview,
        Year:$scope.modifyYear,
        Trimester:$scope.modifyTrimester,
        LectureTimes:$scope.modifyLectureTimes,
        LecturerID:$scope.modifyLectureID,
      };
      $scope.coursedatabase = [];
      $http.post("https://caab.sim.vuw.ac.nz/api/handsszavi/update.course_directory.json", JSON.stringify(modifycourse))
        .success(function(response){
      
      $scope.target = "https://caab.sim.vuw.ac.nz/api/handsszavi/course_directory.json";    
      $scope.promise = $http.get($scope.target)
      .then(function successCall(response){
        
          $scope.Coursedatabase = response.data.courses;
          
      },function errorCall(response){
        
        $scope.feedback = "Error";
      });
      
       window.alert("Posted courses successfully");
     },function errorCallback(){
       window.alert("Failed to post course");        

 });

};
 

});