app.controller('indexCtrl', function ($scope) {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var centroX = canvas.width / 2;
    var centroY = canvas.height / 2;
    var radius = Math.floor(canvas.width / 3);
    //Desenho do circulo

    ctx.beginPath();
    //ctx.fillStyle = "#045304";
    ctx.fillStyle = "#4c9b4c";

    ctx.arc(centroX, centroY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();


    //Desenho das linhas
    var begin = 0;
    intervalo = 90;
    var arcSize = degreesToRadians(intervalo);
    for (var i = begin; i < 360;) {
        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, radius, degreesToRadians(i), i + arcSize, false);
        ctx.closePath();
        ctx.stroke();

        i = i + intervalo;
    }

    function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

});