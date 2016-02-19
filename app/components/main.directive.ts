/**
 * Created by akabeera on 2/18/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Directives {
    'use strict';
    export class MainDirective implements ng.IDirective {
        public templateUrl:string = 'components/main.html';
        public restrict:string = 'E';
        public controller:string = 'mainController';
        public scope = {};

        constructor(private $log:ng.ILogService) {
            this.$log.info('main directive');
        }

        public static Factory() {
            return (log:ng.ILogService) => {
                return new MainDirective(log);
            };
        }
    }

    angular.module('reactionGifs').directive('main', ['$log', app.Directives.MainDirective.Factory()]);
}
