
var loginFrm = $('#login-frm').validate();
function LoginController($scope,$http){
    
    $scope.me = me;
    if($scope.me != undefined){
        if($scope.me.platform != null){
            $scope.me.informationUrl = '';
            if(($scope.me.platform == 'PF')){
                $scope.me.informationUrl = '/user/'+$scope.me.id+'/show_information';
            }
        }
    }
    var common = new Common();
    $scope.us = '';
    $scope.ps = '';
    $scope.re = '';
    $scope.cp =  common.getParameterByName('cp') != undefined || common.getParameterByName('cp') != null ?
                 common.getParameterByName('cp') : window.location;
    $scope.action = common.getParameterByName('action') != undefined || common.getParameterByName('action') != null ?
                    common.getParameterByName('action') : "";
    if($scope.action != "" && $scope.me != undefined){
    	if($scope.me.platform != null){
    		switch($scope.action){
	    		case 'ho-so-rang-mieng' : 
	    			window.location = "/profile/"+$scope.me.id+"/ho-so-rang-mieng";
	    		break;
	    		default :
	    			window.location = "/profile/"+$scope.me.id+"/tuoi-moc-rang";
	    		break;
    		}
    	}
    }
    $scope.loginedResult = false;
    $scope.error = false;
    $scope.Login = function(){
    	$("#overlap").show();
        $http.post('/api/login/pf',
                $.param({data:{us:$scope.us, pw:$scope.ps, re:$scope.re}}),
                {headers:{"If-Modified-Since":"Thu,01 Jun 1970 00:00:00 GMT",'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
        ).success(function(data){
        	$("#overlap").hide();
        	if(data == "false" || data == false){
        		$scope.loginedResult = false;
        		$scope.error = true;
        		return;
        	}
        	
            var target = $scope.action != "" ? $scope.action : $scope.cp;
            if(target == $scope.cp){
                window.location = $scope.cp;
            }else{
            	switch($scope.action){
            		case 'ho-so-rang-mieng' : 
            			window.location = "/profile/"+data.id+"/ho-so-rang-mieng";
            		break;
            		default :
            			window.location = "/profile/"+data.id+"/tuoi-moc-rang";
            		break;
            	}
            }
        }).error(function(xhr, status, error){
            
        });
    };
    
    $scope.loginFacebook = function(){
        FB.login(function(response) {
            if (response.authResponse) {
              console.log('Welcome!  Fetching your information.... ');
              FB.api('/me', $scope.loggedinFacebook,{fields: "id,birthday,email,name,picture,gender"});
            } else {
              console.log('User cancelled login or did not fully authorize.');
            }
        },{scope: 'email,user_likes,public_profile,user_birthday,user_likes,user_photos,user_about_me'});
    };
    
    $scope.loggedinFacebook = function(response){
        $http.post('/api/login/facebook',
                $.param({data:JSON.stringify(response),re:$scope.re}),
                {headers:{"If-Modified-Since":"Thu,01 Jun 1970 00:00:00 GMT",'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}}
        ).success(function(data){
        	if(data == "false"){
        		$scope.loginedResult = false;
        		return;
        	}
        	
            var target = $scope.action != "" ? $scope.action : $scope.cp;
            if(target == $scope.cp){
                window.location = $scope.cp;
            }else{
            	switch($scope.action){
            		case 'ho-so-rang-mieng' : 
            			window.location = "/profile/"+data.id+"/ho-so-rang-mieng";
            		break;
            		default :
            			window.location = "/profile/"+data.id+"/tuoi-moc-rang";
            		break;
            	}
            }
        }).error(function(xhr, status, error){
            
        });
    };
    
    $scope.loginTwitter = function(){
        window.location = "/twitter/auth?page="+encodeURIComponent(window.location);
    };
    $scope.loginGoogle = function(){
        window.location = "/google/auth?page="+encodeURIComponent(window.location);
    };
    $scope.loginZing = function(){
        window.location = "/zing/auth?page="+encodeURIComponent(window.location);
    };
    
    
}
LoginController.$inject = ['$scope','$http'];