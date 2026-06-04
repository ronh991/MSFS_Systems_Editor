<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Outlet" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Type" label-position="left">
                <el-select v-model="outlettype" @change="selectOutletType" df-outlettype placeholder="Select" size="small">
                  <el-option
                    v-for="item in outletTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item label="Consum Vol" label-position="left">
                <el-input v-model="consumptionvolume" df-consumptionvolume size="small"></el-input>
            </el-form-item>
            <el-form-item label="Consum Pres" label-position="left">
                <el-input v-model="consumptionpressure" df-consumptionpressure size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Consum Temp" label-position="left">
                <el-input v-model="consumptiontemperature" df-consumptiontemperature size="small"></el-input>
            </el-form-item> 
            <el-form-item v-if="outlettype ==='Starter'" label="Index" label-position="left">
                <el-input v-model="starterindex" df-starterindex size="small"></el-input>
            </el-form-item> 
            <el-form-item label="Volume" label-position="left">
                <el-input v-model="volume" df-volume size="small"></el-input>
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
        const outlettype = ref('');
        const consumptionvolume = ref(0);
        const consumptionpressure = ref(0);
        const consumptiontemperature = ref(0);
        const starterindex = ref(0);
        const volume = ref(0);
 
        const outletTypeOptions = readonly([
            'WingDeice',
            'WindshieldDeice',
            'Brakes',
            'VacumSystem',
            'Starter',
        ]);

        const helper = new Helper;

        const selectOutletType = () => {
           nextTick( () => {
                setAllParameters();                
            });
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    outlettype: outlettype.value || '',
                    consumptionvolume: consumptionvolume.value || '',
                    consumptionpressure: consumptionpressure.value || '',
                    consumptiontemperature: consumptiontemperature.value || '',
                    starterindex: starterindex.value || '',
                    volume: volume.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
            }
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeDataChanged', setAllParameters);          
            
            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            outlettype.value = dataNode.value.data.outlettype;
            consumptionvolume.value = dataNode.value.data.consumptionvolume;
            consumptionpressure.value = dataNode.value.data.consumptionpressure;
            consumptiontemperature.value = dataNode.value.data.consumptiontemperature;
            starterindex.value = dataNode.value.data.starterindex;
            volume.value = dataNode.value.data.volume;

            setAllParameters();
        });
        
        return {
            el, itemname, itemindex, consumptionvolume, outlettype, consumptionpressure, consumptiontemperature, starterindex, volume, outletTypeOptions, 
            selectOutletType, 
        }

    }    
    
})
</script>
