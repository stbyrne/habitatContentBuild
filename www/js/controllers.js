angular.module('starter.controllers', [])

.factory('buildFactory', function(url, $http) {
    
    return $.ajax({
        
        /*url: "https://habitat.inkling.com/api/contentbuilds/?access_token=0f75124f0c9e5384a7fb675e648dff75&shortname=sn_b2c2&keepEmailOptions=true",*/
        /*url: "https://habitat.inkling.com/api/contentbuilds/?access_token=0f75124f0c9e5384a7fb675e648dff75&shortname=sn_1469&keepEmailOptions=true",*/
        url: url,
        dataType: 'json',
        /*cache: false,*/
        timeout: 10000,
        success: function(data) {
            return data;
        }   
    });
})

.controller('ProjectCtrl', function($scope, $ionicModal, $http, $timeout, $ionicLoading, $ionicPopover, $state) {
    
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the fetch modal
  $scope.projectData = {};
  $scope.projectData.name = '';

  // Create the fetch modal that we will use later
  $ionicModal.fromTemplateUrl('templates/fetch.html', {
    scope: $scope
  }).then(function(fetchmodal) {
    $scope.fetchmodal = fetchmodal;
  });

  // Triggered in the fetch modal to close it
  $scope.closeProjectFetch = function() {
      $scope.fetchmodal.hide();
      $scope.buildmodal.hide();
      $scope.projectData.name = '';
      console.log('Closing modal');
  };

  // Open the fetch modal
  $scope.fetch = function() {
      $scope.fetchmodal.show();
      console.log('Opening modal');
  };
    

  // Perform the action when the user submits the fetch form
  $scope.getProject = function() {
      
      $ionicLoading.show({
    template: '<p>Getting Habitat Projects</p><ion-spinner icon="spiral" class="spiral-hmhorange"></ion-spinner>',
    showBackdrop: true
    });
      
    var projectName = $scope.projectData.name,
        accessToken = '?access_token=p-970d21fbdd8540e99bd7b23ffb9e0af1',
        s9ID = '082df23d7c79961406ba9ce12ce2d448806',
        accessToken = '?access_token=0f710cade9cc5e747f59de22d2be5351';
        /*url = Api.getData() + "?access_token=" + accessToken + "&shortname=" + projectName + "&keepEmailOptions=true";*/
      
    $http({
            url: 'https://habitat.inkling.com/api/contentbuilds/' + accessToken + '&shortname=' + projectName,
            method: 'GET',
            headers: {
                    responseType: 'arraybuffer'   
            }
         
          }).then(function(data){
        
        console.log(data.data);
        $scope.results = data.data.result;
        
        $ionicLoading.hide();
        
        $timeout(function() {
        $scope.closeProjectFetch();
        }, 500);
        
        console.log($scope.projectData.name);
        
        $scope.projectDetails = [];
        
        angular.forEach($scope.results, function(project){

                    /*var key = value['id'];*/
                    var shortname = project.shortname,
                        revision = project.revision,
                        initiator = project.initiator,
                        created = project.createdAt,
                        date = new Date(created),
                        dateCreated = date.toUTCString().slice(0, -4),
                        URL = project.downloadLink;
            
                      
            this.push({shortname: shortname, revision: revision, initiator:initiator, dateCreated:dateCreated, URL:URL})

                    /*this[key] = value['content'];*/

                }, $scope.projectDetails);
        
        console.log($scope.projectDetails);
        
        
    }, function(data){
        
        console.log("Error, please check the project name");
        $ionicLoading.hide();
        $scope.openPopover();
    });
      
      //Set and Get index number to pass to view
      
      $scope.setIndex = function(number){
           $scope.indexNumber = number;
          console.log($scope.indexNumber);
      }
      
      $scope.getIndex = function(){
          console.log("Current Index: " + $scope.indexNumber);
           return $scope.indexNumber;
      }
      
     

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    
  };
    
  // Form data for the build modal
  $scope.projectBuild = {};
  $scope.projectData.name = '';

  // Create the build modal that we will use later
  $ionicModal.fromTemplateUrl('templates/build.html', {
    scope: $scope
  }).then(function(buildmodal) {
    $scope.buildmodal = buildmodal;
  });

  // Triggered in the build modal to close it
  $scope.closeProjectBuild = function() {
      $scope.buildmodal.hide();
      $scope.projectBuild.name = '';
  };

  // Open the build modal
  $scope.build = function() {
    $scope.buildmodal.show();
  };
    
    //Build a new project
    
    $scope.buildProject = function() {
        
        $ionicLoading.show({
            template: '<p>Building new Habitat Project</p><ion-spinner icon="lines" class="lines-hmhorange"></ion-spinner>',
            showBackdrop: true
        });
        
        console.log('Trying to Build');
        
        var projectBuildName = $scope.projectData.name,
            url = 'https://partner.inkling.com/contentbuilds',
            accessToken = '?access_token=p-970d21fbdd8540e99bd7b23ffb9e0af1',            
            /*parameter = JSON.stringify({shortname:projectBuildName,type:'epub'});*/
            parameter = {shortname:projectBuildName,type:'epub'};
        
        $http({
            url: url + accessToken,
            method: "POST",
            data: parameter,
            headers: {'Content-Type': 'application/json'}
        }).then(function(data){
            
            console.log(data);
            $scope.getProject();
            $scope.doRefresh();
            $ionicLoading.hide();
            
        }, function(data){
            
            $ionicLoading.hide();
            $scope.openPopover();
        })
        
        /*$.ajax({
            url: url + accessToken,
            type: "POST",
            data: JSON.stringify(parameter),
            headers: {'Content-Type': 'application/json'},
            success: function(data){
                $ionicLoading.hide();
                console.log(data);
            },
            error: function(data, status, config){
                $ionicLoading.hide();
                
            }
        });*/
        
    }
    
    //Popover validation for invalid/Un-entitled Habitat projects
    
      var template = '<ion-popover-view style="height:60px;"><ion-content><p style="height:60px;margin:5px 10px;">Hmm are you sure the Habitat Project Name is correct?</p></div></ion-content></ion-popover-view>';

      $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope,
      });

      // .fromTemplateUrl() method
      $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function() {
        $scope.popover.show(".project");
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
        
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function() {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        // Execute action
      });
    
    $scope.doRefresh = function(){
            $state.go($state.current, {}, {reload: true});
            
        }
    
})

.controller('DownloadCtrl', function($scope, $http, $ionicLoading) {
    
    $scope.download = function(file, revision){
        
        $ionicLoading.show({
            template: '<p>Downloading ePub as zip</p><ion-spinner icon="dots" class="dots-hmhorange"></ion-spinner>',
            showBackdrop: true
        });
        
        $http({
            url: file,
            method: "GET",
            responseType: "arraybuffer"
        
        }).then(function(data){

            //Do Something with successful call
            $ionicLoading.hide();
            console.log(data);
            var blob = new Blob([data.data], { type: 'application/epub+zip' }),
                filename = 'r' + revision + '.zip';
            
            saveAs(blob, filename);
            
            /*var flow = new Flow({
                target:'./temp'
            });
            flow.addFile(blob);
            
            console.log(flow);*/
            
            /*flow.upload();*/
            
            // Try to save zip to directory
            
            /*$ionicLoading.show({
            template: '<p>Sending zip to temp folder</p><ion-spinner icon="ripple" class="ripple-hmhorange"></ion-spinner>',
            showBackdrop: true
            });
            
            var file = data.data;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = "/temp";
            fileUpload.uploadFileToUrl(file, uploadUrl);
            $ionicLoading.hide();*/
            
            /*$scope.doUpload = function () {*/
                /*upload*/
            /*$http({
                url: '#',
                method: 'POST',
                data: blob,
                headers:{
                'Content-Type': 'application/epub+zip'
                }
            }).then( function (response) {
                
                saveAs(blob, 'test.zip');
                $ionicLoading.hide();
                
                }, function (response) {
                
                $ionicLoading.hide();
                
                });*/
            /*}*/
            
            /*$http({
            url: '../Downloads/test.zip',
            method: "GET",
            responseType: "arraybuffer"
        
            }).then(function(data){
                
                console.log(data);
                
            }, function(data){
                
                console.log('Error getting zip file: ' + data);
                   
            });*/
            
            /*var myZip = '../Downloads/test.zip'; // Get it with an XHR request, HTML5 files, etc.
            var unzipper = new JSUnzip(myZip);
            console.log(unzipper);
            unzipper.isZipFile();      // true or false

            unzipper.readEntries();    // Creates "entries"
            unzipper.entries;          // Array of JSUnzip.ZipEntry objects.*/

        }, function(data){

            //Do Something if call
            console.log('Error');

        });
    }
    
});
 