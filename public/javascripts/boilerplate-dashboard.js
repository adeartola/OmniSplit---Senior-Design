var omnisplitApp = angular.module('omnisplitApp', ['ngRoute']);

var opts = {
    lines: 11, // The number of lines to draw
    length: 0, // The length of each line
    width: 10, // The line thickness
    radius: 20, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 48, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};

omnisplitApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'dashboard/dashboard',
            controller: 'dashboardController'
        })
        .when('/tables', {
            templateUrl : 'dashboard/tables',
            controller: 'tablesController'
        })
        .when('/orders', {
            templateUrl : 'dashboard/orders',
            controller: 'ordersController'
        })
        .when('/dashboard', {
            templateUrl : 'dashboard/dashboard',
            controller: 'dashboardController'
        })
        .when('/menu', {
            templateUrl : 'dashboard/menu',
            controller: 'menuController',
        })
        .when('/settings', {
            templateUrl : 'dashboard/settings',
            controller: 'settingsController'
        });
});

omnisplitApp.controller('tabController', function($scope) {
    this.tab = 3;
    this.setTab = function(tabId) {
        this.tab = tabId;
    };
    this.isSet = function(tabId) {
        return this.tab === tabId;
    };
});

omnisplitApp.controller('tablesController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');
});
omnisplitApp.controller('ordersController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');
});
omnisplitApp.controller('dashboardController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');
});
omnisplitApp.controller('menuController', function($scope, $window) {
	var w = angular.element($window);
    w.unbind('resize');

    $scope.items = [];

    $scope.clickItem = function(id) {
        var thisItem = angular.element("#item-" + id);
	    for (x in $scope.items) {
            $("#item-" + x + " p").css("color","black");
            $("#item-" + x).removeClass("activeCat1");
        }

	    $("#item-" + id + " p").css("color", "yellow");
	    thisItem.addClass("activeCat1");
	    $("#activeCat").html($(".activeCat1").html());
	    $("#activeCat p").css("color","black");
    };

	$scope.$on('$viewContentLoaded', function() {
		var spinner;
		$.ajax({
			type: 'POST',
			url: 'api/menuinfo',
			beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
			complete: function() {
				spinner.stop();
			},
			success: function(data) {
				for (x in data.group){
                    $scope.items.push({
                        "id": x,
                        "name": data.group[x].name,
                        "description": data.group[x].description,
                        "items": data.group[x].items
                    });
				}
                $scope.$apply();
			}
		});
	});
});

omnisplitApp.controller('settingsController', function($scope, $window) {
    var w = angular.element($window);
    w.unbind('resize');

    $scope.oldAddress = {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: ''
    };
    $scope.oldName = '';

    $scope.oldDescription = '';

    $scope.$on('$viewContentLoaded', function() {
        var spinner;
        $.ajax({
            type: 'POST',
            url: '/api/userinfo',
            beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            complete: function() {
                spinner.stop();
            },
            success: function(data) {
				alert(data.menu);
                $scope.name = angular.copy(data.name);
                $scope.address = angular.copy(data.address);
                $scope.description = angular.copy(data.description);
                $scope.oldName = angular.copy(data.name);
                $scope.oldAddress = angular.copy(data.address);
                $scope.oldDescription = angular.copy(data.description);
                $scope.$apply();
            }
        });
    });

    $scope.resetAddress = function() {
        $scope.address = angular.copy($scope.oldAddress);
    };

    $scope.resetName = function() {
        $scope.name = angular.copy($scope.oldName);
        $scope.description = angular.copy($scope.oldDescription);
    };

    $scope.submitName = function() {
        var spinner;
        $.ajax({
            type: 'POST',
            url: '/api/changeinfo',
            data: { name: $scope.name, description: $scope.description },
            beforeSend: function(xhrObj) {
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            complete: function() {
                spinner.stop();
            },
            success: function(data) {
                $scope.oldName = $scope.name;
                $scope.oldDescription = $scope.description;
            }
        });
    };

    $scope.submitAddress = function() {
        var spinner;
        $.ajax({
            type: 'POST',
            url: '/api/changeaddress',
            data: { address: JSON.stringify($scope.address) },
            beforeSend: function(xhrObj) {
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            error: function(xhr, status, error) {
                console.log(error);
            },
            complete: function() {
                spinner.stop();
            },
            success: function(data) {
                $scope.oldAddress = $scope.address;
            }
        });
    };
});

omnisplitApp.controller('phone', function($scope, $window) {
    var w = angular.element($window);
    w.bind('resize', function() {
        var phone = {
            top: $('#phone').position().top,
            left: $('#phone').position().left,
            height: $('#phone').height(),
            width: $('#phone').width(),
            paddingTop: parseFloat($('#phone').css('padding-top')),
            paddingLeft: parseFloat($('#phone-column').css('padding-left'))
        };

        $('#overlay').width(parseFloat(0.849 * phone.width) + 'px');
        $('#overlay').height(parseFloat(0.725 * phone.height) + 'px');
        $('#overlay').css('top', phone.top + phone.paddingTop + parseFloat(0.147 * phone.height));
        $('#overlay').css('left', $('#phone-column').width() / 2 - phone.width / 2 + parseFloat(0.0731 * phone.width) + phone.paddingLeft + 'px');
    });
});

omnisplitApp.directive('phoneLoaded', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var phone = {
                    top: $('#phone').position().top,
                    left: $('#phone').position().left,
                    height: $('#phone').height(),
                    width: $('#phone').width(),
                    paddingTop: parseFloat($('#phone').css('padding-top')),
                    paddingLeft: parseFloat($('#phone-column').css('padding-left'))
                };

                $('#overlay').width(parseFloat(0.849 * phone.width) + 'px');
                $('#overlay').height(parseFloat(0.725 * phone.height) + 'px');
                $('#overlay').css('top', phone.top + phone.paddingTop + parseFloat(0.147 * phone.height));
                $('#overlay').css('left', $('#phone-column').width() / 2 - phone.width / 2 + parseFloat(0.0731 * phone.width) + phone.paddingLeft + 'px');
            });
        }
    };
});

$(function() {
    $('#logout').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            type: 'POST',
            url: '/api/logout/',
            error: function(xhr, status, error) {
                console.log(error);
            },
            success: function() {
                window.location.href = '/login';
            }
        });
    });
});
