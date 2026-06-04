<template>
<div class="node-edit">
<el-container>
  <el-header class="header">
      
      <div class="instructions">
        <el-button @click="instructionsDialog = true" plain>Instructions</el-button>
      </div>
      <div>System Selected
          <el-select v-model="systype" value-key="sysID" :disabled="issysIDDisabled" placeholder="NONE Selected" style="width: 240px">
            <el-option
              v-for="item in systemType.slice(0,5)"
              :key="item.sysID"
              :label="item.label"
              :value="item"
            />
          </el-select>
      </div>
      <div>
        <h3>Systems Editor for MSFS 2024</h3>
        <div class="subtitle"><a href="https://github.com/ronh991/MSFS_Systems_Editor">github.com/ronh991/MSFS_Systems_Editor</a></div>
      </div>
      <div class="button-group">
        <el-button    @click="clearNodes">Clear Nodes</el-button>
        <el-button    @click="importDialog = true; importField = ''">Import</el-button>
        <el-button    @click="exportEditor">Export Nodes</el-button>
        <el-button    @click="exportConfig" type="primary">Export Config</el-button>
      </div>
  </el-header>
  <el-container class="container" >
    <el-aside width="250px" class="column sidebar">
        <ul>
            <li v-for="n in listNodes[ systype.sysID ]" :key="n" draggable="true" :data-node="n.item" :data-nodename="n.name" :data-sys=systype.sysID @dragstart="drag($event)" class="drag-drawflow" >
                <div class="node" :class="n.item" >{{ n.name }}</div>
            </li>
        </ul>
        <div class="node-list">
          <div v-for="list in nodesByType" :key="list.type" class="list">
            <span>{{list.name}}s:</span>
            <div v-for="node in list.nodes" :key="node" class="type-items">
              <div class="pan-to" @click="panToNode(node.id)" aria-><el-icon><View /></el-icon></div>
              <div v-if="node.data.itemname" class="node-name">{{node.data.itemname}}</div>
              <div v-else class="node-name">{{node.data.name}}</div>
            </div>
          </div>
          
          <div class="list">
            Lines:
            <div class="line-items" v-for="line in lineList" :key="line.Name">
              <div class="edit-line" :class="{active: line.data.itemname}" @click="showLine(line.name)"><el-icon><Setting /></el-icon></div>
              <div class="line-name">{{line.name}}</div>
            </div>
          </div>
        </div>
    </el-aside>
    <el-main>
        <div id="drawflow" @drop="drop($event)" @dragover="allowDrop($event)"></div>
    </el-main>
  </el-container>
</el-container>
  <el-dialog
    v-model="dialogVisible"
    title="Export Node Graph"
    width="60%"
  >
    <p>Backup or save node graph versions with this JSON data</p>
    <pre class="overflow"><code>{{dialogData}}</code></pre>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="() => {copyToClipboard(dialogData)}">Copy</el-button>
        <!-- <el-button @click="dialogVisible = false">Cancel</el-button> -->
        <el-button type="primary" @click="dialogVisible = false"
          >OK</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="clearConfirm"
    title="Clear All Nodes"
    width="500"
  >
    <span>Are you sure you want to remove all nodes?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clearConfirm = false">Cancel</el-button>
        <el-button type="primary" @click="clearNodes">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="importDialog"
    title="Import Data"
    width="500"
    @closed="closeImport"
  >
    <p>This will overwrite the current graph!</p>

    <div class="error" v-if="importError">{{importError}}</div>

    <span>Import MSFS Config - plain text example [FUEL_SYSTEM]</span>
    <el-form-item>
        <el-input v-model="importConfigField" :rows="6" type="textarea" placeholder="Paste Data" maxlength="15000"></el-input>
    </el-form-item>
    <el-button type="primary" @click="doConfigImport">
      Import MSFS Config
    </el-button>
    <br>
    <span>Import Node Graph - JSON nodes</span>
    <el-form-item>
        <el-input v-model="importField" :rows="6" type="textarea" placeholder="Paste Data"></el-input>
    </el-form-item>
    <el-button type="primary" @click="doImport(null)">
      Import Node Graph
    </el-button>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="importDialog = false">Cancel</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="instructionsDialog"
    title="Instructions"
    width="850"
  >
    <instructions :sysID=systype.sysID></instructions>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="instructionsDialog = false">Close</el-button>
      </div>
    </template>
  </el-dialog>
  <lineConfig :line-data="currentLine" :sysID=systype.sysID v-if="lineDialog" @update="lineDataUpdate" @closed="lineDialog = false"></lineConfig>
</div>
</template>

<script>

// import '../drawflow/drawflow.min.js'
import '../drawflow/drawflow.min.css'
import Drawflow from 'drawflow'
import '../assets/style.css' 
import { onMounted, shallowRef, h, getCurrentInstance, render, readonly, ref, computed, nextTick, useTemplateRef} from 'vue'
import Config from './config_io.js'
//import Helper from './helper.js'

// Common
import CurveNode from './nodes/CurveNode.vue'
import ConsumerCfgNode from './nodes/ConsumerCfgNode.vue'
import SupplierCfgNode from './nodes/SupplierCfgNode.vue'
import lineConfig from './nodes/lineConfig.vue'

//Fuel System - flightmodel.cfg
import fuelTankNode from './nodes/fuelTankNode.vue'
import fuelPumpNode from './nodes/fuelPumpNode.vue'
import fuelJunctionNode from './nodes/fuelJunctionNode.vue'
import fuelValveNode from './nodes/fuelValveNode.vue'
import fuelEngineNode from './nodes/fuelEngineNode.vue'
import fuelAPUNode from './nodes/fuelAPUNode.vue'
import fuelTriggerNode from './nodes/fuelTriggerNode.vue'
import fuelBurnerNode from './nodes/fuelBurnerNode.vue'
import fuelBurnerValveNode from './nodes/fuelBurnerValveNode.vue'
//import fuellineConfig from './nodes/fuelLineConfig.vue'

// Electrical System - systems.cfg
import elecCircuitNode from './nodes/elecCircuitNode.vue'
import elecBatteryNode from './nodes/elecBatteryNode.vue'
import elecExternalPowerNode from './nodes/elecExternalPowerNode.vue'
import elecGeneratorNode from './nodes/elecGeneratorNode.vue'
import elecBusNode from './nodes/elecBusNode.vue'
import elecRelayNode from './nodes/elecRelayNode.vue'
import elecConnectionNode from './nodes/elecConnectionNode.vue'
import elecBreakerNode from './nodes/elecBreakerNode.vue'
import elecTransformerNode from './nodes/elecTransformerNode.vue'
import elecDiodeNode from './nodes/elecDiodeNode.vue'

// Hydraulics System
import hydrReservoirNode from './nodes/hydrReservoirNode.vue'
import hydrPumpNode from './nodes/hydrPumpNode.vue'
import hydrPTUNode from './nodes/hydrPTUNode.vue'
import hydrJunctionNode from './nodes/hydrJunctionNode.vue'
import hydrActuatorNode from './nodes/hydrActuatorNode.vue'
import hydrAccumulatorNode from './nodes/hydrAccumulatorNode.vue'
import hydrTriggerNode from './nodes/hydrTriggerNode.vue'
import hydrValveNode from './nodes/hydrValveNode.vue'

// Pneumatics System
import pneuAPUNode from './nodes/pneuAPUNode.vue'
import pneuEngineNode from './nodes/pneuEngineNode.vue'
import pneuRamAirNode from './nodes/pneuRamAirNode.vue'
import pneuMixerUnitNode from './nodes/pneuMixerUnitNode.vue'
import pneuAreaNode from './nodes/pneuAreaNode.vue'
import pneuPackNode from './nodes/pneuPackNode.vue'
import pneuOutletNode from './nodes/pneuOutletNode.vue'
import pneuValveNode from './nodes/pneuValveNode.vue'
import pneuFanNode from './nodes/pneuFanNode.vue'
import pneuJunctionNode from './nodes/pneuJunctionNode.vue'

// Liquid Dropping - requires flight_model.cfg CP and reference_points.cfg Drop Doors
import liquTankNode from './nodes/liquTankNode.vue'
import liquDoorNode from './nodes/liquDoorNode.vue'
import liquScoopNode from './nodes/liquScoopNode.vue'

// Burner System - requires a Fuel System


import instructions from './instructions.vue'

export default {
  name: 'nodeEdit',
  components: {
    lineConfig,
    instructions,
  },
  setup() {
    // systemType Options
    const systemType = readonly([
    {
      sysname: 'Fuel',
      label: 'Fuel_System',
      version: 'Version = latest',
      sysID: 0,
    },
    {
      sysname: 'Elec',
      label: 'Electrical',
      version: 'Major = 2.2\nMinor = 1',
      sysID: 1,
    },
    {
      sysname: 'Hydr',
      label: 'Hydraulics_System_EX1',
      version: 'latest',
      sysID: 2,
    },
    {
      sysname: 'Pneu',
      label: 'Pneumatics_System_EX1',
      version: 'Version = 1',
      sysID: 3,
    },
    {
      sysname: 'Liqu',
      label: 'Liquid Dropping System',
      version: '',
      sysID: 4,
    },
    {
      sysname: 'Burn',
      label: 'Burner System',
      version: '',
      sysID: 5,
    },
  ])
  // list the available nodes and the input and output count
  const listNodes = readonly([ [
        {
            name: 'Tank',
            item: 'FTank',
            input:1,
            output:1,
        },
        {
            name: 'Pump',
            item: 'FPump',
            input:1,
            output:1,
        },
         {
            name: 'Junction',
            item: 'FJunction',
            input:1,
            output:1,
        },
         {
            name: 'FuelValve',
            item: 'FValve',
            input:1,
            output:1,
        }, 
        {
            name: 'Engine',
            item: 'FEngine',
            input:1,
            output:0,
        },
        {
            name: 'APU',
            item: 'FAPU',
            input:1,
            output:0,
        },        
        {
            name: 'Curve',
            item: 'Curve',
            input:0,
            output:0,
        },
        {
            name: 'Trigger',
            item: 'FTrigger',
            input:0,
            output:0,
        },                                
         {
            name: 'Burner',
            item: 'Burner',
            input:1,
            output:0,
        }, 
         {
            name: 'BurnerValve',
            item: 'BValve',
            input:1,
            output:1,
        }, 
    ],
  
    [
        {
            name: 'Circuit',
            item: 'Circuit',
            input:1,
            output:0,
        },
        {
            name: 'Battery',
            item: 'Battery',
            input:1,
            output:1,
        },
        {
            name: 'External Power',
            item: 'ExternalPower',
            input:0,
            output:1,
        },
        {
            name: 'Generator',
            item: 'Generator',
            input:0,
            output:1,
        },
        {
            name: 'Bus',
            item: 'Bus',
            input:1,
            output:1,
        },
        {
            name: 'Relay',
            item: 'Relay',
            input:0,
            output:0,
        },
        {
            name: 'SupplierCfg',
            item: 'SupplierCfg',
            input:0,
            output:0,
        },
        {
            name: 'ConsumerCfg',
            item: 'ConsumerCfg',
            input:0,
            output:0,
        },
        {
            name: 'Curve',
            item: 'Curve',
            input:0,
            output:0,
        },
        {
            name: 'Connection',
            item: 'Connection',
            input:0,
            output:0,
        },
        {
            name: 'Breaker',
            item: 'Breaker',
            input:0,
            output:0,
        },
        {
            name: 'Transformer',
            item: 'Transformer',
            input:0,
            output:0,
        },
        {
            name: 'Diode',
            item: 'Diode',
            input:0,
            output:0,
        },
    
    ],
  
    [
        {
            name: 'Reservoir',
            item: 'Reservoir',
            input:-1,
            output:1,
        },
        {
            name: 'Pump',
            item: 'HPump',
            input:1,
            output:1,
        },
        {
            name: 'PTU',
            item: 'PTU',
            input:2,
            output:4,
        },
        {
            name: 'Actuator',
            item: 'Actuator',
            input:1,
            output:0,
        },
        {
            name: 'Junction',
            item: 'HJunction',
            input:1,
            output:1,
        },
        {
            name: 'Trigger',
            item: 'HTrigger',
            input:0,
            output:0,
        },
        {
            name: 'Accumulator',
            item: 'Accumulator',
            input:0,
            output:0,
        },
        {
            name: 'Valve',
            item: 'HValve',
            input:0,
            output:0,
        },
    
    ],
  
    [
       {
            name: 'APU',
            item: 'PAPU',
            input:0,
            output:1,
        },
       {
            name: 'Engine',
            item: 'PEngine',
            input:0,
            output:1,
        },
       {
            name: 'RamAir',
            item: 'RamAir',
            input:0,
            output:1,
        },
       {
            name: 'Pack',
            item: 'Pack',
            input:1,
            output:1,
        },
       {
            name: 'MixerUnit',
            item: 'MixerUnit',
            input:1,
            output:1,
        },
       {
            name: 'Area',
            item: 'Area',
            input:1,
            output:0,
        },
       {
            name: 'Outlet',
            item: 'Outlet',
            input:0,
            output:0,
        },
       {
            name: 'Junction',
            item: 'PJunction',
            input:1,
            output:1,
        },
       {
            name: 'Valve',
            item: 'PValve',
            input:0,
            output:0,
        },
       {
            name: 'Fan',
            item: 'Fan',
            input:0,
            output:0,
        },
        {
            name: 'Curve',
            item: 'Curve',
            input:0,
            output:0,
        },
    
    ],
  
    [
          {
            name: 'Tank',
            item: 'LTank',
            input:0,
            output:1,
        },
        {
            name: 'Door',
            item: 'Door',
            input:0,
            output:0,
        },
        {
            name: 'Scoop',
            item: 'Scoop',
            input:0,
            output:0,
        },
        {
            name: 'Curve',
            item: 'Curve',
            input:0,
            output:0,
        },
    
    ],
  ]
)

   const editor = shallowRef({});
   const dialogVisible = ref(false);
   const dialogData = ref({});
   const connections = ref([]);
   const nodesByType = ref([]);
   // keep track of all lines 
   const lineList = ref([]);
   // keep track of line component node names
   const lineComponentNodeNamesList = ref([]);
   const clearConfirm = ref(false);
   const importDialog = ref(false);
   const lineDialog = ref(false);
   const importField = ref('');
   const importConfigField = ref('');
   const importError = ref('');
   const currentLine = ref({});
   const instructionsDialog = ref(false);
   const systype = ref({});
   const issysIDDisabled = ref(false);
//const sysID = ref(0);

   let lineListProperties = [];

   // prop test - for register in df
   
   //const test = 1;


   const config_io = new Config;
   //const helper = new Helper

   const Vue = { version: 3, h, render };
   const internalInstance = getCurrentInstance()
   internalInstance.appContext.app._context.config.globalProperties.$df = editor;

    function relayManagedLinesupdate(id) {
      const nodeGraph = editor.value.export();
      nodeGraph.lineProperties = lineListProperties;
    }

    function exportEditor() {
      setSavedState();
      const nodeGraph = editor.value.export();
      nodeGraph.lineProperties = lineListProperties;
      dialogData.value = {...nodeGraph}
      dialogVisible.value = true;
    }

    function exportConfig() {
      const exp = editor.value.export();
      const nodes = Object.values(exp.drawflow.Home.data);
      const lines = getConfigState();
      let nodeConfigtemp = config_io.convertNodes(nodes, lines, systype.value.sysID, systemType);
      const lineConfig = config_io.convertLines(lines, systype.value.sysID);
      // add lines first
      nodeConfigtemp = nodeConfigtemp + lineConfig;
      if (nodeConfigtemp.includes("Burner.1")) {
        nodeConfigtemp += config_io.convertBurnerNodes(nodes, lines, systype.value.sysID, systemType);
      }
      dialogData.value = JSON.stringify(getConfigState(), null, 2);
      dialogData.value = nodeConfigtemp;
      dialogVisible.value = true;
    }

    function clearNodes() {
      if (clearConfirm.value){
        editor.value.clear(); 
        systype.value = systemType[0];
        clearConfirm.value = false;
        issysIDDisabled.value = false;
        lineListProperties = [];
        setSavedState();
      } else {
        clearConfirm.value = true;
      }
    }

    function doImport(data) {
      if ((importField || data) && editor && editor.value) {
        const currentData = editor.value.export();
        try {
          const importData = data || JSON.parse(importField.value);
          // separate drawflow from line properties
          const lineProperties = importData.lineProperties;
          if (lineProperties) {
            lineListProperties = lineProperties;
          }
          editor.value.import(importData);
          importError.value = '';
          importDialog.value = false;
        } 
        catch (e) {
          editor.value.import(currentData);
          importError.value = 'Error importing data.' + e;
        }
      }
    }

    function doConfigImport() {
      if (importConfigField) {
        try {
          const fieldStr = importConfigField.value.replace('\"','');
          const result = config_io.importConfig(fieldStr, systype.value.sysID, systemType);
          importConfigField.value = '';
          doImport(result);
        }
        catch(e) {
          importError.value = 'Error importing data.' + e;
        }
      }
    }

    function closeImport() {
       importError.value = '';
    }

    function copyToClipboard(text) {
      const json = JSON.stringify(text);
      // const type = text.substring(0,1);
      navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
          const output = (typeof text === 'object') ? json : text;
          navigator.clipboard.writeText(output);
        }
      });
    }

    // Line code
    function showLine(lineName) {
      lineDialog.value = true;
      currentLine.value = getLineListProperties(lineName) || {itemname: lineName}
    }

    function getLineListProperties(lineName) {
      return lineListProperties.find(i => i.itemname === lineName);
    }

    function lineDataUpdate(lineData) {
      if (lineData.itemname) {
        let line = getLineListProperties(lineData.itemname);
        if (line) {
          line = {...lineData};
        } else {
          lineListProperties.push({...lineData});
        }
        currentLine.value = getLineListProperties(lineData.itemname);
        setSavedState();
      }
    }

    // draw code
    const drag = (ev) => {
      if (ev.type === "touchstart") {
        mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
      } else {
      ev.dataTransfer.effectAllowed = 'all';
      ev.dataTransfer.setData("node", ev.currentTarget.getAttribute('data-node'));
      ev.dataTransfer.setData("sys", ev.currentTarget.getAttribute('data-sys'));
      ev.dataTransfer.setData("nodename", ev.currentTarget.getAttribute('data-nodename'));
      }
    }

    const drop = (ev) => {
      if (ev.type === "touchend") {
        var parentdrawflow = document.elementFromPoint( mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
        var sysID = ev.dataTransfer.getData("sys");
        if(parentdrawflow != null) {
          addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY, sysID);
        }
        mobile_item_selec = '';
      } else {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("node");
        var sysID = ev.dataTransfer.getData("sys");
        var nodeName = ev.dataTransfer.getData("nodename")
        addNodeToDrawFlow(data, ev.clientX, ev.clientY, sysID, nodeName);
        issysIDDisabled.value = true;
      }

    }
    const allowDrop = (ev) => {
      ev.preventDefault();
    }

   let mobile_item_selec = '';
   let mobile_last_move = null;
   function positionMobile(ev) {
     mobile_last_move = ev;
   }

  function addNodeToDrawFlow(name, pos_x, pos_y, sysID, nodename) {
    pos_x = pos_x * ( editor.value.precanvas.clientWidth / (editor.value.precanvas.clientWidth * editor.value.zoom)) - (editor.value.precanvas.getBoundingClientRect().x * ( editor.value.precanvas.clientWidth / (editor.value.precanvas.clientWidth * editor.value.zoom)));
    pos_y = pos_y * ( editor.value.precanvas.clientHeight / (editor.value.precanvas.clientHeight * editor.value.zoom)) - (editor.value.precanvas.getBoundingClientRect().y * ( editor.value.precanvas.clientHeight / (editor.value.precanvas.clientHeight * editor.value.zoom)));
  
    const nodeSelected = listNodes[sysID].find(ele => ele.item == name);
    if (nodeSelected) {
      editor.value.addNode(nodename, nodeSelected.input,  nodeSelected.output, pos_x, pos_y, name, {}, name, 'vue');
    } else {
      console.error(`Node error: #{name}`);
    }
  }

  function panToNode(id) {
    const node = editor.value.getNodeFromId(id);
    if (!node) return
    const container = editor.value.container; // editor.container is the Drawflow element
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const currentScale = editor.value.zoom;
    const panX = (containerWidth / 2) - (node.pos_x * currentScale) - 300;
    const panY = (containerHeight / 2) - (node.pos_y * currentScale);
    editor.value.precanvas.style.transform = `translate(${panX}px, ${panY}px) scale(${currentScale})`;
    editor.value.canvas_x = panX;
    editor.value.canvas_y = panY;
  }

  // get node list by system - assume data pertains to only one selected system that the user is working on
  function getNodelist() {
    const exportdata = editor.value.export();
    return (exportdata && exportdata.drawflow && exportdata.drawflow.Home && Object.values(exportdata.drawflow.Home.data)) || [];
  }

  // get nodes by type
  function getNodesOfType(type) {
    if (editor && editor.value && editor.value.export) {
      const nodes = getNodelist();
      const nodeObjs = Object.keys(nodes).map((key) => nodes[key]);
      const typeNodes =  nodeObjs.values().filter(node => node.class === type);
      return typeNodes;
    }
    return [];
  }

  function getNextKey(val) {
    const keys = val.map(v => (v.data && v.data.index) || 1);
    const sortedArr = [...keys].sort((a, b) => a - b);
    let lowest = 1;
    for (let i = 1; i < sortedArr.length +1; i++) {
      if (sortedArr[i] === lowest) {
        lowest++;
      } else if (sortedArr[i] > lowest) {
        return lowest;
      }
    }
    return lowest;
  }

  function renumberNodes() {
    listNodes.forEach(type => {
      const nodes = getNodesOfType(type.name);
        nodes.forEach((node, index) => {
          const itemIndex = index +1;
          const dataNode = editor.value.getNodeFromId(node.id);
          editor.value.updateNodeDataFromId(node.id, {index: itemIndex});
      })
    })
  }

  // gets all MSFS nodes by system/type from the big list - associates it to drawflow node??
  function getNodesByTypes(sysid) {
    let output = [];
    if (listNodes[sysid]) {
      listNodes[sysid].forEach(t => {
        output.push({
          type: t.item, // was name
          nodes: getNodesOfType(t.item), // was name
          name: t.name // new added
        })
      })
    }
    return output;  
  }

  function setSavedState() {
    //if (editor !== undefined){
      const exportdata = editor.value.export();
      if (exportdata) {
        nodesByType.value = getNodesByTypes(systype.value.sysID);
        lineList.value = extractInputs();
        lineComponentNodeNamesList.value = getLineComponentNodeNames();
        // depends on system
        localStorage.setItem('fuelSystemLines', JSON.stringify(lineListProperties));
        localStorage.setItem('fuelSystemGraph', JSON.stringify(exportdata));
      }
      if (systype.value.sysID != null) {
        localStorage.setItem('fuelSystemType', JSON.stringify(systemType[systype.value.sysID]));
      }
    //}
  }

  // gets the lines data
  function getConfigState() {
    const exportdata = editor.value.export();
    let inputs = [];
    let outputs = [];
    let connectionsSet = new Set();
    Object.entries(exportdata.drawflow.Home.data).forEach(([key,node]) => {
      const inp = getConnections(node.inputs);
      inp.forEach( i => {
        const line1 = {
          source: i.node,
          dest: key,
        }
        inputs.push(line1);
        connectionsSet.add(`${i.node}:${key}`);
      });
      const out = getConnections(node.outputs);
      out.forEach( o => {
        const line2 = {
          source: key,
          dest: o.node,
        }
        outputs.push(line2);
        connectionsSet.add(`${key}:${o.node}`);
      });
    });
    const lines = extractInputs();
    return lines;
    // return Array.from(connectionsSet);
  }

  // drawflow node inputs and line data setup
  function extractInputs() {
    const exportdata = editor.value.export();
    const df = exportdata.drawflow.Home.data;
    let inputs = [];
    Object.entries(df).forEach(([key,node]) => {
      const inp = getConnections(node.inputs);
      inp.forEach( i => {
        const src = df[i.node];
        const srcName = src.data.itemname || src.data.name ;

        const nodeida = i.node+i.input;
        const nodeidz = key;

        const dest = df[key];
        const destName = dest.data.itemname || dest.data.name;
        const name = `${srcName}to${destName}`;
        const lineProperties = getLineListProperties(name) || {};

        // maybe a combo of start and end nodes as a key

        const line1 = {
          name:name,
          source: srcName, 
          destination: destName,
          index: inputs.length + 1,

          atozid: nodeida.toString() + "." + nodeidz.toString(),

          data: lineProperties,
          //linesysid: systype.value.sysID
        }
        inputs.push(line1);
      });
    });
    return inputs;
  }

  // drawflow connections - MSFS lines end points
  function getConnections(obj) {
    const connections = [];
    Object.entries(obj).forEach(([key, val]) => {
        if (val.connections && Array.isArray(val.connections)) {
            val.connections.forEach(connection => {
                if (connection.node) {
                    connections.push({
                        ...connection,
                    });                            
                } 
            });
        }
    });
    return connections;
  }

  // get linecomponent nodes - store names
  function getLineComponentNodeNames() {
    const exportdata = editor.value.export();
  }

  // initialize code in app
   onMounted(() => {

      // restore line properties from localStorage (localStorage is javascript method)
      // depends on system
      const savedLineProperties = localStorage.getItem('fuelSystemLines');
      var parsedLineProperties = '';
      if (savedLineProperties) {
        try{
          parsedLineProperties = JSON.parse(savedLineProperties);
          lineListProperties = parsedLineProperties.filter(i => i.itemname) || [];
        }
        catch {
          localStorage.setItem('fuelSystemLines', '');
        }
      }

      const savedSystemType = localStorage.getItem('fuelSystemType');
      if (savedSystemType) {
        const parsedSystemType = JSON.parse(savedSystemType);
        const savedsysID = parsedSystemType.sysID || 0;
        systype.value = systemType[savedsysID];
      }
      else {
        systype.value = systemType[0];
      }

      // set up event listeners on the graph
      var elements = document.getElementsByClassName('drag-drawflow');
      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('touchend', drop, false);
        elements[i].addEventListener('touchmove', positionMobile, false);
        elements[i].addEventListener('touchstart', drag, false );
      }
        
       const id = document.getElementById("drawflow");
       // Drawflow options
       editor.useuuid = true;

       editor.value = new Drawflow(id, Vue, internalInstance.appContext.app._context);

       //editor.value.addModule('MSFS_Systems');
       //editor.value.changeModule('MSFS_Systems');

       editor.value.start();
       //editor.value.zoom_min = 0.25;
       //editor.value.zoom_min = 2.0;
       editor.value.zoom = 0.75;
       editor.value.zoom_refresh();
            // const zoomAmount = response.data.data.zoom;

            // if (zoomAmount != 1.00) {
            //   this.editor.zoom_last_value = this.editor.zoom;
            //   this.editor.zoom = zoomAmount;
            //   this.editor.zoom_refresh();
            // }

       editor.value.registerNode('Curve', CurveNode, {}, {});

       // associate the Vue components to drawflow nodes
       editor.value.registerNode('FTank', fuelTankNode, {}, {});
       editor.value.registerNode('FPump', fuelPumpNode, {}, {});
       editor.value.registerNode('FJunction', fuelJunctionNode, {}, {});
       editor.value.registerNode('FValve', fuelValveNode, {}, {});
       editor.value.registerNode('FEngine', fuelEngineNode, {}, {});
       editor.value.registerNode('FAPU', fuelAPUNode, {}, {});
       editor.value.registerNode('FTrigger', fuelTriggerNode, {}, {});
       editor.value.registerNode('Burner', fuelBurnerNode, {}, {});
       editor.value.registerNode('BValve', fuelBurnerValveNode, {}, {});
       // Electrical
       editor.value.registerNode('Circuit', elecCircuitNode, {}, {});
       editor.value.registerNode('Battery', elecBatteryNode, {}, {});
       editor.value.registerNode('ExternalPower', elecExternalPowerNode, {}, {});
       editor.value.registerNode('Generator', elecGeneratorNode, {}, {});
       editor.value.registerNode('Bus', elecBusNode, {}, {});
       editor.value.registerNode('Relay', elecRelayNode, {lineList}, {});
       editor.value.registerNode('Breaker', elecBreakerNode, {}, {});
       editor.value.registerNode('Transformer', elecTransformerNode, {}, {});
       editor.value.registerNode('Diode', elecDiodeNode, {}, {});
       editor.value.registerNode('Connection', elecConnectionNode, {}, {});
       editor.value.registerNode('ConsumerCfg', ConsumerCfgNode, {}, {});
       editor.value.registerNode('SupplierCfg', SupplierCfgNode, {}, {});
       // Hydraulics
       editor.value.registerNode('Reservoir', hydrReservoirNode, {}, {});
       editor.value.registerNode('HPump', hydrPumpNode, {}, {});
       editor.value.registerNode('PTU', hydrPTUNode, {}, {});
       editor.value.registerNode('HJunction', hydrJunctionNode, {}, {});
       editor.value.registerNode('Actuator', hydrActuatorNode, {}, {});
       editor.value.registerNode('Accumulator', hydrAccumulatorNode, {}, {});
       editor.value.registerNode('HTrigger', hydrTriggerNode, {}, {});
       editor.value.registerNode('HValve', hydrValveNode, {}, {});
      // Pneumatics
       editor.value.registerNode('PAPU', pneuAPUNode, {}, {});
       editor.value.registerNode('PEngine', pneuEngineNode, {}, {});
       editor.value.registerNode('RamAir', pneuRamAirNode, {}, {});
       editor.value.registerNode('MixerUnit', pneuMixerUnitNode, {}, {});
       editor.value.registerNode('Area', pneuAreaNode, {}, {});
       editor.value.registerNode('Pack', pneuPackNode, {}, {});
       editor.value.registerNode('Outlet', pneuOutletNode, {}, {});
       editor.value.registerNode('PValve', pneuValveNode, {}, {});
       editor.value.registerNode('Fan', pneuFanNode, {}, {});
       editor.value.registerNode('PJunction', pneuJunctionNode, {lineList}, {});
      //Liquid Dropping System
       editor.value.registerNode('LTank', liquTankNode, {}, {});
       editor.value.registerNode('Door', liquDoorNode, {}, {});
       editor.value.registerNode('Scoop', liquScoopNode, {}, {});

      // after importing the node graph, save the state
      editor.value.on('import', function(id) { 
        // const importedData = editor.value.export();
        // console.error(importedData);
        setSavedState();
      });

      // restore graph data from localStorage
      const savedData = localStorage.getItem('fuelSystemGraph');
      if (savedData) {
        try{
          editor.value.import(JSON.parse(savedData));
        }
        catch(e){
          localStorage.setItem('fuelSystemGraph', '');
        }
        // console.error(savedData)
      }

      // if there are nodes diable the sysID dropdowm

      if (savedData.drawflow !== undefined) {
        issysIDDisabled.value = true;
      }

      // Restore the lineComponentNodeNames


      editor.value.on('nodeCreated', function(id) {
        const dataNode = editor.value.getNodeFromId(id);
        const alldfNodes = getNodelist();
        const typeNodes = alldfNodes.filter(node => node.class === dataNode.class);
        const nextIndex = getNextKey(typeNodes);
        const nextName = `${dataNode.name}.${nextIndex}`;
        editor.value.updateNodeDataFromId(dataNode.id, {index: nextIndex, name: nextName });
        lineComponentNodeNamesList.value = alldfNodes.filter(node => node.class === 'Breaker' || node.class === 'Transformer' || node.class === 'Diode');
        setSavedState();
      })
      editor.value.on('nodeDataChanged', function(id) {
        // Supplier,consumer name change - Gen, Cir, Bat, ExtPwr => suppliercfg consumercfg = already works
        // Cir, Gen, Bat, ExtPwr name change - line name already works, relay already works
        const alldfNodes = getNodelist();
        lineComponentNodeNamesList.value = alldfNodes.filter(node => node.class === 'Breaker' || node.class === 'Transformer' || node.class === 'Diode');
        setSavedState();
      })
      editor.value.on('nodeRemoved', function(id) {
        // check if relay - nothing
        // MSFS connection "node" - on lines remove connection "node" if found
        // BR,TR,DI "node" - remove component on MSFS connection
        // Supplier and Consumer "node" - remove supcfg, concfg from Gen, Cir, Bat and ExtPwr "nodes"
        const alldfNodes = getNodelist();
        lineComponentNodeNamesList.value = alldfNodes.filter(node => node.class === 'Breaker' || node.class === 'Transformer' || node.class === 'Diode');
        setSavedState();
      })
      editor.value.on('nodeMoved', function(id) {
        setSavedState();
      })      
      editor.value.on('connectionCreated', function(id) {
        setSavedState();
      })
      editor.value.on('connectionRemoved', function(id) {
        // relay - find all relays - remove managed line if found
        //relayManagedLinesupdate(id);
        setSavedState();
        lineDialog.value = false;
      })
      editor.value.on('connectionSelected', function(conn) {
        const outputNode = editor.value.getNodeFromId(conn.output_id);
        const inputNode = editor.value.getNodeFromId(conn.input_id);
        const lineName = `${outputNode.data.itemname}to${inputNode.data.itemname}`;
        showLine(lineName);
      })
      editor.value.on('moduleChanged', function(id) {
        let test = ' changed';
      })
      // for debugging
      window.editor = editor.value;
      setSavedState();
  })

  return {
    exportEditor, 
    exportConfig, 
    systemType, 
    systype,
    listNodes, 
    drag, 
    drop, 
    allowDrop, 
    dialogVisible, 
    dialogData, 
    getNodesOfType, 
    nodesByType, 
    lineList, 
    copyToClipboard, 
    clearNodes, 
    clearConfirm, 
    importDialog, 
    importField, 
    importConfigField, 
    doImport, 
    doConfigImport, 
    importError, 
    closeImport, 
    lineDialog, 
    showLine, 
    currentLine, 
    lineDataUpdate, 
    panToNode, 
    instructionsDialog,
    lineComponentNodeNamesList,
    issysIDDisabled,
  }

  }
}

</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #494949;
}
.container {
    min-height: calc(100vh - 100px);
}
.column {
    border-right: 1px solid #494949;
}
.column ul {
    padding-inline-start: 0px;
    padding: 10px 10px;
 
}
.column li {
    background: transparent;
}

.node {
    border-radius: 7px;
    border: 2px solid #494949;
    display: block;
    height:35px;
    line-height:25px;
    padding: 5px 10px;
    margin: 10px 0px;
    cursor: move;
    border-color: #494949 #111 #111 #494949;
}
.node.FTank, .node.LTank {
  background: var(--tank-color);
}
.node.RamAir {
  background: var(--ramair-color);
}
.node.Reservoir {
  background: var(--tank-color);
}
.node.MixerUnit {
  background: var(--mixerunit-color);
}
.node.FPump, .node.HPump{
  background: var(--pump-color);
}
.node.FJunction, .node.PJunction, .node.HJunction {
  background: var(--junction-color);
}
.node.FValve, .node.PValve, .node.HValve {
  background: var(--valve-color);
}
.node.FEngine, .node.PEngine {
  background: var(--engine-color);
}
.node.Area {
  background: var(--area-color);
}
.node.Accumulator {
  background: var(--accumulator-color);
}
.node.Actuator {
  background: var(--actuator-color);
}
.node.Curve {
  background: var(--curve-color);
}
.node.FAPU, .node.PAPU {
  background: var(--apu-color);
}
.node.PTU {
  background: var(--apu-color);
}
.node.FTrigger, .node.HTrigger {
  background: var(--trigger-color);
}
.node.Pack {
  background: var(--pack-color);
}
.node.Outlet {
  background: var(--outlet-color);
}
.node.Fan {
  background: var(--fan-color);
}
.node.Burner {
  background: var(--burner-color);
}
.node.BValve {
  background: var(--burnervalve-color);
}
.node.Circuit {
  background: var(--circuit-color);
}
.node.Battery {
  background: var(--battery-color);
}
.node.ExternalPower {
  background: var(--externalpower-color);
}
.node.Generator {
  background: var(--generator-color);
}
.node.Bus {
  background: var(--bus-color);
}
.node.Relay {
  background: var(--relay-color);
}
.node.SupplierCfg {
  background: var(--suppliercfg-color);
}
.node.ConsumerCfg {
  background: var(--consumercfg-color);
}
.node.Connection {
  background: var(--connection-color);
}
.node.Breaker {
  background: var(--breaker-color);
}
.node.Transformer {
  background: var(--transformer-color);
}
.node.Diode {
  background: var(--diode-color);
}
.node.Door {
  background: var(--transformer-color);
}
.node.Scoop {
  background: var(--breaker-color);
}


.error {
  color: #e60707;
  font-weight: bold;
}

.sidebar {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 100px);
  overflow: hidden;
}

.node-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  border-radius: 3px;
  margin-bottom: 12px;
  scrollbar-width: auto;
  scrollbar-color: #8c8c8c #383838;  
}

  node-list::-webkit-scrollbar {
    width: 16px;
  }
  node-list::-webkit-scrollbar-track {
    background: #383838;
  }
  node-list::-webkit-scrollbar-thumb {
    background-color: #8c8c8c;
    border-radius: 10px;
    border: 3px solid #121212;
  }


pre  {
  background: var(--gray);
  color: #E5E5E5;
  padding: 12px;
  max-height: 70vh;
}

pre code {
  font-family:  monospace; 
}

#drawflow {
  width: 100%;
  height: 100%;
  text-align: initial;
  background: #2b2c30;
  background-size: 20px 20px;
  background-image: radial-gradient(#494949 1px, transparent 1px);
  
}
</style>