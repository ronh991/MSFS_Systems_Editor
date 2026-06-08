<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Connection" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname size="small"></el-input>
            </el-form-item>
            <el-form-item label="Components" label-position="left" size="small">
                <el-select
                v-model="linecomponent"               
                placeholder="Select"
                style="width: 100%"
                size="small"
                @change="setlineComponentOption"
                clearable
                multiple
                df-linecomponent
                value-key="nodeid"
                >
                <el-option
                    v-for="item in lineComponentList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                />
                </el-select>
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
        const linecomponent = ref({});
        const lineComponentList = ref([]);

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        const setlineComponentOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const getlineComponentList = (id) => {
            const exportdata = df.export();
            const linecomponents = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Breaker' || node.class === 'Transformer' || node.class === 'Diode');
            if (linecomponents) {
                lineComponentList.value = linecomponents.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters(id);
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    linecomponent: linecomponent.value || '',
                };
                df.updateNodeDataFromId(nodeId.value, data);
                }
            }
        }

        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    getlineComponentList(id);
                });
            })
            df.on('nodeCreated', function(id) {nextTick( () => {
                    getlineComponentList(nodeId.value);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getlineComponentList(nodeId.value);
                });
            })
            
            itemindex.value = dataNode.value.data.index;
            linecomponent.value = dataNode.value.data.linecomponent;
            // get the list of linecomponent nodes - compare to list here
            //const templinecomponet = dataNode.value.data.linecomponent;
            //const exportdata = df.export();
            //const linecomponents = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Breaker' || node.class === 'Transformer' || node.class === 'Diode');
            //if (linecomponents) {
            //    lineComponentList.value = linecomponents.map(([k,c]) => ({name: c.data.itemname ? c.data.itemname : c.data.name, index: c.data.index, nodeid: c.id}));
            //}

            getlineComponentList(nodeId.value);
        });
        
        return {
            el, itemname, itemindex, linecomponent, lineComponentList, setlineComponentOption
              
        }

    }    
    
})
</script>
