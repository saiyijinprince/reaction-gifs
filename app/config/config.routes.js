/**
 * Created by akabeera on 2/18/2016.
 */
(function () {
    'use strict';

    function configRoutes( $stateProvider, $urlRouterProvider ) {
        $urlRouterProvider.otherwise( function( ) {
           return '/main';
        });

        $stateProvider.state( 'home',
            {
                abstract:false,
                template: '<main></main>',
                url: '/'
            }).state('home.main',
            {
                views: {
                    lhp: { template: '<lhp></lhp>' },
                    rhs: { template: '<rhs></rhs>' }
                },
                url: '/main',
            });
    }

    angular.module( 'reactionGifs').config( configRoutes );
})();