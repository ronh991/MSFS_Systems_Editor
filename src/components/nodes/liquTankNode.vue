<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Tank" :index="itemindex" sysID="4"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Position" label-position="left">
                <el-input v-model="position" df-position size="small"></el-input>
            </el-form-item>
            <el-form-item label="Capacity" label-position="left">
                <el-input v-model="capacity" df-capacity size="small"></el-input>
            </el-form-item>
            <el-form-item label="Doors" label-position="left">
                <el-input v-model="doors" df-doors size="small"></el-input>
            </el-form-item>
            <el-form-item label="Scoops" label-position="left">
                <el-input v-model="scoops" df-scoops size="small"></el-input>
            </el-form-item>            
       </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick,} from 'vue'
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
        const itemindex = ref('');
        const itemname = ref('');
        const capacity = ref(0);
        const doors = ref(0);
        const scoops = ref('');
        const position = ref('0,0,0');

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    capacity: capacity.value || '',
                    doors: doors.value || '',
                    position: position.value || '',
                    scoops: scoops.value || '',
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
            
            capacity.value = dataNode.value.data.capacity;
            doors.value = dataNode.value.data.doors;
            position.value = dataNode.value.data.position;
            scoops.value = dataNode.value.data.scoops;

            setAllParameters(nodeId.value);
        });
        
        return {
            el, itemindex, itemname, capacity, doors, position, scoops, 
        }

    }    
    
})
</script>
