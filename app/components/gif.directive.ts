/**
 * Created by akabeera on 2/27/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Directives {
    'use strict';
    export class GifDirective implements ng.IDirective {
        public templateUrl:string = 'components/gif.html';
        public restrict:string = 'E';
        public controller:string = 'gifController';
        public controllerAs:string = 'gifCtrl';
        public scope = {};

        constructor(private $log:ng.ILogService) {
            this.$log.info('gif directive');
        }

        public static Factory() {
            return (log:ng.ILogService) => {
                return new GifDirective(log);
            };
        }
    }

    angular.module('reactionGifs').directive('gif', ['$log', app.Directives.GifDirective.Factory()]);
}
