<template>
<div class="instructions">
  <h2><strong>Overview</strong></h2>

  <p>The purpose of this app is to aid in developing the configuration for systems in Microsoft Flight Simulator (MSFS)*. The systems can have many parts that are interconnected and having a node-based editor can be easier to manage than keeping track of a text-only configuration.</p>

  <p>* This project is not affiliated with Microsoft</p>

  <p>When you have connected the nodes as desired and filled in the properties, you can export the text configuration to use in your aircraft projects.</p>

  <p>For a detailed explanation of all the nodes and available properties, see the official documentation here: 

    <a href="https://docs.flightsimulator.com/msfs2024/html/5_Content_Configuration/CFG_Files/flight_model_cfg.htm#FUEL_SYSTEM">docs.flightsimulator.com (flight_model.cfg)</a>
  </p>
  <p>

    <a href="https://docs.flightsimulator.com/msfs2024/html/5_Content_Configuration/CFG_Files/systems_cfg.htm#FUEL_SYSTEM">docs.flightsimulator.com (systems.cfg)</a>
  </p>

  <p>It is possible that future versions of MSFS will change some system properties. I hope to update the app to match changes. But this project is also available as open source: <a href="https://github.com/ronh991/MSFS_Systems_Editor">github.com/ronh991/MSFS_Fuel_System_Editor</a></p>

  <h2><strong>User Interface</strong></h2>

  <p>The sidebar on the left contains a list of the available nodes. Drag these onto the main graph area to place a node. To delete a node, highlight it and press the delete key.</p>

  <p>As you add nodes to the graph, they will appear in a list in the sidebar. The nodes will get named automatically but most node types have a Name property where you can enter a unique name. This name is used as a reference to the part so it should not contain spaces or other special characters.</p>

  <p>Most nodes have connection points to connect to other nodes. These are shown as circles on the sides of the node. Drag a line between the output of one node to the input of another to create a line. Lines are also saved into the fuel system configuration which is one of the automations this tool provides.</p>

  <p>To pan the main graph, use right-click and drag in the background or middle-click and drag. To zoom, hold ctrl and scroll the mouse wheel. </p>

  <h2><strong>Node Properties and Connections</strong></h2>

  <p>To understand the purpose of the node properties, you will need to refer to the <a href="https://docs.flightsimulator.com/msfs2024/html/5_Content_Configuration/CFG_Files/flight_model_cfg.htm#FUEL_SYSTEM"> Fuel System Official Documentation</a> and <a href="https://docs.flightsimulator.com/msfs2024/html/5_Content_Configuration/CFG_Files/systems_cfg.htm"> Systems.cfg Systems Official Documentation</a> but some the following nodes have some special features requiring explanation.</p>

  <div v-if="linesysID == 0">

  <p>The Junction node is the only node that can have multiple connections into or out of it. ALL other nodes can have at most one input and one ouput. The interface does allows you to connect two lines into one input but this will not create a valid final output.</p>

  <p>When you connect to the input of a Junction, it will create a new input port and continue to do so for as many inputs as needed. The same is true for ouputs.</p>

  <p>The Options property of the Junction node allows you to join any inputs to ouputs and also switch which groups are used at a time. These are select drop-downs listing all the connected lines.</p>

  <p>Each line can be configured to be one-way flow. When unchecked, fuel can flow between lines.</p>

  </div>

  <div  v-if="linesysID == 1">

  <p>The Bus node is the only node that can have multiple connections into or out of it. ALL other nodes can have at most one input and one ouput. The interface does allows you to connect two lines into one input but this will not create a valid final output.</p>

  <p>When you connect to the input of a Bus, it will create a new input port and continue to do so for as many inputs as needed. The same is true for ouputs.</p>

  <p>Nodes without an input or output are used in other nodes and can be selected as components in Connection nodes.  These are typically Breaker, Transformer, Diodes and Relays</p>

  </div>

  <div  v-if="linesysID == 0 || linesysID == 1 || linesysID == 2 ">

  <p>The Curve node requires a formatted property. The Params expects a list of x:y coordinates. (<code>0:0, 0.5:0.5, 1:1</code>). If you enter a valid list of coordinates, it should draw a representation of that curve. The Curve node does not have a line connection, it is referenced in a Pump node.</p>

  </div>

  <div>

  <br/>

  <p>Lines use a special handling routine. The get automatically created as you connect nodes and their name will update as you change the node Names. Lines can have properties and these are accessed by clicking a line or the gear icon in the list to open a sidebar popup. These properties are specific to the exact Line name so if you rename a node, you will not need to reenter the properties. (Caution - Verify each Line). </p>
<br/>
  <p>Ensure you read the SDK pertaining to the system you have selected. There are numerous differences between systems and how they are exported to the cfg files. </p>

  <br/>
  </div>

  <div  v-if="linesysID == 2 ">

  <p> Input and Output node names are automatically set in the Lines data. Hydraulics lines are a special line set-up.  Two Black-Box nodes - Combiner and Separator are used to combine lines together from many nodes (Pumps, Junctions and Reservoirs) and then separate them out to many nodes (Actuators, Junctions).  These nodes will not appear in the cfg export and are used to merge lines together and help with Line naming for multi-node naming. Only the Combiner-Separator line is show in the list.  You add any data required for ALL those lines in that line data dialog. </p>
  
  <br />
  <p>PTU - Power Transfer Unit nodes are set with specific node inputs (Pump Input (PI), Motor Input(MI)) and outputs (Pump Output(PO), Pump Relief(PR), Motor Output(MO) and Motor Relief(MR)) - see the SDK for more information on PTU's</p>
</div>

  <h2><strong>Import, Export and Saving</strong></h2>

  <p>You can export two types of data. Nodes or Config. Nodes contains all of the node graph data including positions and is used to save your work. The Config export is what you will copy and paste into the flight_model.cfg file in your MSFS project.</p>

  <p>The graph is autosaved to your browser's localStorage so refreshing the page or returning from a bookmark should restore your last working state.</p>

  <p>The Import dialog offers a place to paste either a Node type or Config type block of text. When you import a Config block, the nodes will be connected but the order and position will requires some re-positioning to be more useful.</p>

  <p>ronh991 GS614</p> 


</div>
</template>
<script>

import '../assets/style.css' 
import { defineComponent, h, onMounted, render, ref, nextTick, watchEffect, } from 'vue'


export default {
  props: [
      'sysID'
  ],
  name: 'instructions',
  setup(props) {
    const linesysID = ref(0);
    const name = ref('instructions')

    watchEffect(() => {
        linesysID.value  = props.sysID;          

    });
    
    onMounted(async () => {
        await nextTick()
        linesysID.value  = props.sysID;          
    });

    return { linesysID

    }
  }
}

</script>
<style scoped>
  .instructions {
    padding: 0 64px 36px;
  }
  .instructions h2 {
    font-size: 20px;
    margin-top: 1.4em;
    margin-bottom: 0.5em;
  }

  .instructions > p {
    margin-bottom: 1.4em;
  }

</style>