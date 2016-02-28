/**
 * Created by akabeera on 2/27/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Directives {
    'use strict';
    export class GifViewerDirective implements  ng.IDirective {
        public templateUrl:string = 'components/gif-viewer.html';
        public restrict:string = 'E';
        public controller:string = 'gifViewerController';
        public controllerAs:string = 'gifCtrl';
        public scope = {};

        constructor(private $log:ng.ILogService) {
            this.$log.info('gif viewer directive');
        }

        public static Factory() {
            return (log:ng.ILogService) => {
                return new GifViewerDirective(log);
            };
        }
    }

    angular.module('reactionGifs').directive('gif-viewer', ['$log', app.Directives.GifViewerDirective.Factory()]);
}
