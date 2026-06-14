<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Breaker" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Rated Cur" label-position="left">
                <el-input v-model="ratedcurrent" df-ratedcurrent size="small"></el-input>
            </el-form-item>
            <el-form-item label="Trip Cur Type" label-position="left">
                <el-select v-model="tripcurvetype" df-tripcurvetype @change="settripCurveTypeOption" placeholder="Select" size="small" clearable>
                  <el-option
                    v-for="item in tripCurveTypeOptions"
                    :key="item"
                    :label="item"
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
import { inject } from 'vue'

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
        const ratedcurrent = ref(0);
        const tripcurvetype = ref([]);

        // Grab the global emitter instance
        const emitter = inject('emitter')

        const tripCurveTypeOptions = readonly([
            'IEC_Sinv',
            'IEC_Vinv',
            'IEC_Einv',
            'IEC_LTSinv',
            'IEEE_Vinv',
            'IEEE_Minv',
            'IEEE_Einv',
        ]);
        
        const handleUpdate = () => {
            emitter.emit('updatenode');
        }
        
        const settripCurveTypeOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                    const data = {
                        ...dataNode.value.data, 
                        itemname: itemname.value || '',
                        ratedcurrent: ratedcurrent.value || '',
                        tripcurvetype: tripcurvetype.value || '',
                    };
                    df.updateNodeDataFromId(nodeId.value, data);
                    handleUpdate();
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
            
            ratedcurrent.value = dataNode.value.data.ratedcurrent;
            tripcurvetype.value = dataNode.value.data.tripcurvetype;

            setAllParameters(nodeId.value);
       });
        
        return {
            el, itemname, itemindex, ratedcurrent, tripcurvetype, tripCurveTypeOptions, settripCurveTypeOption, 
              
        }

    }    
    
})
</script>
