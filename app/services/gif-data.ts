/**
 * Created by akabeera on 2/27/2016.
 */
module app.Services {
    export interface IGifDataService {
        GetData():ng.IHttpPromise<Array<app.Models.ISection>>;
    }

    export class GifDataService implements IGifDataService {
        constructor(private $http:ng.IHttpService) {

        }
        public GetData() {
            return this.$http.get('/gifs');
        }
    }

    angular.module( 'reactionGifs' ).service( 'GifDataService', ['$http', app.Services.GifDataService]);
}
