<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="APU" :index="itemindex" sysID="0"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemName  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Title" label-position="left">
                <el-input v-model="itemTitle" df-itemTitle size="small"></el-input>
            </el-form-item>          
            <el-form-item label="Fuel Burn Rate" label-position="left">
                <el-input v-model="fuelBurn" df-fuelburn size="small"></el-input>
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
        const itemTitle = ref('');
        const itemindex = ref('');
        const fuelBurn = ref('0');

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    itemTitle: itemTitle.value || '',
                    fuelburn: fuelBurn.value || '',
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
            itemTitle.value = dataNode.value.data.itemtitle;
            itemindex.value = dataNode.value.data.index;

            fuelBurn.value = dataNode.value.data.fuelburn;

            setAllParameters();
        });
        
        return {
            el, itemname, itemTitle, itemindex, fuelBurn,
        }

    }    
    
})
</script>
