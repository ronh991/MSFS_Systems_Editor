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
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
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
        const ratedcurrent = ref(0);
        const tripcurvetype = ref([]);

        const tripCurveTypeOptions = readonly([
            {
            value: 'IEC_Sinv',
            label: 'IEC_Sinv',
            },
            {
            value: 'IEC_Vinv',
            label: 'IEC_Vinv',
            },
            {
            value: 'IEC_Einv',
            label: 'IEC_Einv',
            },
            {
            value: 'IEC_LTSinv',
            label: 'IEC_LTSinv',
            },
            {
            value: 'IEEE_Vinv',
            label: 'IEEE_Vinv',
            },
            {
            value: 'IEEE_Minv',
            label: 'IEEE_Minv',
            },
            {
            value: 'IEEE_Einv',
            label: 'IEEE_Einv',
            },
        ]);
        
        const settripCurveTypeOption = () => {
            nextTick( () => {
                setAllParameters();
            });
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    ratedcurrent: ratedcurrent.value || dataNode.value.data.name,
                    tripcurvetype: tripcurvetype.value || dataNode.value.data.name,
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
