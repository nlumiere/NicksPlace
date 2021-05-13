
const canvasWidth = 512;
const canvasHeight = 512;
var COLOR = "#ff0000";


window.onload = function() {
    loadCanvas()
}

function wsinit() {
    const board = document.querySelector('#canvas');

    let ws;

    async function init() {
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket('wss://52.88.255.8:433');
        ws.onopen = () => {
            console.log('Connection opened!');
        }
        ws.onmessage = ({ data }) => {
            parsed_data = JSON.parse(data);
            x = parsed_data.x;
            y = parsed_data.y;
            r = parsed_data.r;
            g = parsed_data.g;
            b = parsed_data.b;
            var c = document.getElementById("canvas");
            var ctx = c.getContext("2d");
            var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

            var index = (x + y * canvasWidth) * 4;

            canvasData.data[index + 0] = r;
            canvasData.data[index + 1] = g;
            canvasData.data[index + 2] = b;
            canvasData.data[index + 3] = 255;
            ctx.putImageData(canvasData, 0, 0);
        };
        ws.onclose = function() {
            ws = null;
        }

        return 1;
    }

    board.onclick = function() {
        color = document.getElementById("picker");
        var x = (event.pageX - $('#canvas').offset().left);
        var y = event.pageY - $('#canvas').offset().top;
        x = Math.floor((x - 2));
        y = Math.floor((y - 2));
        var r = parseInt("0x" + COLOR.substring(1,3));
        var g = parseInt("0x" + COLOR.substring(3,5));
        var b = parseInt("0x" + COLOR.substring(5));
        var time = new Date().getTime();
        if(x >= 0 && x < 512 && y >= 0 && y < 512){
            ws.send(JSON.stringify(
                {
                    'x':x,
                    'y':y,
                    'r':r,
                    'g':g,
                    'b':b,
                    'datetime': time
                }
            ));
        }
    }
    
    init();
    loadBoard();
}

function firebaseInit(){
    var firebaseConfig = {
        apiKey: "AIzaSyDazsZPKlQSCtq56d5u80fRsueSkNJwPDk",
        authDomain: "nicksplace-793f5.firebaseapp.com",
        projectId: "nicksplace-793f5",
        storageBucket: "nicksplace-793f5.appspot.com",
        messagingSenderId: "706096015391",
        appId: "1:706096015391:web:904c732e3350f6f9b5cd2a",
        measurementId: "G-V2DP9TCZXL"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}

function loadBoard(){
    console.log("loading board");
    board = document.getElementById("canvas");
    board.width = canvasWidth;
    board.height = canvasHeight;
    var colorPicker = new iro.ColorPicker("#picker", {
        width: 240,
        color: "#ff0000"
    });

    colorPicker.on('color:change', function(color) {
        COLOR = color.hexString;
    });
}

function loadCanvas(){
    console.log("loading canvas");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const db = firebase.firestore();
    db.collection("pixels").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            pixeldata = doc.data();
            var index = (pixeldata.x + pixeldata.y * canvasWidth) * 4;

            canvasData.data[index + 0] = pixeldata.r;
            canvasData.data[index + 1] = pixeldata.g;
            canvasData.data[index + 2] = pixeldata.b;
            canvasData.data[index + 3] = 255;
        });
        ctx.putImageData(canvasData, 0, 0);
    });
}
