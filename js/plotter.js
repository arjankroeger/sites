let id = ["plotter","integral","derivative","3DPlane"];
let func= ["x**2","-0.05*(x-8)**2+5","0.3*(x-3)**3+1.2*(x-3)**2-0.5",[1,0,1,0]];
let BoX = new Array(id.length).fill(450)
let BoY = new Array(id.length).fill(300)
let oX = new Array(id.length).fill(450)
let oY = new Array(id.length).fill(300)
let ScalingFactor = [55,60,55,20];
let lastDistance = new Array(id.length).fill(0)
let Origin = Array(id.length).fill([1,1]); 
let startX = new Array(id.length);
let startY = new Array(id.length);
let graph = ["plotter","integral","derivative"]
let D3 = ["3DPlane"]
let moveAndScroll = ["plotter"]
let spin = ["3DPlane"]
var sliderIntegralDeltaXSlider = document.getElementById("slider");
var sliderRotationX = document.getElementById("sliderRotX");
var sliderRotationY = document.getElementById("sliderRotY");
oX[1] = 150; oY[1]=450; 
oX[3] = 450; oY[3]=300; 
let BderivativePoints = [-1,4]
let derivativePoints = [-1,4]

let Otheta =  parseInt(sliderRotationX.value)/100;
let Ophi = parseInt(sliderRotationY.value)/100;
let theta = Otheta;
let phi = Ophi;

function plotter() {
  for (let idx = 0; idx < id.length; idx++ ){



    var canvas = document.getElementById(id[idx]);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = 'black'

    ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    let realLeft, realTop
    if (id[idx] == "derivative"){
      // get the bounding rectangle of the element
      const rect = canvas.getBoundingClientRect();
  
      // get the page scroll offsets
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
      // calculate the top and left coordinates
      realTop = rect.top + scrollY;
      realLeft = rect.left + scrollX;
    }


    Origin[idx] = [oX[idx] , oY[idx]]; 
    


    //hin und her ziehen
    let currentX = undefined, currentY = undefined

    canvas.addEventListener('mousedown', function(event) {
      startX[idx] = event.clientX - canvas.offsetLeft;
      startY[idx] = event.clientY - canvas.offsetTop;
      ctx.beginPath();
      ctx.arc(startX[idx]-realLeft, startY[idx], 10, 0, 2 * Math.PI);
      ctx.stroke();
    });
    
    canvas.addEventListener('mousemove', function(event) {
      if (startX[idx] !== undefined && startY[idx] !== undefined) {
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
        var deltaX = currentX - startX[idx];
        var deltaY = currentY - startY[idx];
        if (moveAndScroll.includes(id[idx])){
        oX[idx] = BoX[idx] + deltaX
        oY[idx] = BoY[idx] + deltaY
        }
        if (id[idx] == "derivative"){
          if ( currentX > derivativePoints[0] - 10 && currentX < derivativePoints[0]  ){
            derivativePoints[0] = BderivativePoints[0] + deltaX/100
          }
          //console.log(currentX , derivativePoints[0]* ScalingFactor[idx] +Origin[idx][0],  derivativePoints[1]* ScalingFactor[idx] +Origin[idx][0])
          if ( currentX > derivativePoints[1] - 10 && currentX < derivativePoints[1] + 10  ){
            derivativePoints[1] = BderivativePoints[1] + deltaX/100
          }
          
        }
        if (D3.includes(id[idx])) {
          theta = Otheta + deltaY / 100;
          phi = Ophi - deltaX / 100;
        }
      }
    });
    
    canvas.addEventListener('mouseup', function(event) {
      if (moveAndScroll.includes(id[idx])){
        BoX[idx] = oX[idx]
        BoY[idx] = oY[idx]
      }
      else if (id[idx] == "derivative"){
        BderivativePoints[0] = derivativePoints[0]
      }
      if (D3.includes(id[idx])) {
        Otheta = theta;
        Ophi = phi;
      }
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
        if (moveAndScroll.includes(id[idx])){
        oX[idx] = BoX[idx] + deltaX
        oY[idx] = BoY[idx] + deltaY
      }
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


    if (graph.includes(id[idx])){
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
      else if(id[idx] == "derivative"){
      
        
        for ( i= 0; i <= 1; i++){
          x = derivativePoints[i]
          y = eval(func[idx])
          
          var x2 = x* ScalingFactor[idx] +Origin[idx][0]
          var y2 = -(y*ScalingFactor[idx]-Origin[idx][1])
          ctx.beginPath();
          ctx.strokeStyle = "red"
          ctx.lineWidth = 4
          ctx.arc(x2, y2, 8, 0, 2 * Math.PI, false);
          ctx.stroke()
          
          }
        }
      }
    if (D3.includes(id[idx])){
        


        let equ = func[idx];   
        let lambs = [(10*equ[1]+10*equ[2]+equ[3])/(equ[0]),(10*equ[1]-10*equ[2]+equ[3])/(equ[0]), 
                    (-10*equ[1]+10*equ[2]+equ[3])/(equ[0]),(-10*equ[1]-10*equ[2]+equ[3])/(equ[0]),
                    (10*equ[0]+10*equ[2]+equ[3])/(equ[1]),(10*equ[0]-10*equ[2]+equ[3])/(equ[1]),
                    (-10*equ[0]+10*equ[2]+equ[3])/(equ[1]),(-10*equ[0]-10*equ[2]+equ[3])/(equ[1]),
                    (10*equ[0]+10*equ[1]+equ[3])/(equ[2]),(10*equ[0]-10*equ[1]+equ[3])/(equ[2]),
                    (-10*equ[0]+10*equ[1]+equ[3])/(equ[2]),(-10*equ[0]-10*equ[1]+equ[3])/(equ[2])
                  ]
        
        let valLambs = [];
        let valLambsID = [];
        let Corners = [];
        for( i = 0; i < lambs.length; i++) {
          if (lambs[i]**2 <= 100){
            valLambs.push(lambs[i])
            valLambsID.push(i)
          }
        }
        
        var chain = [0,1,3,2]
        for(e = 0; e <4; e++){
          var i = valLambsID[chain[e]];
          var lamb = valLambs[i]
          let borders = [[lamb,10,10],[lamb,10,-10],[lamb,-10,10],[lamb,-10,-10],
                      [10,lamb,10],[10,lamb,-10],[-10,lamb,10],[-10,lamb,-10],
                      [10,10,lamb],[10,-10,lamb],[-10,10,lamb],[-10,-10,lamb],]
          Corners.push([parseInt(eval(borders[i][0])),parseInt(eval(borders[i][1])),parseInt(eval(borders[i][2]))])
        }
      
      
        ctx.beginPath();
        for (i=0; i<4; i++) {
          xn = parseInt(Corners[i][0]);
          yn = parseInt(Corners[i][1]);
          zn = parseInt(Corners[i][2]);
          xr = Math.cos(phi)*xn+Math.sin(phi)*zn;
          yr = Math.sin(theta)*Math.sin(phi)*xn+Math.cos(theta)*yn-Math.sin(theta)*Math.cos(phi)*zn;
          zr = Math.cos(theta)*Math.cos(theta)*xn+Math.sin(theta)*yn+Math.cos(theta)*Math.cos(phi)*zn;
          if(i==0){
            ctx.moveTo((20* xr)/(30-zr)* ScalingFactor[idx] +Origin[idx][0], -((20* yr)/(30-zr)*ScalingFactor[idx]-Origin[idx][1]))
          }
          ctx.lineTo((20* xr)/(30-zr)* ScalingFactor[idx] +Origin[idx][0], -((20* yr)/(30-zr)*ScalingFactor[idx]-Origin[idx][1]));
          
        }

        ctx.closePath();
        ctx.strokeStyle = "red"
        ctx.fillStyle ="yellow"
        ctx.stroke();
        ctx.fill();




        // details
        
        ctx.strokeStyle = "black"
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

      

      }



  }
}


    setInterval(plotter, 100)
