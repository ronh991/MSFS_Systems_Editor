<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Pump" :index="itemindex" sysID="2"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Type" label-position="left">
                <el-select v-model="pumptype" @change="selectPumpTypeOption" df-pumptype placeholder="Select" size="small">
                  <el-option
                    v-for="item in pumpTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item label="Norm Pres" label-position="left">
                <el-input v-model="normalpressure" df-normalpressure size="small"></el-input>
            </el-form-item>
            <el-form-item label="Liq Cap" label-position="left">
                <el-input v-model="liquidcapacity" df-liquidcapacity size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Nom Disp" label-position="left">
                <el-input v-model="nominaldisplacement" df-nominaldisplacement size="small"></el-input>
            </el-form-item> 
            <el-form-item v-if="pumptype === 'EngineDriven'" label="Index" label-position="left">
                <el-input v-model="engineindex" df-engineindex size="small"></el-input>
            </el-form-item> 
            <el-form-item v-if="pumptype === 'Electric'" label="Circuit" label-position="left">
                <el-input v-model="circuitname" df-circuitname size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="pumptype === 'Electric' && (circuitname === '' || circuitname === undefined)" label="Circuit Index" label-position="left">
                <el-input v-model="circuitindex" df-circuitindex size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="pumptype === 'Electric'" label="Mode" label-position="left">
                <el-select v-model="modetype" @change="selectModeOption" df-modetype placeholder="Select" size="small">
                  <el-option
                    v-for="item in modeTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item v-if="pumptype === 'Electric' && modetype === 'Auto' " label="Pres Th Pct" label-position="left">
                <el-input v-model="pressurethresholdpct" df-pressurethresholdpct size="small"></el-input>
            </el-form-item>            
            <el-form-item label="Wear & Tear" label-position="left">
                <el-input v-model="wearandtear" df-wearandtear size="small" type="textarea" :rows="3"></el-input>
            </el-form-item>
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, } from 'vue'
import nodeHeader from './nodeHeader.vue'
import Helper from '../helper.js'

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
        const itemindex = ref('');

        const pumptype = ref('');
        const modetype = ref('');
        const normalpressure = ref();
        const nominaldisplacement = ref();
        const liquidcapacity = ref();
        const engineindex = ref();
        const circuitname = ref();
        const circuitindex = ref();
        const pressurethresholdpct = ref();
        const wearandtear = ref('');

        const pumpTypeOptions = readonly([
            'EngineDriven',
            'Electric',
            'APUDriven',
            'Manual',
            'RATDriven',
            'AirDriven'
        ]);

        const modeTypeOptions = readonly([
            'Default',
            'Auto'
        ]);

        const helper = new Helper;
        
        const selectPumpTypeOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const selectModeOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setAllParameters = (id) => {
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                    const data = {
                        ...dataNode.value.data,
                        itemname: itemname.value || '',
                        pumptype: pumptype.value || '',
                        modetype: modetype.value || '',
                        normalpressure: normalpressure.value || '',
                        nominaldisplacement: nominaldisplacement.value || '',
                        liquidcapacity: liquidcapacity.value || '',
                        engineindex: engineindex.value || '',
                        circuitname: circuitname.value || '',
                        circuitindex: circuitindex.value || '',
                        pressurethresholdpct: pressurethresholdpct.value || '',
                        wearandtear: wearandtear.value || '',
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
                    setAllParameters(id);
                });
            })
            
            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            pumptype.value = dataNode.value.data.pumptype;
            modetype.value = dataNode.value.data.modetype;
            normalpressure.value = dataNode.value.data.normalpressure;
            nominaldisplacement.value = dataNode.value.data.nominaldisplacement;
            liquidcapacity.value = dataNode.value.data.liquidcapacity;
            engineindex.value = dataNode.value.data.engineindex;
            circuitname.value = dataNode.value.data.circuitname;
            circuitindex.value = dataNode.value.data.circuitindex;
            pressurethresholdpct.value = dataNode.value.data.pressurethresholdpct;
            wearandtear.value = dataNode.value.data.wearandtear;

            setAllParameters(nodeId.value);
        });
        
        return {
            el, itemname, itemindex, normalpressure, pumptype, modetype, normalpressure, nominaldisplacement, liquidcapacity, engineindex, circuitname, circuitindex, pressurethresholdpct, wearandtear, 
            pumpTypeOptions, modeTypeOptions, 
            selectPumpTypeOption, selectModeOption, setAllParameters
        }

    }    
    
})
</script>
