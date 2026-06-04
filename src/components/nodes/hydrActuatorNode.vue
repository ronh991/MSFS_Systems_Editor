<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Actuator" :index="itemindex" sysID="2"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Fl Vol" label-position="left">
                <el-input v-model="fluidvolume" df-fluidvolume size="small"></el-input>
            </el-form-item>
            <el-form-item label="Liq Cap" label-position="left">
                <el-input v-model="liquidcapacity" df-liquidcapacity size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Liq Cons" label-position="left">
                <el-input v-model="liquidconsumption" df-liquidconsumption size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Min Pres" label-position="left">
                <el-input v-model="minimalpressure" df-minimalpressure size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Act Type" label-position="left">
                <el-select v-model="actuatortype" df-actuatortype @change="selectActuatorType" placeholder="Select" size="small">
                  <el-option
                    v-for="item in actTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item label="Mast Cyl" label-position="left">
                  <el-switch
                    v-model="mastercylinder"
                    @change="setMasterCylinder"
                    df-mastercylinder
                    class="ml-2"
                    style="--el-switch-on-color: #7f449e; --el-switch-off-color: #737373"
                  />
            </el-form-item>
            <el-form-item label="Redundancy" label-position="left">
                <el-input v-model="redundancy" df-redundancy size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Asst Pct" label-position="left">
                <el-input v-model="assistancepct" df-assistancepct size="small"></el-input>
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

        const actTypeOptions = readonly([
            'Elevator',
            'LeftAileron',
            'RightAileron',
            'Rudder',
            'Spoilers',
            'Brakes',
            'Flaps',
            'Landing Gear',
            'Hoist',
            'TailRotorPitch',
            'CyclicLeftRoll',
            'CyclicRightRoll',
            'CyclicPitch',
            'CyclicMixed',
            'RotorCollective',
            'Launch Bar',
            'Anti-Skid',
            'TailHook',
            'Thrust Reverser',
            'Liquid Dropping Door',
            'Custom',
        ])

        // Data items
        const fluidvolume = ref();
        const liquidcapacity = ref(0);
        const liquidconsumption = ref(0);
        const minimalpressure = ref(0);
        const actuatortype = ref('');
        const mastercylinder = ref(false);
        const redundancy = ref(0);
        const assistancepct = ref(0);
        const wearandtear = ref();

        const helper = new Helper;

        const selectActuatorType = () => {
            nextTick( () => {
                setAllParameters();
            });
        }
        
        const setMasterCylinder = (val) => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = () => {
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    fluidvolume: fluidvolume.value || '',
                    liquidcapacity: liquidcapacity.value || '',
                    liquidconsumption: liquidconsumption.value || '',
                    minimalpressure: minimalpressure.value || '',
                    actuatortype: actuatortype.value || '',
                    mastercylinder: mastercylinder.value || '',
                    redundancy: redundancy.value || '',
                    assistancepct: assistancepct.value || '',
                    wearandtear: wearandtear.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            }
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            //df.on('nodeCreated', setAllParameters);
            //df.on('nodeRemoved', setAllParameters);
            df.on('nodeDataChanged', setAllParameters);           
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;
            
            fluidvolume.value = dataNode.value.data.fluidvolume;
            liquidcapacity.value = dataNode.value.data.liquidcapacity;
            liquidconsumption.value = dataNode.value.data.liquidconsumption;
            minimalpressure.value = dataNode.value.data.minimalpressure;
            actuatortype.value = dataNode.value.data.actuatortype;
            mastercylinder.value = dataNode.value.data.mastercylinder;
            redundancy.value = dataNode.value.data.redundancy;
            assistancepct.value = dataNode.value.data.assistancepct;
            
            wearandtear.value = dataNode.value.data.wearandtear;

            setAllParameters();
       });
        
        return {
            el, itemname, itemindex, fluidvolume, liquidcapacity, liquidconsumption, minimalpressure, actuatortype, mastercylinder, redundancy, assistancepct, wearandtear, actTypeOptions, setMasterCylinder, selectActuatorType
              
        }

    }    
    
})
</script>
