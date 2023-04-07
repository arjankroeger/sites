let id = ["plotter","integral"];
let func= ["x**2","-0.05*(x-8)**2+5"];
let BoX = new Array(id.length).fill(450)
let BoY = new Array(id.length).fill(300)
let oX = new Array(id.length).fill(450)
let oY = new Array(id.length).fill(300)
let ScalingFactor = [55,60];
let lastDistance = new Array(id.length).fill(0)
let Origin = Array(id.length).fill([1,1]); 
let startX = new Array(id.length);
let startY = new Array(id.length);

var sliderIntegralDeltaXSlider = document.getElementById("slider");
oX[1] = 150; oY[1]=450; 

function plotter() {
  for (let idx = 0; idx < id.length; idx++ ){



    var canvas = document.getElementById(id[idx]);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = 'black'

    ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    
    
    Origin[idx] = [oX[idx] , oY[idx]]; 
    
    

    //hin und her ziehen
    let currentX = undefined, currentY = undefined

    canvas.addEventListener('mousedown', function(event) {
      startX[idx] = event.clientX - canvas.offsetLeft;
      startY[idx] = event.clientY - canvas.offsetTop;
    });
    
    canvas.addEventListener('mousemove', function(event) {
      if (startX[idx] !== undefined && startY[idx] !== undefined) {
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
        var deltaX = currentX - startX[idx];
        var deltaY = currentY - startY[idx];
        oX[idx] = BoX[idx] + deltaX
        oY[idx] = BoY[idx] + deltaY
      }
    });
    
    canvas.addEventListener('mouseup', function(event) {
        BoX[idx] = oX[idx]
        BoY[idx] = oY[idx]
        startX[idx] = undefined;
        startY[idx] = undefined;
      });
    

    // mobile
    canvas.addEventListener('touchstart', function(event) {
      startX[idx] = event.touches[0].clientX - canvas.offsetLeft;
      startY[idx] = event.touches[0].clientY - canvas.offsetTop;
    });
    
    canvas.addEventListener('touchmove', function(event) {
      if (startX[idx] !== undefined && startY[idx] !== undefined) {
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
        var deltaX = currentX - startX[idx];
        var deltaY = currentY - startY[idx];
        oX[idx] = BoX[idx] + deltaX
        oY[idx] = BoY[idx] + deltaY
      }
    });
  

    canvas.addEventListener('touchend', function(event) {
        BoX[idx] = oX[idx]
        BoY[idx] = oY[idx]
        startX[idx] = undefined;
        startY[idx] = undefined;
      });

      //zooming
    
    canvas.addEventListener('wheel', function(event) {
        var delta = Math.sign(event.deltaY);
        ScalingFactor[idx] = ScalingFactor[idx] - 0.1 * delta;
    });


    //mobile

    canvas.addEventListener('touchmove', function(event) {
      if (event.touches.length === 2) {
        var touch1 = event.touches[0];
        var touch2 = event.touches[1];
        var currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        if (lastDistance[idx] !== null) {
          var delta = currentDistance - lastDistance[idx];
          var deltaScalingFactor = delta / 100;
          ScalingFactor[idx] += deltaScalingFactor;
        }

        lastDistance[idx] = currentDistance;
      }
    });

    canvas.addEventListener('touchend', function(event) {
      lastDistance[idx] = null;
      });




    var detShift = [ 10, 6]
    var detScale = 4
    //paint axis 1. x ; 2. y
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(0, Origin[idx][1]);
    ctx.lineTo(canvasWidth, Origin[idx][1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(Origin[idx][0], 0);
    ctx.lineTo(Origin[idx][0], canvasHeight);
    ctx.stroke();

    //details on axis
    //x
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(canvasWidth-detShift[0]-2*detScale, Origin[idx][1]+detShift[1]+2*detScale);
    ctx.lineTo(canvasWidth-detShift[0], Origin[idx][1]+detShift[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(canvasWidth-detShift[0], Origin[idx][1]+detShift[1]+2*detScale);
    ctx.lineTo(canvasWidth-detShift[0]-2*detScale, Origin[idx][1]+detShift[1]);
    ctx.stroke();

    //y
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(Origin[idx][0]+detShift[0]+detScale, detShift[1]+2*detScale);
    ctx.lineTo(Origin[idx][0]+detShift[0], detShift[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(Origin[idx][0]+detShift[0], detShift[1]+4*detScale);
    ctx.lineTo(Origin[idx][0]+detShift[0]+2*detScale, detShift[1]);
    ctx.stroke();
    
    //arrows
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(canvasWidth, Origin[idx][1]);
    ctx.lineTo(canvasWidth-2*detScale, Origin[idx][1]-2*detScale);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(canvasWidth, Origin[idx][1]);
    ctx.lineTo(canvasWidth-2*detScale, Origin[idx][1]+2*detScale);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(Origin[idx][0], 0);
    ctx.lineTo(Origin[idx][0]-2*detScale, 2*detScale);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(Origin[idx][0], 0);
    ctx.lineTo(Origin[idx][0]+2*detScale, 2*detScale);
    ctx.stroke();

    // marks on axis
    
    for (i = 1 ; i <= canvasWidth/ScalingFactor[idx]; i++){
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(i* ScalingFactor[idx] +Origin[idx][0],Origin[idx][1]-1.2*detScale);
        ctx.lineTo(i* ScalingFactor[idx] +Origin[idx][0],Origin[idx][1]+1.2*detScale);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(-i* ScalingFactor[idx] +Origin[idx][0],Origin[idx][1]-1.2*detScale);
        ctx.lineTo(-i* ScalingFactor[idx] +Origin[idx][0],Origin[idx][1]+1.2*detScale);
        ctx.stroke();
    }
    for (i = 1 ; i <= canvasHeight/ScalingFactor[idx]; i++){
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(Origin[idx][0]-detScale,-(i*ScalingFactor[idx]-Origin[idx][1]));
        ctx.lineTo(Origin[idx][0]+detScale,-(i*ScalingFactor[idx]-Origin[idx][1]));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(Origin[idx][0]-detScale,+(i*ScalingFactor[idx]+Origin[idx][1]));
        ctx.lineTo(Origin[idx][0]+detScale,+(i*ScalingFactor[idx]+Origin[idx][1]));
        ctx.stroke();
    }

    // paint function
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(0, 0);
    for (let i = -canvasWidth/ScalingFactor[idx]*10 ; i <= canvasWidth /ScalingFactor[idx]*10; i++) {
        var x = i/10
        var y = eval(func[idx])
        ctx.lineTo(x* ScalingFactor[idx] +Origin[idx][0], -(y*ScalingFactor[idx]-Origin[idx][1]));
    }
    ctx.stroke();
    

    if (id[idx] == "integral"){
      var sliderIntegralDeltaX = (1501 - parseInt(sliderIntegralDeltaXSlider.value))/30;
      var count = Math.ceil(20/sliderIntegralDeltaX)-1
      for (i = 0; i <= count; i++){  
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.strokeStyle = 'orange'
        var x = i *sliderIntegralDeltaX
        var y = eval(func[idx])
        ctx.strokeRect(x* ScalingFactor[idx] +Origin[idx][0],-(y*ScalingFactor[idx]-Origin[idx][1]),ScalingFactor[idx]*sliderIntegralDeltaX,y*ScalingFactor[idx])

      }
    }
  }
}
    

    setInterval(plotter, 100)
