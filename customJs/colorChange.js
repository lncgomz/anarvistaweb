AFRAME.registerComponent('anim1', {
  init: function(){
      let el = this.el;
      let self = this;
      self.trees = [];      
      const animated = document.querySelector(".animated");
      animated.addEventListener("animationend", e =>{
        debugger
        //   let tree3D = el.getObject3D('mesh');
        //   if (!tree3D){return;}    
        // console.log('tree3D', tree3D);
        //   tree3D.traverse(function(node){
        //       if (node.isMesh){   
        //         console.log(node);
        //           self.trees.push(node);
        //         if(node.name == "Trunk_A"){
        //           self.treeMat = node.material;
        //         }
        //         node.material.map = null;
        //       }
        //   });
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
      // Call the Octahedron and trigger it's scalewave animation
      let tree = document.querySelector('#tree');
      let color = el.getAttribute('material', 'color');
     tree.emit('changecolor', color);
    });        
  }
 
});