/**
 * Created by kimsungwoo on 2015. 12. 2..
 */

angular.module('cookers.services')
    .factory('socket',[
        'socketFactory',
        function(socketFactory) {
            var myIoSocket = io.connect('http://' + '133.130.102.228' + ':' + '3100');

            mySocket = socketFactory({
                ioSocket: myIoSocket
            });

            console.log('socket');

            return mySocket;

        }])

    .factory('badgeService',['socket',
        function(socket){

            var badge = {};

            badge.somenotiPush = function(touserid){
                socket.emit('notipush', touserid);
            };

            return badge;

        }]);