<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Fan" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Circuit" label-position="left">
                <el-input v-model="circuit" df-circuit size="small"></el-input>
            </el-form-item>
            <el-form-item label="Speed Up" label-position="left">
                <el-input v-model="speeduptime" df-speeduptime size="small"></el-input>
            </el-form-item>
            <el-form-item label="Static Pres" label-position="left">
                <el-input v-model="staticpressure" df-staticpressure size="small"></el-input>
            </el-form-item>
            <el-form-item label="Max Flow" label-position="left">
                <el-input v-model="maxflow" df-maxflow size="small"></el-input>
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
        const circuit = ref();
        const speeduptime = ref();
        const staticpressure = ref();
        const maxflow = ref();

        const helper = new Helper;

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    circuit: circuit.value || '',
                    speeduptime: speeduptime.value || '',
                    staticpressure: staticpressure.value || '',
                    maxflow: maxflow.value || '',
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
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;
            
            circuit.value = dataNode.value.data.circuit;
            speeduptime.value = dataNode.value.data.speeduptime;
            staticpressure.value = dataNode.value.data.staticpressure;
            maxflow.value = dataNode.value.data.maxflow;

            setAllParameters();
       });
        
        return {
            el, itemname, itemindex, circuit, speeduptime, staticpressure, maxflow, 
              
        }

    }    
    
})
</script>
