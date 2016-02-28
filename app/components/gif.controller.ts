/**
 * Created by akabeera on 2/27/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Controllers {
    export class GifController {

        public currentGif:string;

        constructor( private $log:ng.ILogService,
                     private $state:ng.ui.IStateService) {
            this.Init();
        }

        public MakeUrl():string
        {
            return 'https://i.imgur.com/' + this.currentGif + '.gif'
        }

        private Init() {
            this.$log.info('Gif Controller');
            this.currentGif = this.$state.params.gifId;
        }
    }

    angular.module('reactionGifs').controller( 'gifController', ['$log', '$state', app.Controllers.GifController] );
}
