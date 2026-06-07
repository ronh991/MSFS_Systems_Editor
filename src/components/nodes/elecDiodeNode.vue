<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Diode" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Forward Volt" label-position="left">
                <el-input v-model="forwardvoltage" df-forwardvoltage size="small"></el-input>
            </el-form-item>
            <el-form-item label="Reverse Volt" label-position="left">
                <el-input v-model="reversevoltage" df-reversevoltage size="small"></el-input>
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
        const forwardvoltage = ref();
        const reversevoltage = ref();

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || '',
                    forwardvoltage: forwardvoltage.value || '',
                    reversevoltage: reversevoltage.value || '',
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
            
            forwardvoltage.value = dataNode.value.data.forwardvoltage;
            reversevoltage.value = dataNode.value.data.reversevoltage;
            
            setAllParameters();
       });
        
        return {
            el, itemname, itemindex, forwardvoltage, reversevoltage, 
              
        }

    }    
    
})
</script>
