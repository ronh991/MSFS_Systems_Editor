<template>
    <div ref="el" class="line-config">
        <div class="line-heading">{{itemname}}</div>
      <el-form
        label-width="auto"
      >
        <div v-if="linesysID == 0" id="fuelLine" ref="properties">   
            <el-form-item label="Fuel Flow 1psi" label-position="left">
                <el-input v-model="fuelFlow" df-fuelflow size="small" @change="update"></el-input>
            </el-form-item>
            <el-form-item label="Volume" label-position="left">
                <el-input v-model="volume" df-volume size="small" @change="update"></el-input>
            </el-form-item> 
            <el-form-item label="Gravity Flow" label-position="left">
                <el-input v-model="gravityFlow" df-gravityflow size="small" @change="update"></el-input>
            </el-form-item>
        </div>
        <div v-if="linesysID == 1" id="electricLine" ref="properties">   
            <el-form-item label="Connection" label-position="left">
                <el-select
                  v-model="lineconnection"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-lineconnection
                  @change="update"
                >
                  <el-option
                    v-for="item in lineConnectionList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Components" label-position="left" size="small">
                <el-select
                v-model="connectioncomponentlist"               
                placeholder="Select"
                style="width: 100%"
                size="small"
                @change="update"
                clearable
                multiple
                df-connectioncomponentlist
                value-key="nodeid"
                >
                <el-option
                    v-for="item in lineComponentList"
                    :key="item.nodeid"
                    :label="item.name"
                    :value="item"
                />
                </el-select>
            </el-form-item>
            <el-form-item label="Wear & Tear" label-position="left">
                <el-input v-model="eleclinewearandtear" df-eleclinewearandtear size="small" type="textarea" :rows="3" @change="update"></el-input>
            </el-form-item>
        </div>
        <div v-if="linesysID == 2" id="hydraulicLine" ref="properties">   
            <el-form-item label="Inputs" label-position="left">
                <el-input v-model="lineinputs" df-lineinputs size="small" @change="update" disabled type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="Outputs" label-position="left">
                <el-input v-model="lineoutputs" df-lineoutputs size="small" @change="update" disabled type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="Accumulator" label-position="left">
                <el-select
                  v-model="hydraccumulatorcomponent"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-hydraccumulatorcomponent
                  @change="update"
                >
                  <el-option
                    v-for="item in hydraccumulatorComponentList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Valves" label-position="left">
                <el-select
                  v-model="hydrvalvecomponent"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-hydrvalvecomponent
                  multiple
                  @change="update"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in hydrvalveComponentList"
                    :key="item.nodeid"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Non Ret" label-position="left">
                  <el-switch
                    v-model="hydrlinenonreturn"
                    @change="update"
                    df-hydrlinenonreturn
                    class="ml-2"
                    style="--el-switch-on-color: #7f449e; --el-switch-off-color: #737373"
                  />
            </el-form-item>
            <el-form-item label="Wear & Tear" label-position="left">
                <el-input v-model="hydrlinewearandtear" df-hydrlinewearandtear size="small" type="textarea" :rows="3" @change="update"></el-input>
            </el-form-item>
        
        </div>    
        <div v-if="linesysID == 3" id="pneumaticLine" ref="properties">   
            <el-form-item label="Inputs" label-position="left">
                <el-input v-model="linesource" df-linesource size="small" @change="update" disabled ></el-input>
            </el-form-item>
            <el-form-item label="Outputs" label-position="left">
                <el-input v-model="linedest" df-linedest size="small" @change="update" disabled ></el-input>
            </el-form-item>
            <el-form-item label="Max Flow" label-position="left">
                <el-input v-model="pneumaxflow" df-pneumaxflow size="small" @change="update"></el-input>
            </el-form-item>
            <el-form-item label="Valves" label-position="left" size="small">
                <el-select
                v-model="pneuvalvecomponent"               
                placeholder="Select"
                style="width: 100%"
                size="small"
                @change="update"
                clearable
                multiple
                df-pneuvalvecomponent
                value-key="nodeid"
                >
                <el-option
                    v-for="item in pneuvalveComponentList"
                    :key="item.nodeid"
                    :label="item.name"
                    :value="item"
                />
                </el-select>
            </el-form-item>
            <el-form-item label="Fan" label-position="left">
                <el-select
                  v-model="pneufan"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-pneufan
                  @change="update"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in pneufanComponentList"
                    :key="item.nodeid"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Volume" label-position="left">
                <el-input v-model="pneuvolume" df-pneuvolume size="small" @change="update"></el-input>
            </el-form-item>
        
        </div>    
        </el-form>
        <div class="button-bar">
            <el-button plain @click="closeDialog">OK</el-button>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, watchEffect } from 'vue'
import Helper from '../helper.js'
//import { inject } from 'vue';

export default {
    props: [
        'lineData',
        'sysID'
    ],
    emits: ['update', 'closed'],
    setup(props, { emit }) {
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        //const dataNode = ref({});
        const dataModel = ref({});
        const itemname = ref('');
        //Fuel
        const fuelFlow = ref('0');
        const volume = ref('0');
        const gravityFlow = ref('0');
        // Electrical
        const lineconnection = ref({});
        const connectioncomponentlist = ref([])
        const lineConnectionList = ref([]);
        const lineComponentList = ref([]);
        const eleclinewearandtear = ref('');
        // Hydraulic
        const lineinputs = ref({});
        const lineoutputs = ref({});
        const hydraccumulatorComponentList = ref([]);
        const hydraccumulatorcomponent = ref({});
        const hydrPTUComponentList = ref([]);
        const hydrvalveComponentList = ref([]);
        const hydrvalvecomponent = ref([]);
        const hydrlinenonreturn = ref(false);
        const hydrlinewearandtear = ref('');
        // Pneumatic
        const linesource = ref();
        const linedest = ref();
        const pneumaxflow = ref();
        const pneuvalveComponentList = ref([]);
        const pneuvalvecomponent = ref([]);
        const pneufanComponentList = ref();
        const pneufan = ref();
        const pneuvolume = ref();
        // Liquid
        //no lines

        const linesysID = ref(0);

        const helper = new Helper;

        // Grab the global emitter instance
//        const emitter = inject('emitter')

        const PTUinputnames = readonly([
            'MotorInput',
            'PumpInput',
        ]);

        const PTUoutputnames = readonly([
            'MotorOutput',
            'MotorRelief',
            'PumpOutput',
            'PumpRelief',
        ]);

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        // Electrical
        const getlineConnections = () => {
            const exportdata = df.export();
            const lineconns = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Connection');
            if (lineconns) {
                lineConnectionList.value = lineconns.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.data.id}));
            }
        }

        // const setlineComponentOption = () => {
        //     nextTick( () => {
        //         dataModel.value.connectioncomponentlist = connectioncomponentlist;
        //     });
        // }

        const getlineComponentList = () => {
            const exportdata = df.export();
            const linecomponents = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Breaker' || node.class === 'Transformer' || node.class === 'Diode');
            if (linecomponents) {
                lineComponentList.value = linecomponents.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
        }

        // Hydraulics
        const gethydrlineValveList = () => {
            const exportdata = df.export();
            const linevalvecomponents = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'HValve');
            if (linevalvecomponents) {
                hydrvalveComponentList.value = linevalvecomponents.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
        }

        const gethydrlineAccumulatorList = () => {
            const exportdata = df.export();
            const lineaccumulatorcomponents = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Accumulator');
            if (lineaccumulatorcomponents) {
                hydraccumulatorComponentList.value = lineaccumulatorcomponents.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
        }

        const gethydrlineData = () => {
            // if (!df.data) return { connections: [] };
            const exportdata = df.export();

            // line has end points. add in combine node and separate node
            // combine has a name and one/many in one out
            // separate has name and one in and one/many out

            // linedata needs a showinList bool

            // if connected to a combine/separate then showinList=false

            // line data name is name of combiner + to + name of separate



            if(dataModel.value.itemname !== undefined)  {
                const linenodenames = dataModel.value.itemname.split("To");

                // for all other hydralic lines
                lineinputs.value = [];
                lineoutputs.value = [];
                const linecomponents =  Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class !== '');
                if (linecomponents.length > 0) {
                    hydrPTUComponentList.value = linecomponents.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id, class: c.class}));
                    const result = Object.entries(hydrPTUComponentList.value).filter(([key, value]) => (value.name == linenodenames[0] || value.name == linenodenames[1]))
                    if (result !== undefined) {
                        if (result.length > 0) {
                            //need to loop all results
                            result.forEach((r) => {
                                if (r[1].class !== 'PTU' && r[1].class !== 'HCombiner' && r[1].class !== 'HSeparator') {
                                    const selfCon0 = getConnections(r[1].nodeid);
                                    if (selfCon0.connections.length > 0) {
                                        selfCon0.connections.forEach((c) => {
                                            if (dataModel.value.itemname === c.name) {
                                                if(c.inputname !== '') {
                                                    lineoutputs.value = [c.inputname, ...lineoutputs.value];
                                                }
                                                if(c.outputname !== '') {
                                                    lineinputs.value = [c.outputname, ...lineinputs.value];
                                                }
                                            }
                                        });
                                    }
                                }
                                // PTU
                                if (r[1].class === 'PTU') {
                                    const selfCon0 = getConnections(r[1].nodeid);
                                    if (selfCon0.connections.length > 0) {
                                        selfCon0.connections.forEach((c) => {
                                            if (dataModel.value.itemname === c.name) {
                                                if(c.inputname !== '') {
                                                    lineoutputs.value = [c.inputname, ...lineoutputs.value];
                                                }
                                                if(c.outputname !== '') {
                                                    lineinputs.value = [c.outputname, ...lineinputs.value];
                                                }
                                            }
                                        });
                                    }
                                }
                                // Combiner and Separator
                                if (r[1].class === 'HCombiner' || r[1].class === 'HSeparator') {
                                    const selfCon0 = getConnections(r[1].nodeid);
                                    if (selfCon0.connections.length > 0) {

                                        // do the Combiner input values
                                        let templineinputs = [];
                                        let templineoutputs = [];
                                        // for a combiner then the inputs are from the nodes attached to the combiner input
                                        // check if combiner
                                        if (r[1].class === 'HCombiner') {
                                            // don't want the combiner separator link
                                            Object.entries(selfCon0.connections).forEach(([ioKey, ioValue]) => {if (ioValue.inputname !== '' && df.getNodeFromId(ioValue.node).class !== 'HSeparator') 
                                                { templineinputs.push({name: ioValue.name, node: ioValue.node, input: ioValue.input, class: df.getNodeFromId(ioValue.node).class})
                                            }});
                                            templineinputs.forEach((t) => {
                                                const selfCon1 = getConnections(t.node);
                                                if (selfCon1.connections.length > 0) {
                                                    selfCon1.connections.forEach((c) => {
                                                        if (t.name === c.name) {
                                                            if(c.inputname !== '') {
                                                                lineoutputs.value = [c.inputname, ...lineoutputs.value];
                                                            }
                                                            if(c.outputname !== '') {
                                                                lineinputs.value = [c.outputname, ...lineinputs.value];
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        if (r[1].class === 'HSeparator') {
                                            // don't want the combiner separator link
                                            Object.entries(selfCon0.connections).forEach(([ioKey, ioValue]) => {if (ioValue.outputname !== '' && df.getNodeFromId(ioValue.node).class !== 'HCombiner') 
                                                { templineoutputs.push({name: ioValue.name, node: ioValue.node, input: ioValue.input, class: df.getNodeFromId(ioValue.node).class})
                                            }});
                                            templineoutputs.forEach((t) => {
                                                const selfCon1 = getConnections(t.node);
                                                if (selfCon1.connections.length > 0) {
                                                    selfCon1.connections.forEach((c) => {
                                                        if (t.name === c.name) {
                                                            if(c.inputname !== '') {
                                                                lineoutputs.value = [c.inputname, ...lineoutputs.value];
                                                            }
                                                            if(c.outputname !== '') {
                                                                lineinputs.value = [c.outputname, ...lineinputs.value];
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
                //update();
            }
        }

        const getConnections = (id) => {
            // if (!df.data) return { connections: [] };
            const selfNode = df.getNodeFromId(id);
            const isPTU = selfNode.class === 'PTU';
            const selfName = selfNode.data.itemname || selfNode.data.name;
            const io = {...selfNode.inputs, ...selfNode.outputs};
            const connections = [];
            let inputCount = 0;
            let inputsUsed = 0;
            let outputCount = 0;
            let outputsUsed = 0;            
            Object.entries(io).forEach(([ioKey, ioValue]) => {
                if (ioValue.connections && Array.isArray(ioValue.connections)) {
                    // for PTU
                    if (isPTU) {
                        ioValue.connections.forEach(connection => {
                            if (connection.node) {
                                const isInput = ioKey.indexOf('input') != -1;
                                const isInput1 = ioKey.indexOf('input_1') != -1;
                                const isInput2 = ioKey.indexOf('input_2') != -1;
                                const isOutput1 = ioKey.indexOf('output_1') != -1;
                                const isOutput2 = ioKey.indexOf('output_2') != -1;
                                const isOutput3 = ioKey.indexOf('output_3') != -1;
                                const isOutput4 = ioKey.indexOf('output_4') != -1;
                                const ioNode = df.getNodeFromId(connection.node);
                                const nodeName = ioNode.data.itemname || ioNode.data.name;
                                connections.push({
                                    name: isInput ? `${nodeName}_To_${selfName}` : `${selfName}_To_${nodeName}`,
                                    inputname: isInput1 ? `${selfName}.MotorInput` : isInput2 ? `${selfName}.PumpInput` : '',
                                    outputname: isOutput1 ? `${selfName}.MotorOutput` : isOutput2 ? `${selfName}.MotorRelief` : isOutput3 ? `${selfName}.PumpOutput` : isOutput4 ? `${selfName}.PumpRelief` : '',
                                    ...connection,
                                });
                            } 
                        });
                    }

                    // For nonPTU
                    else {
                        ioValue.connections.forEach(connection => {
                            if (connection.node) {
                                const isInput = ioKey.indexOf('input') != -1;
                                const ioNode = df.getNodeFromId(connection.node);
                                const nodeName = ioNode.data.itemname || ioNode.data.name;
                                // if an input then this is end point of connection set outputname
                                connections.push({
                                    name: isInput ? `${nodeName}_To_${selfName}` : `${selfName}_To_${nodeName}`,
                                    inputname: isInput ? `${selfName}` : '',
                                    outputname: !isInput ? `${selfName}` : '',
                                    ...connection,
                                });
                            } 
                        });
                    }
                }
            });
            const obj = {
                connections,
            }
            // console.error(obj);
            return obj;
        }

        //Pneumatics
        const getpneulineValveList = () => {
            const exportdata = df.export();
            const linevalvecomponents = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'PValve');
            if (linevalvecomponents) {
                pneuvalveComponentList.value = linevalvecomponents.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
        }

        const getpneulineFanList = () => {
            const exportdata = df.export();
            const linefancomponents = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Fan');
            if (linefancomponents) {
                pneufanComponentList.value = linefancomponents.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
        }
        const getpneulineData = () => {
            // if (!df.data) return { connections: [] };
            const exportdata = df.export();
            if(dataModel.value.itemname !== undefined)  {
                const linenodenames = dataModel.value.itemname.split("To");

                // for all other hydralic lines
                linesource.value = [];
                linedest.value = [];
                const linecomponents =  Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class !== '');
                if (linecomponents.length > 0) {
                    const result = Object.entries(linecomponents.value).filter(([key, value]) => (value.name == linenodenames[0] || value.name == linenodenames[1]))
                    if (result !== undefined) {
                        if (result.length > 0) {
                            //need to loop all results
                            result.forEach((r) => {
                                //if (r[1].class !== 'PTU' && r[1].class !== 'HCombiner' && r[1].class !== 'HSeparator') {
                                    const selfCon0 = getConnections(r[1].nodeid);
                                    if (selfCon0.connections.length > 0) {
                                        selfCon0.connections.forEach((c) => {
                                            if (dataModel.value.itemname === c.name) {
                                                if(c.inputname !== '') {
                                                    linedest.value = [c.inputname, ...linedest.value];
                                                }
                                                if(c.outputname !== '') {
                                                    linesource.value = [c.outputname, ...linesource.value];
                                                }
                                            }
                                        });
                                    }
                                //}
                            });
                        }
                    }
                }
            }
        }

        watchEffect(() => {
            dataModel.value = props.lineData;
            itemname.value = dataModel.value.itemname || 'Unknown Line';
            linesysID.value  = props.sysID;          
            //Hyraulic
            if (props.sysID === 0) {
                // Fuel
                fuelFlow.value = dataModel.value.fuelflow || '';
                volume.value = dataModel.value.volume || '' || '';
                gravityFlow.value = dataModel.value.gravityflow || '';
            }
            if (props.sysID === 1) {
                // Electrical
                getlineConnections();
                getlineComponentList()
                lineconnection.value = dataModel.value.lineconnection || '';
                connectioncomponentlist.value = dataModel.value.connectioncomponentlist || '';
                eleclinewearandtear.value = dataModel.value.eleclinewearandtear || '';
            }
            if (props.sysID === 2) {
                gethydrlineValveList();
                gethydrlineAccumulatorList();
                gethydrlineData();
                // was already updated in gethydrlinelist
                lineinputs.value = dataModel.value.lineinputs || '';
                lineoutputs.value = dataModel.value.lineoutputs || '';
                hydraccumulatorcomponent.value = dataModel.value.hydraccumulatorcomponent || '';
                hydrvalvecomponent.value = dataModel.value.hydrvalvecomponent || '';
                hydrlinenonreturn.value = dataModel.value.hydrlinenonreturn || false;
                hydrlinewearandtear.value = dataModel.value.hydrlinewearandtear || '';
            }
            if (props.sysID === 3) {
                linesource.value = dataModel.value.linesource || '';
                linedest.value = dataModel.value.linedest || '';
                pneumaxflow.value = dataModel.value.pneumaxflow || '';
                pneufan.value = dataModel.value.pneufan || '';
                pneuvolume.value = dataModel.value.pneuvolume || '';
                pneuvalvecomponent.value = dataModel.value.pneuvalvecomponent || '';
                getpneulineValveList();
                getpneulineFanList();
            }
            // no liquid lines

        });

        function closeDialog() {
            emit('closed');
        }

        function update() {
            dataModel.value.itemname = itemname.value;
            // Fuel
            dataModel.value.fuelflow = fuelFlow.value;
            dataModel.value.volume = volume.value;
            dataModel.value.gravityflow = gravityFlow.value;
            // Electrical
            dataModel.value.lineconnection = lineconnection.value;
            dataModel.value.connectioncomponentlist = connectioncomponentlist.value;
            dataModel.value.eleclinewearandtear = eleclinewearandtear.value;
            // Hydraulic
            dataModel.value.lineinputs = lineinputs.value;
            dataModel.value.lineoutputs = lineoutputs.value;
            dataModel.value.hydraccumulatorcomponent = hydraccumulatorcomponent.value;
            dataModel.value.hydrvalvecomponent = hydrvalvecomponent.value;
            dataModel.value.hydrlinenonreturn = hydrlinenonreturn.value;
            dataModel.value.hydrlinewearandtear = hydrlinewearandtear.value;
            //Pneumatic
            dataModel.value.linesource = linesource.value;
            dataModel.value.linedest = linedest.value;
            dataModel.value.pneumaxflow = pneumaxflow.value;
            dataModel.value.pneufan = pneufan.value;
            dataModel.value.pneuvolume = pneuvolume.value;
            dataModel.value.pneuvalvecomponent = pneuvalvecomponent.value;
            //Liquid
            //none

            dataModel.value.linesysid = linesysID.value;
            emit('update', dataModel.value);
        }
        // onMounted(async () => {
        //     await nextTick()
        //     //df.on('nodeDataChanged', update);           

        //     // populate data
        //     hydrvalvecomponentlist.value = dataModel.value.hydrvalvecomponentlist;
        //     pneuvalvecomponentlist.value = dataModel.value.pneuvalvecomponentlist;
        //     lineinputs.value = dataModel.value.lineinputs;
        //     lineoutputs.value = dataModel.value.lineoutputs;
        //     //eleclinewearandtear.value = dataModel.value.eleclinewearandtear;
        //     //hydrlinewearandtear.value = dataModel.value.hydrlinewearandtear;

        //     helper.checklinemultiselected(dataModel.value.hydrvalvecomponentlist, hydrvalveComponentList, hydrvalvecomponentlist, df, { ...dataModel.value, hydrvalvecomponentlist:  hydrvalvecomponentlist.value }, dataModel);
        //     helper.checklinemultiselected(dataModel.value.pneuvalvecomponentlist, pneuvalveComponentList, pneuvalvecomponentlist, df, { ...dataModel.value, pneuvalvecomponentlist:  pneuvalvecomponentlist.value }, dataModel);
        // });

        return {
            el, itemname, linesysID, fuelFlow, volume, gravityFlow, 
            lineconnection, connectioncomponentlist, lineConnectionList, lineComponentList, lineinputs, 
            lineoutputs, eleclinewearandtear,
            hydraccumulatorcomponent, hydrvalvecomponent, hydrPTUComponentList, hydraccumulatorComponentList, hydrvalveComponentList, hydrlinenonreturn, hydrlinewearandtear, 
            linesource, linedest, pneumaxflow, pneuvalvecomponent, pneufan, pneuvolume, pneufanComponentList, pneuvalveComponentList,
            dataModel,
            update, closeDialog, 
            getlineComponentList, getpneulineValveList, gethydrlineValveList, gethydrlineAccumulatorList, gethydrlineData
        }
    }    
}
</script>
