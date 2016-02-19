/// <reference path="../typings/browser.d.ts" />

module reactionGifs {
    class MyConfig {
        constructor( private $stateProvider:ng.ui.IStateProvider,
                     private $urlRouterProvider:angular.ui.IUrlRouterProvider ) {
            this.init();
        }

        private init():void {
            this.$stateProvider.state( 'home',
                {
                    abstract:true,
                    template: '<main></main>',
                    url: '/'
                }).state('home.main',
                {
                    views: {
                        'lhp@home': { template: '<lhp></lhp>' },
                        'rhs@home': { template: '<rhs></rhs>' }
                    },
                    url: '/main',
                });

            this.$urlRouterProvider.otherwise('/main');
        }
    }

    let myApp = angular.module( 'reactionGifs', ['ui.router'] );
    myApp.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
        return new MyConfig($stateProvider, $urlRouterProvider);
    }]);
}
