/**
 * Created by akabeera on 2/18/2016.
 */
// <reference path="../../typings/browser.d.ts" />

module app.Controllers {
    export class RhsController {
        constructor( private $log:ng.ILogService ) {
            this.Init();
        }

        private Init() {
            this.$log.info('RHS Controller');
        }
    }

    angular.module('reactionGifs').controller( 'rhsController', ['$log', RhsController] );
}
