angular.module('pokeSearch', ['ui.materialize','ui.router'])
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
        .state('app',{
            url: '/',
            views :{
                'content':{
                    templateUrl: 'views/search.html'
                }
            }
        });
        $urlRouterProvider.otherwise('/');
    });
