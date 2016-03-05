/**
 * Created by akabeera on 2/18/2016.
 */
/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../data/gifs-data-model.ts" />
/// <reference path="../services/gif-data.ts" />

module app.Controllers {

    export interface ILhpController {
        gifSections:Array<string>;
        gifData:Array<app.Models.ISection>;

    }
    export class LhpController implements ILhpController {

        public gifSections:Array<string>;
        public gifData:Array<app.Models.ISection>;
        private currentSection:string;

        constructor( private $log:ng.ILogService,
                     private $state:ng.ui.IStateService,
                     private gifDataService:app.Services.IGifDataService) {
            this.Init();
        }

        public SelectSection(s:string):void {
            this.gifData.forEach( section => {
                if (section.id.toLowerCase() === s.toLowerCase()) {
                    this.currentSection = s;
                    this.$state.go('home.main.section', {
                        section:s
                    });

                    return;
                }
            });
        }

        public setBackgroundColor(s:string):boolean {
            if (s === this.currentSection) {
                return true;
            }

            return false;
        }

        private Init() {
            this.$log.info('LHP Controller');
            this.gifSections = new Array<string>();
            this.gifDataService.GetData().then( (data) => {
                this.gifData = data.data;
                this.gifData.forEach( g => {
                    this.gifSections.push( g.id.toUpperCase() );
                });
            });
        }
    }

    angular.module('reactionGifs').controller( 'lhpController',
        ['$log', '$state', 'GifDataService', app.Controllers.LhpController] );
}
