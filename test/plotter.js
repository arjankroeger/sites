let id = ["3DPlane"];
let func= [[1,0,1,0]];
let BoX = new Array(id.length).fill(450)
let BoY = new Array(id.length).fill(300)
let oX = new Array(id.length).fill(450)
let oY = new Array(id.length).fill(300)
let ScalingFactor = [30];
let lastDistance = new Array(id.length).fill(0)
let Origin = Array(id.length).fill([1,1]); 
let startX = new Array(id.length);
let startY = new Array(id.length);
let D3 = ["3DPlane"]
let spin = ["3DPlane"]
oX[0] = 900; oY[0]=600; 
let Otheta = 314/100;
let Ophi = 314/100;
let theta = Otheta;
let phi = Ophi;

function rot(coords){
  let coordsr = new Array(3);
  xn = coords[0];
  yn = coords[1];
  zn = coords[2];
  /*coordsr[0] = Math.cos(phi)*xn+Math.sin(phi)*zn;
  coordsr[1] = Math.sin(theta)*Math.sin(phi)*xn+Math.cos(theta)*yn-Math.sin(theta)*Math.cos(phi)*zn;
  coordsr[2] = -Math.cos(theta)*Math.cos(phi)*xn+Math.sin(theta)*yn+Math.cos(theta)*Math.cos(phi)*zn;
  */
  coordsr[0] = Math.cos(phi) * xn + Math.sin(phi) * Math.sin(theta) * yn + Math.sin(phi) * Math.cos(theta) *zn;
  coordsr[1] = Math.cos(theta) *yn - Math.sin(theta)*zn;
  coordsr[2] = 0-Math.sin(phi)*xn + Math.cos(phi) * Math.sin(theta) * yn + Math.cos(phi) *Math.cos(theta) *zn;      
  
  return coordsr
}

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
      ctx.beginPath();
      ctx.arc(startX[idx], startY[idx], 10, 0, 2 * Math.PI);
      ctx.stroke();
    });
    
    canvas.addEventListener('mousemove', function(event) {
      if (startX[idx] !== undefined && startY[idx] !== undefined) {
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
        var deltaX = currentX - startX[idx];
        var deltaY = currentY - startY[idx];
      
        
        if (D3.includes(id[idx])) {
          theta = Otheta + deltaY / 100;
          phi = Ophi - deltaX / 100;
        }
      }
    });
    
    canvas.addEventListener('mouseup', function(event) {
      
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
        
        
        if (D3.includes(id[idx])) {
          theta = Otheta + deltaY / 100;
          phi = Ophi - deltaX / 100;
        }
      }
    });
  

    canvas.addEventListener('touchend', function(event) {
        BoX[idx] = oX[idx]
        BoY[idx] = oY[idx]
        startX[idx] = undefined;
        startY[idx] = undefined;
        if (D3.includes(id[idx])) {
          Otheta = theta;
          Ophi = phi;
        }

        
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

//------------------------------------------------------------------------------------
    
    if (D3.includes(id[idx])){
        console.log("t")


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
          coordsr = rot([parseInt(Corners[i][0]), parseInt(Corners[i][1]), parseInt(Corners[i][2])])
          if(i==0){
            ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]))
          }
          ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]));
          
        }

        ctx.closePath();
        ctx.strokeStyle = "red"
        ctx.fillStyle ="yellow"
        ctx.stroke();
        ctx.fill();

//------------------------------------------------------------------------------------


        // details
        
        ctx.strokeStyle = "black"
        var detScale = 4
        //paint axis 1. x ; 2. y
          ctx.beginPath();
          coordsr = rot([-11, 0, 0])
          ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]));
          coordsr = rot([11, 0, 0])
          ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]));
          ctx.stroke()
          
          ctx.beginPath();
          coordsr = rot([0, -11, 0])
          ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]));
          coordsr = rot([0, 11, 0])
          ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]));
          ctx.stroke()
          
          ctx.beginPath();
          coordsr = rot([0, 0, -11])
          ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]));
          coordsr = rot([00, 0, 11])
          ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1]));
          ctx.stroke()

        

        //details on axis
        //x
        ctx.beginPath();
        coordsr = rot([-9, 0, 0])
        ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+15);
        ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] -10, -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+25);
        ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] -10, -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+15);
        ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] , -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+25);
        ctx.stroke()

        //y
        ctx.beginPath();
        coordsr = rot([0, -12, 0])
        ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0], -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+15);
        ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] -10, -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+35);
        ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] -10, -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+15);
        ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] -5, -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+25);
        ctx.stroke()
        
        //z
        ctx.beginPath();
        coordsr = rot([0, 0, 12])
        ctx.moveTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] -10, -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+15);
        ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] , -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+15);
        ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] -10, -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+25);
        ctx.lineTo((30* coordsr[0])/(30-coordsr[2])* ScalingFactor[idx] +Origin[idx][0] , -((30* coordsr[1])/(30-coordsr[2])*ScalingFactor[idx]-Origin[idx][1])+25);
        ctx.stroke()

        
        ctx.strokeStyle = "red"
        //arrows
        
        ctx.beginPath();
        xn = -10;
        ctx.stroke()

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
        


        ctx.strokeStyle = "black"
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
