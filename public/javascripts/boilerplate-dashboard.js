var omnisplitApp = angular.module('omnisplitApp', ['ngRoute']);

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

omnisplitApp.controller('tablesController', function($scope) {
});
omnisplitApp.controller('ordersController', function($scope) {
});
omnisplitApp.controller('dashboardController', function($scope) {
});
omnisplitApp.controller('menuController', function($scope, $timeout) {
});
omnisplitApp.controller('settingsController', function($scope) {
});

omnisplitApp.controller('leftPhone', function($scope, $window) {
    var w = angular.element($window);
    w.bind('resize', function() {
        $scope.phone = {
            top: $('#phone-left').position().top,
            left: $('#phone-left').position().left,
            height: $('#phone-left').height(),
            width: $('#phone-left').width(),
            paddingTop: parseFloat($('#phone-left').css('padding-top'))
        };

        $('#overlay-left').width(parseFloat(0.849 * $scope.phone.width) + 'px');
        $('#overlay-left').height(parseFloat(0.725 * $scope.phone.height) + 'px');
        $('#overlay-left').css('top', $scope.phone.top + $scope.phone.paddingTop + parseFloat(0.147 * $scope.phone.height) + 'px');
        $('#overlay-left').css('left', $scope.phone.left + parseFloat(0.0731 * $scope.phone.width) + 'px');
    });
});

omnisplitApp.controller('rightPhone', function($scope, $window) {
    var w = angular.element($window);
    w.bind('resize', function() {
        $scope.phone = {
            top: $('#phone-left').position().top,
            left: $('#phone-left').position().left,
            height: $('#phone-left').height(),
            width: $('#phone-left').width(),
            paddingTop: parseFloat($('#phone-left').css('padding-top'))
        };

        $('#overlay-right').width(parseFloat(0.849 * $scope.phone.width) + 'px');
        $('#overlay-right').height(parseFloat(0.725 * $scope.phone.height) + 'px');
        $('#overlay-right').css('top', $scope.phone.top + $scope.phone.paddingTop + parseFloat(0.147 * $scope.phone.height) + 'px');
        $('#overlay-right').css('left', $scope.phone.left + parseFloat(0.0731 * $scope.phone.width) + 'px');
    });
});

omnisplitApp.directive('leftPhoneLoaded', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var phone = {
                    top: $('#phone-left').position().top,
                    left: $('#phone-left').position().left,
                    height: $('#phone-left').height(),
                    width: $('#phone-left').width(),
                    paddingTop: parseFloat($('#phone-left').css('padding-top'))
                };

                $('#overlay-left').width(parseFloat(0.849 * phone.width) + 'px');
                $('#overlay-left').height(parseFloat(0.725 * phone.height) + 'px');
                $('#overlay-left').css('top', phone.top + phone.paddingTop + parseFloat(0.147 * phone.height));
                $('#overlay-left').css('left', phone.left + parseFloat(0.0731 * phone.width));
            });
        }
    };
});

omnisplitApp.directive('rightPhoneLoaded', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var phone = {
                    top: $('#phone-left').position().top,
                    left: $('#phone-left').position().left,
                    height: $('#phone-left').height(),
                    width: $('#phone-left').width(),
                    paddingTop: parseFloat($('#phone-left').css('padding-top'))
                };

                $('#overlay-right').width(parseFloat(0.849 * phone.width) + 'px');
                $('#overlay-right').height(parseFloat(0.725 * phone.height) + 'px');
                $('#overlay-right').css('top', phone.top + phone.paddingTop + parseFloat(0.147 * phone.height));
                $('#overlay-right').css('left', phone.left + parseFloat(0.0731 * phone.width));
            });
        }
    };
});

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

$(function() {
    $('#logout').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            beforeSend: function(xhrObj){
                $('body').append($('div#spinner'));
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
            type: 'POST',
            url: '/api/logout/',
            error: function(err) {
                console.log(err.responseText);
            },
            success: function() {
                window.location.href = '/login';
            }
        });
    });
});
