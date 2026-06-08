<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Burner" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Pilot Light Flow" label-position="left">
                <el-input v-model="pilotlightflowrate" df-pilotlightflowrate  size="small"></el-input>
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
        const itemindex = ref('');

        // Data items
        const pilotlightflowrate = ref();

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    pilotlightflowrate: pilotlightflowrate.value || '',
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

            pilotlightflowrate.value = dataNode.value.data.pilotlightflowrate;
            setAllParameters(nodeId.value);
       });
        
        return {
            el, itemname, itemindex, pilotlightflowrate, 
              
        }

    }    
    
})
</script>
