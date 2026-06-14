<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Pump" :index="itemindex" sysID="0"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Title" label-position="left">
                <el-input v-model="itemTitle" df-itemtitle size="small"></el-input>
            </el-form-item>
            <el-form-item label="Pressure" label-position="left">
                <el-input v-model="pressure" df-pressure size="small"></el-input>
            </el-form-item>
            <el-form-item label="Pres Curve" label-position="left" size="small">
                <el-select
                  v-model="curve"
                  placeholder="Select"
                  style="width: 100%"
                  clearable
                  @change="setOption"
                  value-key="nodeid"
                >
                  <el-option
                    v-for="item in curveList"
                    :key="item.index"
                    :label="item.index"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Tank Reqd" label-position="left">
                <el-input v-model="tankFuelRequired" df-tankfuelrequired size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Type" label-position="left" size="small">
                <el-select v-model="pumpType" @change="selectPumpType" placeholder="Select">
                  <el-option
                    v-for="item in pumpTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item label="One Way" label-position="left" size="small">
                  <el-switch
                    v-model="oneWay"
                    @change="setOneway"
                    class="ml-2"
                    style="--el-switch-on-color: #7f449e; --el-switch-off-color: #737373"
                  />
            </el-form-item>
            <el-form-item label="Circuit Index" label-position="left">
                <el-input v-model="circuitIndex" df-circuitindex size="small"></el-input>
            </el-form-item>
            <el-form-item label="Auto" label-position="left">
                <el-input v-model="autoCondition" df-autocondition size="small"></el-input>
            </el-form-item>
            <el-form-item label="Pressure Dec" label-position="left">
                <el-input v-model="pressureDecrease" df-pressuredecrease size="small"></el-input>
            </el-form-item>            
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, } from 'vue'
import nodeHeader from './nodeHeader.vue'

export default defineComponent({
    components: {
        nodeHeader
    },
    setup() {
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const dataNode = ref({});
        const itemname = ref('');
        const itemTitle = ref('');
        const itemindex = ref('');
        const pressure = ref(0);
        const tankFuelRequired = ref(0);
        const pumpType = ref('');
        const curve = ref('');
        const autoCondition = ref('False');
        const circuitIndex = ref('1');
        const pressureDecrease = ref('');
        const curveList = ref([]);
        const oneWay = ref(true);

        const pumpTypeOptions = readonly([
            'Electric',
            'APUDriven',
            'EngineDriven',
            'Manual',
            'Anemometer'
        ]);
        
        const selectPumpType = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        // not used ??
        const setOneway = (val) => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const getCurves = (id) => {
            const exportdata = df.export();
            const curves = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Curve');
            if (curves) {
                curveList.value = curves.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters(id);
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    itemTitle: itemTitle.value || '',
                    oneway: oneWay.value || true,
                    pressure: pressure.value || '',
                    tankfuelrequired: tankFuelRequired.value || '',
                    curve: curve.value || '',
                    pumptype: pumpType.value || '',
                    autocondition: autoCondition.value || '',
                    circuitindex: circuitIndex.value || '',
                    pressuredecrease: pressureDecrease.value || '',
                };
                df.updateNodeDataFromId(nodeId.value, data);
                }
            }
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            // not nodeId.value because no changes to naming on curves
            df.on('nodeCreated', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            
            itemname.value = dataNode.value.data.itemname;
            itemTitle.value = dataNode.value.data.itemtitle;
            itemindex.value = dataNode.value.data.index;

            pressure.value = dataNode.value.data.pressure;
            tankFuelRequired.value = dataNode.value.data.tankfuelrequired;
            curve.value = dataNode.value.data.curve;
            pumpType.value = dataNode.value.data.pumptype;
            autoCondition.value = dataNode.value.data.autocondition;
            circuitIndex.value = dataNode.value.data.circuitindex;
            pressureDecrease.value = dataNode.value.data.pressuredecrease;
            oneWay.value = dataNode.value.data.oneway;

            getCurves(nodeId.value);
        });
        
        return {
            el, itemname, itemTitle, itemindex, pressure, tankFuelRequired, curve, autoCondition, circuitIndex, pumpType, pumpTypeOptions, pressureDecrease, curveList, oneWay, 
            selectPumpType, setOption, setOneway,
        }

    }    
    
})
</script>
