app.controller('comandoCtrl', ['$scope', '$filter', function ($scope, $filter) {

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
                var raioPorXY = calculaRaio(this.avinhao.x, this.avinhao.y);
                var anguloXY = calculaAngulo(this.avinhao.x, this.avinhao.y);
                this.addRow({
                    X: this.avinhao.x,
                    Y: this.avinhao.y,
                    Raio: raioPorXY,
                    Angulo: anguloXY
                });
            } else if (this.avinhao.raio && this.avinhao.angulo) {
                //Precisamos então transformar as coordenadas polares em cartesianas antes de setarmos no mapa.
                var raio = Number(this.avinhao.raio);
                var angulo = Number(this.avinhao.angulo);

                angulo = degreesToRadians(angulo);

                var sinAngulo = Math.sin(angulo);
                var cosAngulo = Math.cos(angulo);
                console.table(sinAngulo, cosAngulo);

                var novoX = cosAngulo * raio;
                var novoY = sinAngulo * raio;

                //Adicionamos os  valores na grade de exibição
                this.addRow({
                    Raio: this.avinhao.raio,
                    Angulo: this.avinhao.angulo,
                    X: parseFloat(novoX.toFixed(2)),
                    Y: parseFloat(novoY.toFixed(2))
                });
                //Setamos os valores nos mapas
                this.setAvinhaoMapa(novoX, novoY);
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

    $scope.moverAvinhao = function (avinhao) {

    }

    function degreesToRadians(graus) {
        return (graus * Math.PI) / 180;
    }

    $scope.startPage = function () {
        return true;
    }

    $scope.rowSelected = function (e) {
        if (e.isSelected == true) {
            console.log(e);
        }
    };

    $scope.addRow = function (row) {
        $scope.rowCollection.push(row);
    };

    $scope.inicializarCampos = function () {
        $scope.rowCollection = [];
        $scope.avinhao = {};
        $scope.avinhao.coordenadas = "cartesiana";
    };

    //Função responsável por calcular o raio após inserida uma coordenada de x e y
    function calculaRaio(x, y){
        //Fórmula de calcular o raio
        //r² = x² + y²
        var cartesiana = (x * x) + (y * y);
        var raio = Math.sqrt(cartesiana);
        console.log(raio);

        return raio;
    }

    //Função responsável por calcular o Angulo, a partir do X e Y
    function calculaAngulo(x, y) {
        var pi = Math.atan2(y, x);
        var angulo =  pi * (180 / Math.PI);
        console.log(angulo);
        if(angulo < 0){
            angulo = Number(angulo) + 360;
            console.log("calculando por -90");
        }
        // else if(angulo > -90 && angulo < 0) {
        //     angulo = (Number(angulo) +360;
        //     console.log("calculando por -270");
        // }
        return Math.abs(angulo);
    }

}]);