/**
 * Created by akabeera on 2/18/2016.
 */
// <reference path="../../typings/browser.d.ts" />

module app.Controllers {
    export class MainController {
        constructor( private $log:ng.ILogService ) {
            this.Init();
        }

        private Init() {
            this.$log.info('Main Controller');
        }

    }

    angular.module('reactionGifs').controller( 'mainController', ['$log', MainController] );
}
