<template>
    <div ref="el">
        <nodeHeader nodeType="Parameters" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Areas Min Temp" label-position="left">
                <el-input v-model="areasmintemperature" df-areasmintemperature size="small"></el-input>
            </el-form-item>
            <el-form-item label="Areas Max Temp" label-position="left">
                <el-input v-model="areasmaxtemperature" df-areasmaxtemperature size="small"></el-input>
            </el-form-item>
            <el-form-item label="Max Diff Pressure" label-position="left">
                <el-input v-model="maxdifferencialpressure" df-maxdifferencialpressure size="small"></el-input>
            </el-form-item>
            <el-form-item label="Areas Max Temp Input" label-position="left">
                <el-input v-model="areasmaxtemperatureinput" df-areasmaxtemperatureinput size="small"></el-input>
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
        const areasmintemperature = ref();
        const areasmaxtemperature = ref();
        const maxdifferencialpressure = ref();
        const areasmaxtemperatureinput = ref();

        const helper = new Helper;

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    areasmintemperature: areasmintemperature.value || '',
                    areasmaxtemperature: areasmaxtemperature.value || '',
                    maxdifferencialpressure: maxdifferencialpressure.value || '',
                    areasmaxtemperatureinput: areasmaxtemperatureinput.value || '',
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
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;
            
            areasmintemperature.value = dataNode.value.data.areasmintemperature;
            areasmaxtemperature.value = dataNode.value.data.areasmaxtemperature;
            maxdifferencialpressure.value = dataNode.value.data.maxdifferencialpressure;
            areasmaxtemperatureinput.value = dataNode.value.data.areasmaxtemperatureinput;

            setAllParameters(nodeId.value);
       });
        
        return {
            el, itemindex, areasmintemperature, areasmaxtemperature, maxdifferencialpressure, areasmaxtemperatureinput, 
              
        }

    }    
    
})
</script>
