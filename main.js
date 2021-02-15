



//=========================variables==================================
let graph = null;
const data = {
nodes: [],
edges: [],
};
let counter = 65;


//==================================event listeners===========================================

document.addEventListener('DOMContentLoaded', function(event){

  const radioButtons = document.querySelectorAll('input[type="radio"][name="mode"]');
  const selectItems = document.querySelectorAll('.select-item');

  for(let radio of radioButtons){
    radio.addEventListener('change', function(event){
      const value = event.target.value;
      graph.setMode(value);
      console.log(graph.getCurrentMode())
    });
  }

  for(let item of selectItems){
    item.addEventListener('click', function(event){
      for(let i of selectItems){
        i.style.backgroundColor = '#fff';
      }
      this.style.backgroundColor = '#eee'
      const value = this.querySelector('input.mode').value;
      
      
      graph.setMode(value);
      console.log(graph.getCurrentMode())
    });
  }

  drawGraph(data);
    Swal.fire({
      title: 'توجه',
      text: 'توجه داشته باشید که ممکن است تناژ های رنگ خیلی نزدیک به هم در بیاید و این تصور را ایجاد کند که رنگ ها یکی هستند. در چنین حالتی یک بار دیگر عملیات را تکرار کنید نوشته شده توسط هادی مردانیان - ساختمان داده دکتر منکرسی',
      icon: 'info',
      theme: 'Dark',
      confirmButtonText: 'متوجه شدم'
    }).then(result => {

    });
    
});
document.querySelector('#clear').addEventListener('click', function(event){
  
  counter = 65;
  graph.clear();  
  

});
G6.registerBehavior('click-add-node', {
getEvents(){
  return {
    'canvas:click': 'onClick'
  }
},
onClick(event){
  const self = this;
  const graph = self.graph;
  
  if(counter == 91){
    counter = 97;
  }
  if(counter == 123){
    
    Swal.fire({
      icon: 'error',
      title: 'اخطار',
      text: 'ظرفیت گراف تکمیل است',
      confirmButtonText: 'بستن'
    }).then(result => {

    });
    return;
  }
  graph.addItem('node', {
    id: `node-${counter}`,
    label: String.fromCharCode(counter),
    x: event.canvasX,
    y: event.canvasY,
    style:{
      fill: '#ddd'
    }
  });
  counter++;
}
});
G6.registerBehavior('click-remove', {
getEvents(){
  return {
    'node:click': 'remove',
    'edge:click': 'remove'
  }
},
remove(event){
  const self = this;
  const item = event.item;
  const graph = self.graph;

  graph.removeItem(item);
}
})
G6.registerBehavior('click-add-edge', {
getEvents() {
  return {
    'node:click': 'onClick',
    mousemove: 'onMousemove',
    'edge:click': 'onEdgeClick',
  };
},

onClick(ev) {
  const self = this;
  const node = ev.item;
  const graph = self.graph;
  
  const point = { x: ev.x, y: ev.y };
  const model = node.getModel();
  if (self.addingEdge && self.edge) {
    graph.updateItem(self.edge, {
      target: model.id,
    });

    self.edge = null;
    self.addingEdge = false;
  } else {
    
    self.edge = graph.addItem('edge', {
      source: model.id,
      target: model.id,
    });
    self.addingEdge = true;
  }
},

onMousemove(ev) {
  const self = this;
  const point = { x: ev.x, y: ev.y };
  if (self.addingEdge && self.edge) {
    self.graph.updateItem(self.edge, {
      target: point,
    });
  }
},
onEdgeClick(ev) {
  const self = this;
  const currentEdge = ev.item;
  if (self.addingEdge && (self.edge === currentEdge)) {
    self.graph.removeItem(self.edge);
    self.edge = null;
    self.addingEdge = false;
  }
},
});




document.querySelector('#makeGray').addEventListener('click', function(event){
const save = graph.save();
for(let item of save.nodes){
  item.style.fill = '#ddd';
}
graph.changeData(save);
});
document.querySelector('#makeColorfull').addEventListener('click', function(event){
const save = graph.save();
let usedColors = [];
let currentColor = null;

let currentNode = null;
let noneRelatedItems = [];
let subNodes = [];
let colored = [];
let checked = [];

if(save.nodes.length < 2){
  
    Swal.fire({
      title: 'اخطار',
      icon: 'error',
      text: 'گراف حداقل باید دو راس داشته باشد',
      confirmButtonText: 'بستن'
    }).then(result => {

    });
    
}else{
  console.log(save);
  for(let item of save.nodes){
    if(item.style.fill == '#ddd' && !colored.includes(item.id)){
      currentColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      if(usedColors.includes(currentColor)){
        while(usedColors.includes(currentColor)){
          currentColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
      }
      item.style.fill = currentColor;
      item.labelCfg.style.fill = '#fff';
      colored.push(item.id);
      currentNode = item;
      noneRelatedItems = getNoneRelatedNodes(currentNode, save.edges, save.nodes);
      
      let can = false;
      
      for(let NRI of noneRelatedItems){
        if(colored.includes(NRI)){
          continue;
        }
        can = false;
        
        let temp = getNoneRelatedNodes(graph.findById(NRI)._cfg, save.edges, save.nodes);
        console.log(NRI);
        // for(let c of checked){
        //   if(!temp.includes(c)){
        //     can = false;
        //     break;
        //   }
        // }
        let isIn = true;
        for(let index = 0; index < checked.length; index++){
          if(!temp.includes(checked[index])){
            isIn = false;
          }
        }
        if(checked.length === 0){
          can =true;
        }
        if(isIn){
          can = true;
        }
        if(can){
          graph.findById(NRI).get('model').style.fill = currentColor;
          graph.findById(NRI).get('model').labelCfg.style.fill = '#fff';
          colored.push(NRI);
          checked.push(NRI);
        }
        
      }
      usedColors.push(currentColor);
    }
    
    currentColor = null;
    currentNode = null;
    noneRelatedItems = [];
    subNodes = [];
    checked = [];
    
  }
  console.log(save);
  graph.changeData(save);
}
});
//=======================================functions===================================
function getNoneRelatedNodes(node, edges, nodes){
let noneRelatedNodes = [];
let array = [];

for(let item of nodes){
  if(!isConnectedToNode(node.id, item.id, edges)){
    array.push(item.id);
  }
}
noneRelatedNodes = array;
return noneRelatedNodes;
}



function isConnectedToNode(node1, node2, edges){
let result = null;
if(node1 == node2){
  return true;
}
for(let item of edges){
  if(item.source === node1){
    if(item.target === node2){
      return true;
    }
  }else if(item.target === node1){
    if(item.source === node2){
      return true;
    }
  }
}
return false;
}


function drawGraph(data){
  document.querySelector('#container').innerHTML = '';
  graph = new G6.Graph({
  container: 'container',
  width: 800,
  height: 500,

  modes:{
    default: ['drag-node'],
    addNode: ['click-add-node'],
    addEdge: ['click-add-edge'],
    remove: ['click-remove']
  },

  defaultNode:{
    shape: 'circle',
    size: [50],
    color: '#fff',
    style:{
      fill: '#bbb'
    },
    labelCfg:{
      style:{
        fill: '#555'
      }
    }
  },
  defaultEdge: {
    style: {
      stroke: '#888',
      lineWidth: 5,
      color: '#fff'
    },
  },
})
graph.data(data);
graph.render();
}