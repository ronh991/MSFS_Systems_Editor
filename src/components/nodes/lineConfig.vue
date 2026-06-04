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
                    :value="item.name"
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
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                />
                </el-select>
            </el-form-item>
        </div>
        <div v-if="linesysID == 2" id="hydraulicLine" ref="properties">   
            <el-form-item label="Inputs" label-position="left">
                <el-input v-model="lineinputs" df-lineinputs size="small" @change="update"></el-input>
            </el-form-item>
            <el-form-item label="Outputs" label-position="left">
                <el-input v-model="lineoutputs" df-lineoutputs size="small" @change="update"></el-input>
            </el-form-item>
            <el-form-item label="Accumulator" label-position="left">
                <el-select
                  v-model="hydraccumulatorcomponentlist"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-hydrvalvecomponentlist
                  multiple
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
                  v-model="hydrvalvecomponentlist"
                  placeholder="Select"
                  style="width: 100%"
                  size="small"
                  clearable
                  df-hydrvalvecomponentlist
                  multiple
                  @change="update"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in hydrvalveComponentList"
                    :key="item.index"
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
                <el-input v-model="hydrlinewearandtear" df-linewearandtear size="small" type="textarea" :rows="3" @change="update"></el-input>
            </el-form-item>
        
        </div>    
        <div v-if="linesysID == 3" id="pneumaticLine" ref="properties">   
            <el-form-item label="Max Flow" label-position="left">
                <el-input v-model="pneumaxflow" df-pneumaxflow size="small" @change="update"></el-input>
            </el-form-item>
            <el-form-item label="Valves" label-position="left" size="small">
                <el-select
                v-model="pneuvalvecomponentlist"               
                placeholder="Select"
                style="width: 100%"
                size="small"
                @change="update"
                clearable
                multiple
                df-pneuvalvecomponentlist
                value-key="nodeid"
                >
                <el-option
                    v-for="item in pneuvalveComponentList"
                    :key="item.index"
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
                >
                  <el-option
                    v-for="item in pneufanComponentList"
                    :key="item.index"
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
        const lineconnection = ref('');
        const connectioncomponentlist = ref([])
        const lineConnectionList = ref([]);
        const lineComponentList = ref([]);
        // Hydraulic
        const lineinputs = ref([]);
        const lineoutputs = ref([]);
        const hydraccumulatorComponentList = ref();
        const hydraccumulatorcomponentlist = ref();
        const hydrvalveComponentList = ref();
        const hydrvalvecomponentlist = ref();
        const hydrlinenonreturn = ref(false);
        const hydrlinewearandtear = ref('');
        // Pneumatic
        const pneumaxflow = ref();
        const pneuvalveComponentList = ref([]);
        const pneuvalvecomponentlist = ref();
        const pneufanComponentList = ref();
        const pneufan = ref();
        const pneuvolume = ref();
        // Liquid
        //no lines

        const linesysID = ref(0);

        const helper = new Helper;

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        // Electrical
        const getlineConnections = () => {
            const exportdata = df.export();
            const lineconns = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Connection');
            if (lineconns) {
                lineConnectionList.value = lineconns.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, atozid: c.data.id}));
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

        // const setlineValveListOption = () => {
        //     nextTick( () => {
        //         dataModel.value.pneuvalvecomponentlist = pneuvalvecomponentlist;
        //     });

        // }

        // const setlineFanListOption = () => {
        //     nextTick( () => {
        //         dataModel.value.pneufancomponentlist = pneufancomponentlist;
        //     });

        // }

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
                lineconnection.value = dataModel.value.lineconnection || '';
                connectioncomponentlist.value = dataModel.value.connectioncomponentlist || '';
                getlineConnections();
                getlineComponentList()
            }
            if (props.sysID === 2) {
                lineinputs.value = dataModel.value.lineinputs || '';
                lineoutputs.value = dataModel.value.lineoutputs || '';
                hydraccumulatorcomponentlist.value = dataModel.value.hydraccumulatorcomponentlist || '';
                hydrvalvecomponentlist.value = dataModel.value.hydrvalvecomponentlist || '';
                hydrlinenonreturn.value = dataModel.value.hydrlinenonreturn || false;
                hydrlinewearandtear.value = dataModel.value.hydrlinewearandtear || '';
                gethydrlineValveList();
                gethydrlineAccumulatorList();
            }
            if (props.sysID === 3) {
                pneumaxflow.value = dataModel.value.pneumaxflow || '';
                pneufan.value = dataModel.value.pneufan || '';
                pneuvolume.value = dataModel.value.pneuvolume || '';
                pneuvalvecomponentlist.value = dataModel.value.pneuvalvecomponentlist || '';
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
            // Hydraulic
            dataModel.value.lineinputs = lineinputs.value;
            dataModel.value.lineoutputs = lineoutputs.value;
            dataModel.value.hydraccumulatorcomponentlist = hydraccumulatorcomponentlist.value;
            dataModel.value.hydrvalvecomponentlist = hydrvalvecomponentlist.value;
            dataModel.value.hydrlinenonreturn = hydrlinenonreturn.value;
            dataModel.value.hydrlinewearandtear = hydrlinewearandtear.value;
            //Pneumatic
            dataModel.value.pneumaxflow = pneumaxflow.value;
            dataModel.value.pneufan = pneufan.value;
            dataModel.value.pneuvolume = pneuvolume.value;
            dataModel.value.pneuvalvecomponentlist = pneuvalvecomponentlist.value;
            //Liquid
            //none

            dataModel.value.linesysid = linesysID.value;
            emit('update', dataModel.value);
        }
        onMounted(async () => {
            await nextTick()

            hydrvalvecomponentlist.value = dataModel.value.hydrvalvecomponentlist;

            helper.checklinemultiselected(dataModel.value.hydrvalvecomponentlist, hydrvalveComponentList, hydrvalvecomponentlist, df, { hydrvalvecomponentlist: hydrvalvecomponentlist.value, ...dataModel.value }, dataModel);
            helper.checklinemultiselected(dataModel.value.pneuvalvecomponentlist, pneuvalveComponentList, pneuvalvecomponentlist, df, { pneuvalvecomponentlist: pneuvalvecomponentlist.value, ...dataModel.value }, dataModel);
        });

        return {
            el, itemname, linesysID, fuelFlow, volume, gravityFlow, 
            lineconnection, connectioncomponentlist, lineConnectionList, lineComponentList, lineinputs, lineoutputs,
            hydraccumulatorcomponentlist, hydrvalvecomponentlist, hydraccumulatorComponentList, hydrvalveComponentList, hydrlinenonreturn, hydrlinewearandtear, 
            pneumaxflow, pneuvalvecomponentlist, pneufan, pneuvolume, pneufanComponentList, pneuvalveComponentList,
            dataModel,
            update, closeDialog, 
            getlineComponentList, getpneulineValveList, gethydrlineValveList, gethydrlineAccumulatorList,
        }
    }    
}
</script>
