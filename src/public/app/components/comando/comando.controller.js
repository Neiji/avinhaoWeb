app.controller('comandoCtrl', ['$scope', '$filter', function ($scope, $filter) {

    avinhoes = [];
    avinhaoSelected = null;

    $scope.setAvinhaoMapa = function(x, y){
        if (Number(y) < 0) {
            y = Math.abs(Number(y));
        } else {
            y = -Math.abs(Number(y));
        }

        //Canvas e seu contexto
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        //Medidas padrões do canvas
        var centroCanvasX = canvas.width / 2;
        var centroCanvasY = canvas.height / 2;
        var radius = Math.floor(canvas.width / 3);
debugger;
        //Desenho das linhas
        var begin = 0;
        intervalo = 90;
        var arcSize = degreesToRadians(intervalo);
        for (var i = begin; i < 360;) {
            ctx.beginPath();
            ctx.moveTo(centroCanvasX, centroCanvasY);
            ctx.arc(centroCanvasX, centroCanvasY, radius, degreesToRadians(i), i + arcSize, false);
            ctx.closePath();
            ctx.stroke();

            i = i + intervalo;
        }

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

            for(var i = 0; i < avinhoes.length; i++){
                //Estas variáveis foram transformadas em Number, pois as mesmas veem como string da View
                //O Javascript não nos permite realizar somas entre numeros e strings, nos retornando erro de calculo
                var avinhaoAddX = Number(this.avinhao.X);
                var avinhaoAddY = Number(this.avinhao.Y);
                if((avinhaoAddX <= Number(avinhoes[i].X) +50 &&  avinhaoAddX  >= Number(avinhoes[i].X) -50)
                    && (avinhaoAddY <= Number(avinhoes[i].Y) +30 && avinhaoAddY >= Number(avinhoes[i].Y) -30)){
                    //Cancelamos a ação de adicionar o avião, caso o mesmo esteja fora de uma distancia segura do anteriormente adicionado.
                    alert("Você precisa adicionar um avião a uma distância segura do outro.");
                    return;
                }
            }

            if (this.avinhao.X && this.avinhao.Y) {
                this.setAvinhaoMapa(this.avinhao.X, this.avinhao.Y);
                var raioPorXY = calculaRaio(this.avinhao.X, this.avinhao.Y);
                var anguloXY = calculaAngulo(this.avinhao.X, this.avinhao.Y);
                this.addRow({
                    X: this.avinhao.X,
                    Y: this.avinhao.Y,
                    Raio: raioPorXY,
                    Angulo: anguloXY
                });
            } else if (this.avinhao.Raio && this.avinhao.Angulo) {
                //Precisamos então transformar as coordenadas polares em cartesianas antes de setarmos no mapa.
                var raio = Number(this.avinhao.Raio);
                var angulo = Number(this.avinhao.Angulo);

                angulo = degreesToRadians(angulo);

                var sinAngulo = Math.sin(angulo);
                var cosAngulo = Math.cos(angulo);
                //console.table(sinAngulo, cosAngulo);

                var novoX = cosAngulo * raio;
                var novoY = sinAngulo * raio;

                //Adicionamos os  valores na grade de exibição
                this.addRow({
                    Raio: this.avinhao.Raio,
                    Angulo: this.avinhao.Angulo,
                    X: parseFloat(novoX.toFixed(2)),
                    Y: parseFloat(novoY.toFixed(2))
                });
                //Setamos os valores nos mapas
                debugger;
                this.setAvinhaoMapa(novoX, novoY);
            }
            avinhoes.push(angular.copy(this.avinhao));
        }
    }

    $scope.moverAvinhao = function () {
        if(!avinhaoSelected || avinhaoSelected == null){
            alert("Você precisa selecionar um avião na tabela para mover.");
        }else{
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var centroCanvasX = canvas.width / 2;
            var centroCanvasY = canvas.height / 2;
            if (Number(y) < 0) {
                avinhaoSelected.Y = Math.abs(Number(avinhaoSelected.Y));
            } else {
                avinhaoSelected.Y = -Math.abs(Number(avinhaoSelected.Y));
            }
            var ajusteX = Math.floor(centroCanvasX + Number(avinhaoSelected.X));
            var ajusteY = Math.floor(centroCanvasY + Number(avinhaoSelected.Y));

            //Aqui, nós inicializamos a imagem de um avião para obter suas medidas
            var img = new Image();
            img.src = "../../../assets/images/avinhao.png";
            img.onload = function () {
                var centroImgX = img.width / 2;
                var centroImgY = img.height / 2;
                var imgX = Math.floor(ajusteX - centroImgX)
                var imgY = Math.floor(ajusteY - centroImgY);
                //No momento em que temos as medidas da imagem, desenhamos um retangulo verde em cima, afim de apagar o aviao antigo
                ctx.fillRect(imgX, imgY, 50, 30);
                $scope.setAvinhaoMapa($scope.avinhao.XMover, $scope.avinhao.YMover);
            }
        }
    }

    function degreesToRadians(graus) {
        return (graus * Math.PI) / 180;
    }

    $scope.startPage = function () {
        return true;
    }

    $scope.rowSelected = function (e) {
        if (e.isSelected == true) {
            avinhaoSelected = e;
        }else{
            avinhaoSelected = null;
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
        //console.log(raio);

        return raio;
    }

    //Função responsável por calcular o Angulo, a partir do X e Y
    function calculaAngulo(x, y) {
        var pi = Math.atan2(y, x);
        var angulo =  pi * (180 / Math.PI);
        //console.log(angulo);
        if(angulo < 0){
            angulo = Number(angulo) + 360;
            //console.log("calculando por -90");
        }
        // else if(angulo > -90 && angulo < 0) {
        //     angulo = (Number(angulo) +360;
        //     console.log("calculando por -270");
        // }
        return Math.abs(angulo);
    }

}]);