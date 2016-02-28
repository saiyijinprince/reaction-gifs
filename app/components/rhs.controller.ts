/**
 * Created by akabeera on 2/18/2016.
 */
/// <reference path="../../typings/browser.d.ts" />

module app.Controllers {
    export class RhsController {

        public gifData:app.Models.ISection;
        public currentSection:string;
        public columnBreak = 8;

        constructor( private $log:ng.ILogService,
                     private $state:ng.ui.IStateService,
                     private gifDataService:app.Services.IGifDataService) {
            this.Init();
        }

        public MakeUrl(g:string):string {
            return 'http://i.imgur.com/' + g + '.gif';
        }

        public StartNewRow(index:number, count:number):boolean {
            return ((index) % count) === 0;
        };

        public SelectGif(g:string):void {
            this.$state.go( 'home.main.section.gif', {
               gifId:g
            });
        }

        private Init() {
            this.$log.info('RHS Controller');

            if (this.$state.params.hasOwnProperty('section')) {
                this.currentSection = this.$state.params.section;

                this.gifDataService.GetData().then( (data) => {
                    let gifs:Array<app.Models.ISection> = data.data;
                    gifs.forEach( g => {
                      if (g.id.toLocaleLowerCase() === this.currentSection.toLowerCase()) {
                          this.gifData = g;
                      }
                    });
                });
            }
        }
    }
    angular.module('reactionGifs').filter( 'array', function() {
       return function(arrayLength) {
           arrayLength = Math.ceil(arrayLength);
           let arr:Array<any> = new Array(arrayLength);
           let i = 0;
           for (; i < arrayLength; i++) {
                arr[i] = i;
           }

           return arr;
       };
    });
    angular.module('reactionGifs').controller( 'rhsController', ['$log', '$state', 'GifDataService', app.Controllers.RhsController] );
}
