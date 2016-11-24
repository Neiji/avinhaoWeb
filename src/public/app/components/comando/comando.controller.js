app.controller('comandoCtrl', ['$scope', '$filter', function ($scope, $filter) {

    //Variáveis globais da controler.
    avinhoes = [];
    avinhaoSelected = null;

    //Seta um avião no mapa, este método é responsável por fazer uso das coordenadas x e y passadas por parâmetro para
    //adicionar um novo avião no mapa.
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

    //Este método é apenas visual e é responsável por desabilitar os campos de angulo e raio ou x e y conforme seleção
    // do usuário a respeito de qual coordenada o mesmo deseja utilizar.
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

    //Método que adiciona um novo avião para o usuário, conforme suas escolhas (Coordenadas cartesianas ou polares).
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
                    Angulo: anguloXY,
                    Velocidade: this.avinhao.Velocidade
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

    //Método responsável por mover um avião que foi previamente selecionado na tabela.
    $scope.moverAvinhao = function () {
        if(!avinhaoSelected || avinhaoSelected == null){
            alert("Você precisa selecionar um avião na tabela para mover.");
        }else{
            var y = avinhaoSelected.Y;
            var x = avinhaoSelected.X;
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var centroCanvasX = canvas.width / 2;
            var centroCanvasY = canvas.height / 2;
            //Realizamos um tratamento para quando o Y for menor que 0, pois no canvas os valores positivos e negativos
            //de Y são invertidos.
            if (Number(y) < 0) {
                y = Math.abs(Number(y));
            } else {
                y = -Math.abs(Number(y));
            }

            var ajusteX = Math.floor(centroCanvasX + Number(x));
            var ajusteY = Math.floor(centroCanvasY + Number(y));

            //Aqui, nós inicializamos a imagem de um avião para obter suas medidas
            var img = new Image();
            img.src = "../../../assets/images/avinhao.png";
            img.onload = function () {
                var centroImgX = img.width / 2;
                var centroImgY = img.height / 2;
                var imgX = Math.floor(ajusteX - centroImgX)
                var imgY = Math.floor(ajusteY - centroImgY);
                //No momento em que temos as medidas da imagem, desenhamos um retangulo verde em cima, afim de apagar o
                // aviao antigo
                ctx.fillRect(imgX, imgY, 50, 30);
                $scope.setAvinhaoMapa($scope.avinhao.XMover, $scope.avinhao.YMover);
                //Por fim, setamos os novos valores de X e Y na tabela
                avinhaoSelected.X = $scope.avinhao.XMover;
                avinhaoSelected.Y = $scope.avinhao.YMover;
            }
        }
    }

    //Método responsável por realizar a conversão de graus para radianos.
    function degreesToRadians(graus) {
        return (graus * Math.PI) / 180;
    }

    //Evento disparado quando um avião é selecionado na tabela, este avião será usado ao tentar move-lo etc.
    $scope.rowSelected = function (e) {
        if (e.isSelected == true) {
            avinhaoSelected = e;
        }else{
            avinhaoSelected = null;
        }
    };

    //Método responsável por adicionar uma linha na tabela de informações sobre o avião
    $scope.addRow = function (row) {
        $scope.rowCollection.push(row);
    };

    //Inicializamos algumas variáveis do projeto para que estejam disponíveis posteriormente
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

    $scope.escalonar = function(){
        if(!avinhaoSelected || avinhaoSelected == null){
            alert("Você precisa selecionar um avião na tabela para mover.");
        }else{
            var y = avinhaoSelected.Y;
            var x = avinhaoSelected.X;

            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var centroCanvasX = canvas.width / 2;
            var centroCanvasY = canvas.height / 2;
            //Realizamos um tratamento para quando o Y for menor que 0, pois no canvas os valores positivos e negativos
            //de Y são invertidos.
            if (Number(y) < 0) {
                y = Math.abs(Number(y));
            } else {
                y = -Math.abs(Number(y));
            }

            var ajusteX = Math.floor(centroCanvasX + Number(x));
            var ajusteY = Math.floor(centroCanvasY + Number(y));

            //Aqui, nós inicializamos a imagem de um avião para obter suas medidas
            var img = new Image();
            img.src = "../../../assets/images/avinhao.png";
            img.onload = function () {
                var centroImgX = img.width / 2;
                var centroImgY = img.height / 2;
                var imgX = Math.floor(ajusteX - centroImgX)
                var imgY = Math.floor(ajusteY - centroImgY);
                //No momento em que temos as medidas da imagem, desenhamos um retangulo verde em cima, afim de apagar o
                // aviao antigo
                ctx.fillRect(imgX, imgY, 50, 30);
                //Pegamos o valor puro de Y, pois para os calculos, não precisamos do tratamento para o canvas
                var escalarX =  x * (Number($scope.avinhao.XEscala) / 100);
                var escalarY =  Number(avinhaoSelected.Y) * (Number($scope.avinhao.YEscala) / 100);
                $scope.setAvinhaoMapa(escalarX, escalarY);
                //Por fim, setamos os novos valores de X e Y na tabela
                avinhaoSelected.X = escalarX;
                avinhaoSelected.Y = escalarY;
                avinhaoSelected.Angulo = calculaAngulo(escalarX, escalarY);
                avinhaoSelected.Raio = calculaRaio(escalarX, escalarY);
            }
        }
    }

    $scope.rotacionar = function(){
        if(!avinhaoSelected || avinhaoSelected == null){
            alert("Você precisa selecionar um avião na tabela para rotacionar.");
        }else{
            debugger;
            var xTarget = Number(avinhaoSelected.X);
            var yTarget = Number(avinhaoSelected.Y);

            //Valores necessário para realizar o calculo da rotação
            var xRotacionar = Number($scope.avinhao.XRotacao);
            var yRotacionar = Number($scope.avinhao.YRotacao);
            var anguloRotacionar = degreesToRadians(Number($scope.avinhao.AnguloRotacao));

            var xDif = xTarget - xRotacionar;
            var yDif = yTarget - yRotacionar;

            var ajusteX = xDif + xRotacionar;
            var ajusteY = yDif + yRotacionar;

            var xNew = (ajusteX * Math.cos(anguloRotacionar)) + (ajusteY * - Math.sin(anguloRotacionar));
            var yNew = (ajusteX * Math.sin(anguloRotacionar)) + (ajusteY * Math.cos(anguloRotacionar));

            xNew = Math.round(xNew);
            yNew = Math.round(yNew);

            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var centroCanvasX = canvas.width / 2;
            var centroCanvasY = canvas.height / 2;
            //Realizamos um tratamento para quando o Y for menor que 0, pois no canvas os valores positivos e negativos
            //de Y são invertidos.
            if (Number(avinhaoSelected.Y) < 0) {
                yTarget = Math.abs(Number(yTarget));
            } else {
                yTarget = -Math.abs(Number(yTarget));
            }

            var ajusteX = Math.floor(centroCanvasX + Number(xTarget));
            var ajusteY = Math.floor(centroCanvasY + Number(yTarget));

            //Aqui, nós inicializamos a imagem de um avião para obter suas medidas
            var img = new Image();
            img.src = "../../../assets/images/avinhao.png";
            img.onload = function () {
                var centroImgX = img.width / 2;
                var centroImgY = img.height / 2;
                var imgX = Math.floor(ajusteX - centroImgX)
                var imgY = Math.floor(ajusteY - centroImgY);
                //No momento em que temos as medidas da imagem, desenhamos um retangulo verde em cima, afim de apagar o
                // aviao antigo
                ctx.fillRect(imgX, imgY, 50, 30);
                $scope.setAvinhaoMapa(xNew, yNew);
                //Por fim, setamos os novos valores de X e Y na tabela
                avinhaoSelected.X = xNew;
                avinhaoSelected.Y = yNew;
            }
        }
    }

}]);