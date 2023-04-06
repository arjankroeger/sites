let BoX = 450;
let BoY = 300;
let oX = BoX;
let oY = BoY;
var ScalingFactor = 55;
let lastDistance = 0;

function derivative_explination() {
    
    var canvas = document.getElementById("derivative_explination");
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    		
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    
    
    var Origin = [oX , oY]; 
    
    

    //hin und her ziehen

    let startX, startY, currentX, currentY;

    canvas.addEventListener('mousedown', function(event) {
      startX = event.clientX - canvas.offsetLeft;
      startY = event.clientY - canvas.offsetTop;
    });
    
    canvas.addEventListener('mousemove', function(event) {
      if (startX !== undefined && startY !== undefined) {
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        oX = BoX + deltaX
        oY = BoY + deltaY
      }
    });
    
    canvas.addEventListener('mouseup', function(event) {
        BoX = oX
        BoY = oY
        startX = undefined;
        startY = undefined;
      });
    

      // mobile
      canvas.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX - canvas.offsetLeft;
        startY = event.touches[0].clientY - canvas.offsetTop;
      });
      
      canvas.addEventListener('touchmove', function(event) {
        if (startX !== undefined && startY !== undefined) {
          currentX = event.touches[0].clientX - canvas.offsetLeft;
          currentY = event.touches[0].clientY - canvas.offsetTop;
          const deltaX = currentX - startX;
          const deltaY = currentY - startY;
          oX = BoX + deltaX
          oY = BoY + deltaY
          console.log(`moving: ${oX} , ${oY}`);
        }
      });
      
      canvas.addEventListener('touchend', function(event) {
          BoX = oX
          BoY = oY
          startX = undefined;
          startY = undefined;
          
          console.log(`Scrolling: ${BoX} , ${BoY}`);
        });

        //zooming
    
    canvas.addEventListener('wheel', function(event) {
        const delta = Math.sign(event.deltaY);
        console.log(`Scrolling: ${delta}`);
        ScalingFactor = ScalingFactor - 0.1 * delta;
    });


      //mobile

      canvas.addEventListener('touchmove', function(event) {
        if (event.touches.length === 2) {
          const touch1 = event.touches[0];
          const touch2 = event.touches[1];
          const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

          if (lastDistance !== null) {
            const delta = currentDistance - lastDistance;
            const deltaScalingFactor = delta / 100;
            ScalingFactor += deltaScalingFactor;
          }

          lastDistance = currentDistance;
        }
      });

      canvas.addEventListener('touchend', function(event) {
        lastDistance = null;
      });




    const detShift = [ 10, 6]
    const detScale = 4
    //paint axis 1. x ; 2. y
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(0, Origin[1]);
    ctx.lineTo(canvasWidth, Origin[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(Origin[0], 0);
    ctx.lineTo(Origin[0], canvasHeight);
    ctx.stroke();

    //details on axis
    //x
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(canvasWidth-detShift[0]-2*detScale, Origin[1]+detShift[1]+2*detScale);
    ctx.lineTo(canvasWidth-detShift[0], Origin[1]+detShift[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(canvasWidth-detShift[0], Origin[1]+detShift[1]+2*detScale);
    ctx.lineTo(canvasWidth-detShift[0]-2*detScale, Origin[1]+detShift[1]);
    ctx.stroke();

    //y
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(Origin[0]+detShift[0]+detScale, detShift[1]+2*detScale);
    ctx.lineTo(Origin[0]+detShift[0], detShift[1]);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(Origin[0]+detShift[0], detShift[1]+4*detScale);
    ctx.lineTo(Origin[0]+detShift[0]+2*detScale, detShift[1]);
    ctx.stroke();
    
    //arrows
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(canvasWidth, Origin[1]);
    ctx.lineTo(canvasWidth-2*detScale, Origin[1]-2*detScale);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(canvasWidth, Origin[1]);
    ctx.lineTo(canvasWidth-2*detScale, Origin[1]+2*detScale);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(Origin[0], 0);
    ctx.lineTo(Origin[0]-2*detScale, 2*detScale);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(Origin[0], 0);
    ctx.lineTo(Origin[0]+2*detScale, 2*detScale);
    ctx.stroke();

    // marks on axis
    
    for (i = 1 ; i <= canvasWidth/ScalingFactor; i++){
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(i* ScalingFactor +Origin[0],Origin[1]-1.2*detScale);
        ctx.lineTo(i* ScalingFactor +Origin[0],Origin[1]+1.2*detScale);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(-i* ScalingFactor +Origin[0],Origin[1]-1.2*detScale);
        ctx.lineTo(-i* ScalingFactor +Origin[0],Origin[1]+1.2*detScale);
        ctx.stroke();
    }
    for (i = 1 ; i <= canvasHeight/ScalingFactor; i++){
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(Origin[0]-detScale,-(i*ScalingFactor-Origin[1]));
        ctx.lineTo(Origin[0]+detScale,-(i*ScalingFactor-Origin[1]));
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(Origin[0]-detScale,+(i*ScalingFactor+Origin[1]));
        ctx.lineTo(Origin[0]+detScale,+(i*ScalingFactor+Origin[1]));
        ctx.stroke();
    }

    // paint function
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(0, 0);
    for (let i = -canvasWidth/ScalingFactor*10 ; i <= canvasWidth /ScalingFactor*10; i++) {
        var x = i/10
        var y =x*x
        ctx.lineTo(x* ScalingFactor +Origin[0], -(y*ScalingFactor-Origin[1]));
    }
    ctx.stroke();
    }
    
    setInterval(derivative_explination, 100)
