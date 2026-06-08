<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="MixerUnit" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
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

        // Data items
        const volume = ref();

        const helper = new Helper;

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    volume: volume.value || '',
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
            
            volume.value = dataNode.value.data.volume;

            setAllParameters(nodeId.value);
       });
        
        return {
            el, itemname, itemindex, volume, 
              
        }

    }    
    
})
</script>
