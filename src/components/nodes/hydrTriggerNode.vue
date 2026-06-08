<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Trigger" :index="itemindex" sysID="2"/>
      <el-form
        label-width="auto"
      >
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Condition" label-position="left">
                <el-select v-model="condition" @change="selectConditionOption" df-condition placeholder="Select" size="small">
                  <el-option
                    v-for="item in conditionOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
            </el-form-item> 
            <el-form-item label="Effect" label-position="left">
                <el-input v-model="effects" df-effects :rows="2" type="textarea" size="small"></el-input>
            </el-form-item>
            
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, useTemplateRef, watch, } from 'vue'
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
        const itemindex = ref('');
        const itemname = ref('');
        const condition = ref('');
        const effects = ref('');

        const conditionOptions = readonly([
            'AutoStart',
            'AutoShutdown'
        ]);

        const helper = new Helper;
        
        const selectConditionOption = () => {
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
                    condition: condition.value || '',
                    effects: effects.value || '',
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

            condition.value = dataNode.value.data.condition;
            effects.value = dataNode.value.data.effects;

            setAllParameters(nodeId.value);

        });
        
        return {
            el,  itemindex, itemname, condition, effects, conditionOptions, selectConditionOption
        }

    }    
    
})
</script>
<style scoped>


</style>