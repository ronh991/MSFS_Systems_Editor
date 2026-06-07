<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Accumulator" :index="itemindex" sysID="2"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Norm Pres" label-position="left">
                <el-input v-model="normalpressure" df-normalpressure size="small"></el-input>
            </el-form-item>
            <el-form-item label="Init Pres" label-position="left">
                <el-input v-model="initialpressure" df-initialpressure size="small"></el-input>
            </el-form-item>
            <el-form-item label="Capacity" label-position="left">
                <el-input v-model="capacity" df-capacity size="small"></el-input>
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

        // Data items
        const normalpressure = ref();
        const initialpressure = ref();
        const capacity = ref();
        const wearandtear = ref();

        const helper = new Helper;

        const setAllParameters = () => {
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || '',
                    normalpressure: normalpressure.value || '',
                    initialpressure: initialpressure.value || '',
                    capacity: capacity.value || '',
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
            
            normalpressure.value = dataNode.value.data.normalpressure;
            initialpressure.value = dataNode.value.data.initialpressure;
            capacity.value = dataNode.value.data.capacity;
            wearandtear.value = dataNode.value.data.wearandtear;
            
            setAllParameters();
       });
        
        return {
            el, itemname, itemindex, normalpressure, initialpressure, capacity, wearandtear, 
              
        }

    }    
    
})
</script>
