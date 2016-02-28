/**
 * Created by akabeera on 2/27/2016.
 */
module app.Services {
    export interface IGifSectionsService {
        GetData():ng.IHttpPromise<app.Models.ISectionsList>;
    }

    export class GifSectionsService implements IGifDataService {
        constructor( private $http:ng.IHttpService) {

        }
        public GetData() {
            return this.$http.get('/cats');
        }
    }

    angular.module( 'reactionGifs' ).service( 'GifSectionsService', ['$http', app.Services.GifSectionsService]);
}
