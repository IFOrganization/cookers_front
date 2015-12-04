angular.module('cookers.services')
    .factory('cameraService', ['$q', function($q) {
        var options={
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType : undefined,
            allowEdit: undefined,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1200,
            targetHeight: 900,
            popoverOptions: CameraPopoverOptions,
            correctOrientation : true,                  // img rotate auto_setting
            saveToPhotoAlbum: true
        };

        return {

            getPicture: function() {
                if(ionic.Platform.isAndroid()){
                    options.allowEdit = false;
                }else{
                    options.allowEdit = true;
                }


                if(options.sourceType ===undefined){
                    alert("camera option이 제대로 설정되지 않았습니다.");
                    return;
                }
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            optionSetting : function(sourceType){
                if(sourceType === 1){
                    options.sourceType = Camera.PictureSourceType.CAMERA;
                }else{
                    options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                }
            }
        }
    }]);
