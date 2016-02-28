/**
 * Created by akabeera on 2/18/2016.
 */
/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../data/gifs-data-model.ts" />
/// <reference path="../data/gifs-sections-data-model.ts" />
/// <reference path="../services/gif-data.ts" />

module app.Controllers {

    export interface ILhpController {
        gifSections:app.Models.ISectionsList;
        gifData:Array<app.Models.ISection>;

    }
    export class LhpController implements ILhpController {

        public gifSections:app.Models.ISectionsList;
        public gifData:Array<app.Models.ISection>;

        constructor( private $log:ng.ILogService,
                     private $state:ng.ui.IStateService,
                     private gifDataService:app.Services.IGifDataService,
                     private gifSectionsService:app.Services.IGifSectionsService) {
            this.Init();
        }

        public SelectSection(s:string):void {
            this.gifData.forEach( section => {
                if (section.id.toLowerCase() === s.toLowerCase()) {
                    this.$state.go('home.main.section', {
                        section:s
                    });

                    return;
                }
            });
        }

        private Init() {
            this.$log.info('LHP Controller');
            this.gifSectionsService.GetData().then( (data) => {
                this.gifSections = data.data;
            });

            this.gifDataService.GetData().then( (data) => {
                this.gifData = data.data;
            });
        }
    }

    angular.module('reactionGifs').controller( 'lhpController',
        ['$log', '$state', 'GifDataService', 'GifSectionsService', app.Controllers.LhpController] );
}
