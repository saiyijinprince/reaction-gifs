/**
 * Created by akabeera on 2/27/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Controllers {
    export class GifViewerController {

        public currentGif:string;

        constructor( private $log:ng.ILogService,
                     private $state:ng.ui.IStateService) {
            this.Init();
        }

        private Init() {
            this.$log.info('GifViewer Controller');
            this.currentGif = this.$state.gifId;
        }
    }

    angular.module('reactionGifs').controller( 'gifViewerController', ['$log', '$state', GifViewerController] );
}
