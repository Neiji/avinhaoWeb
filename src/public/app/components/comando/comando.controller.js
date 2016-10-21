app.controller('comandoCtrl', function ($scope) {
    $scope.onSelectRadio = function (coordenadas) {
        if (coordenadas === 'cartesiana') {
            document.getElementById('raio').disabled = true;
            document.getElementById('angulo').disabled = true;

            this.avinhao.raio = "";
            this.avinhao.angulo = "";

            document.getElementById('x').disabled = false;
            document.getElementById('y').disabled = false;

        } else if (coordenadas === 'polar') {

            document.getElementById('x').disabled = true;
            document.getElementById('y').disabled = true;

            this.avinhao.x = "";
            this.avinhao.y = "";

            document.getElementById('raio').disabled = false;
            document.getElementById('angulo').disabled = false;

        }
    }

    $scope.onAdicionaAvinhao = function () {
        if (this.avinhao) {
            if (this.avinhao.x && this.avinhao.y) {
                this.setAvinhaoMapa(this.avinhao.x, this.avinhao.y);
            }
        }
    }

    $scope.setAvinhaoMapa = function (x, y) {
        if (Number(y) < 0) {
            y = Math.abs(Number(y));
        } else {
            y = -Math.abs(Number(y));
        }

        //Medidas padrões do canvas
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var centroCanvasX = canvas.width / 2;
        var centroCanvasY = canvas.height / 2;
        var radius = Math.floor(canvas.width / 3);

        var ajusteX = Math.floor(centroCanvasX + Number(x));
        var ajusteY = Math.floor(centroCanvasY + Number(y));

        var img = new Image();
        img.src = "../../../assets/images/avinhao.png";

        img.onload = function () {
            //Sempre que for necessário setar uma imagem na tela, é preciso
            //compensar a  imagem a ser desenhada, pois ela inicia o desenho no ponto setado
            //Portanto é necessário compensar a distancia média da imagem
            var centroImgX = img.width / 2;
            var centroImgY = img.height / 2;
            var imgX = Math.floor(ajusteX - centroImgX)
            var imgY = Math.floor(ajusteY - centroImgY);

            ctx.drawImage(img, imgX, imgY);
        };

    }
})