<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="BurnerValve" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Burner Index" label-position="left">
                <el-input v-model="burner" df-burner size="small"></el-input>
            </el-form-item>
            <el-form-item label="Max Flow" label-position="left">
                <el-input v-model="maxflowrate" df-maxflowrate size="small"></el-input>
            </el-form-item>
            <el-form-item label="Power" label-position="left">
                <el-input v-model="power" df-power size="small"></el-input>
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
        const burner = ref();
        const maxflowrate = ref();
        const power = ref();

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data,
                    itemname: itemname.value || '',
                    burner: burner.value || '',
                    maxflowrate: maxflowrate.value || '',
                    power: power.value || '',
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
            
            burner.value = dataNode.value.data.burner;
            maxflowrate.value = dataNode.value.data.maxflowrate;
            power.value = dataNode.value.data.power;

            setAllParameters(nodeId.value);
       });
        
        return {
            el, itemname, itemindex, burner, maxflowrate, power, 
              
        }

    }    
    
})
</script>
