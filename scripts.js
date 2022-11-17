const {
  Engine,
  Constraint,
  Composite,
  MouseConstraint,
  Composites,
  Bodies,
  Render,
  Runner,
  Events,
  Mouse,
} = Matter;

// create engine and runner
let engine = Engine.create();
let runner = Runner.create();
let world = engine.world;
// create a renderer
let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 550,
    height: 700,
    background: "#fff",
    wireframes: false,
    showVelocity: true,
  },
});

function wall() {
  let left_wall = Bodies.rectangle(0, 0, 10, 1400, { isStatic: true});
  let right_wall = Bodies.rectangle(650, 0, 10, 1400, { isStatic: true });
  let ground = Bodies.rectangle(150, 695, 990, 20, { isStatic: true });
  return Composite.add(world, [left_wall, right_wall, ground]);
}
wall();

// arena 
// function arena(){
//     let left_arena = Bodies.rectangle(35, 420, 55, 400, { isStatic: true, render:{fillStyle:"#9d6055"}});
//   let right_arena = Bodies.rectangle(615,420, 55, 400, { isStatic: true ,render:{fillStyle:"#9d6055"}});
//   let down = Bodies.rectangle(325, 630, 510, 50, { isStatic: true,render:{fillStyle:"#9d6055"} });
//   return Composite.add(world, [left_arena, right_arena, down]);
// }
// arena();

// define warrior
// let default_warrior = 0x001,
//     red_warrior = 0x0002,
//     green_warrior =0x0004,
//     blue_warrior = 0x0008;

// // warrior identity
// let first = "#F55a3c",
//     second ="#063a7b",
//     third = "#f5d259";
    

//bodies
function main(){
    function support(){
       var lift = Bodies.rectangle(570, 200, 170, 15, {isStatic:true});
       return Composite.add(world, [lift])
    }
    function polygonShapes(){
        var poly = Composites.stack(500, 90, 3, 3, 0, 0, function(x,y){
            return Bodies.polygon(x,y, 8, 30);
    
        })
        return Composite.add(world, [poly])
    }
    function firingBall(){
        let firing =false;
        let ball = Bodies.circle(300, 600, 20);
        let sling = Constraint.create({
            pointA:{x:300, y:600},
            bodyB:ball,
            stiffness:0.08
        })
       Events.on(mouseConstraints, 'enddrag', function(e){
        console.log("drag")
        if (e.body === ball) firing=true;    
    })
        Events.on(engine, 'afterUpdate', function(){
            if (firing && Math.abs(ball.position.x-300)<20 && Math.abs(ball.position.y-600)<20){
                ball = Bodies.circle(100, 500, 20);
                Composite.add(world, [ball]);
                sling.bodyB= ball
                firing =false;
                
            }
        })
        return Composite.add(world, [ball, sling])
    }
    


    support();
    polygonShapes();
    firingBall();
}
main()
// mouse control
function mouseConstraints() {
  var mouse = Mouse.create(render.canvas);
  mouse_canvas = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  render.mouse=mouse;
  (Composite.add(world, [mouse_canvas]))
}
//  
mouseConstraints()

Render.lookAt(render, {
    min:{x:0, y:0},
    max:{x:800, y:600}
})

// running the engines
Engine.run(engine);
Render.run(render);
Runner.run(runner, engine);
