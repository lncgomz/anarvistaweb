AFRAME.registerComponent('anim1', {
  init: function(){
      let el = this.el;
      let self = this;
      self.trees = [];      
      const animated = document.querySelector(".animated");
      animated.addEventListener("animationend", e =>{
    });
    el.addEventListener('changecolor', e =>{               
      let colorp = e.detail.color;
      let colorHex = Number(colorp.replace('#', '0x'));
      let color3D = new THREE.Color(colorHex);
      self.treeMat.color = color3D;                
    });
  }

});
AFRAME.registerComponent('click-listener', {
  init: function () {
    // Listen for click event
    let self = this;
    let el = this.el;
    this.el.addEventListener('click', function (evt) {   
      let tree = document.querySelector('#tree');
      let color = el.getAttribute('material', 'color');
     tree.emit('changecolor', color);
    });        
  }
 
});