require(['example/marker'], function() {
  stage.on('message:init', function(obj) {
    stage.addMessageMarker(obj);

    var listener = new Rect(0, 0, 1000, 1000)
    .attr({
      fillColor: '#333',
      y: 0
    }).addTo(stage);

    listener.on('pointermove', function(evt) {
      demo.mousemove(evt);
    });

    stage.removeMessageMarker();
  });


  function Particle( x, y, radius ) {
    this.init( x, y, radius );
  }

  Particle.prototype = {

    init: function( x, y, radius ) {

      this.alive = true;

      this.radius = radius || 10;
      this.wander = 0.15;
      this.theta = random( Math.PI * 2 );
      this.drag = 0.92;
      this.color = '#fff';

      this.x = x || 0.0;
      this.y = y || 0.0;

      this.vx = 0.0;
      this.vy = 0.0;
      
      this.shape = new Circle(this.x, this.y, this.radius).addTo(stage);
    },

    move: function() {

      this.x += this.vx;
      this.y += this.vy;

      this.vx *= this.drag;
      this.vy *= this.drag;

      this.theta += random( -0.5, 0.5 ) * this.wander;
      this.vx += Math.sin( this.theta ) * 0.1;
      this.vy += Math.cos( this.theta ) * 0.1;

      this.radius *= 0.96;
      this.alive = this.radius > 0.5;
    },

    draw: function() {
      this.shape.attr({
        x: this.x,
        y: this.y,
        fillColor: this.color,
        radius: this.radius
      });
    }
  };

  var MAX_PARTICLES = 20;
  var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

  var particles = [];
  var pool = [];

  demo = {
    width: 1000,
    height: 1000,
    setup: function() {
      // Set off some initial particles.
      var i, x, y;
    
      for ( i = 0; i < 1; i++ ) {
        x = ( demo.width * 0.5 ) + random( -100, 100 );
        y = ( demo.height * 0.5 ) + random( -100, 100 );
        demo.spawn( x, y );
      }
    },
    
    spawn: function( x, y ) {
    
      if ( particles.length >= MAX_PARTICLES )
        pool.push( particles.shift() );
    
      particle = pool.length ? pool.pop() : new Particle();
      particle.init( x, y, random( 5, 40 ) );
    
      particle.wander = random( 0.5, 2.0 );
      particle.color = random( COLOURS );
      particle.drag = random( 0.9, 0.99 );
    
      theta = random( Math.PI * 2 );
      force = random( 2, 8 );
    
      particle.vx = Math.sin( theta ) * force;
      particle.vy = Math.cos( theta ) * force;
    
      particles.push( particle );
    },
    
    update: function() {
    
      var i, particle;
    
      for ( i = particles.length - 1; i >= 0; i-- ) {
    
        particle = particles[i];
    
        if ( particle.alive ) particle.move();
        else {
          particle.shape.destroy();
          pool.push( particles.splice( i, 1 )[0] );
        }
      }
    },
    

    mousemove: function(evt) {
      var max = random( 1, 4 ), j;
      for ( j = 0; j < max; j++ ) demo.spawn( evt.x, evt.y );
    }
  };

  demo.setup();

  stage.on('tick', function() {
    demo.update(); 
    for ( var i = particles.length - 1; i >= 0; i-- ) {
      particles[i].draw();
    }
  });

  function random( min, max ) {
    if ( min && typeof min.length === 'number' && !!min.length )
        return min[ Math.floor( Math.random() * min.length ) ];

    if ( typeof max !== 'number' )
        max = min || 1, min = 0;

    return min + Math.random() * (max - min);
  };
});
