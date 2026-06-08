<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="PTU" :index="itemindex" sysID="2"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="<= MI Norm Pres MO =>" label-position="left">
                <el-input v-model="normalpresure" df-normalpresure size="small"></el-input>
            </el-form-item>
            <el-form-item label="MR =>" label-position="right"></el-form-item>
            <el-form-item label="<= PI Nom Disp PO =>" label-position="left">
                <el-input v-model="nominaldisplacement" df-nominaldisplacement size="small"></el-input>
            </el-form-item>
            <el-form-item label="PR =>" label-position="right"></el-form-item>
            <el-form-item label="Reverse" label-position="left">
                  <el-switch
                    v-model="reversible"
                    @change="setReversible"
                    df-reversible
                    class="ml-2"
                    style="--el-switch-on-color: #7f449e; --el-switch-off-color: #737373"
                  />
            </el-form-item>
            <el-form-item label="Wear & Tear" label-position="left">
                <el-input v-model="wearandtear" df-wearandtear size="small" type="textarea" :rows="3"></el-input>
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
        const normalpresure = ref(0);
        const nominaldisplacement = ref(0);
        const reversible = ref(false);
        const wearandtear = ref('');

        const helper = new Helper;

        const setReversible = (val) => {
             nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        const setAllParameters = (id) => {
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    normalpresure: normalpresure.value || '',
                    nominaldisplacement: nominaldisplacement.value || '',
                    reversible: reversible.value || '',
                    wearandtear: wearandtear.value || '',
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
                    setAllParameters(id);
                });
            })
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;
            
            normalpresure.value = dataNode.value.data.normalpresure;
            nominaldisplacement.value = dataNode.value.data.nominaldisplacement;
            reversible.value = dataNode.value.data.reversible;
            wearandtear.value = dataNode.value.data.wearandtear;

            setAllParameters(nodeId.value);
       });
        
        return {
            el, itemname, itemindex, normalpresure, nominaldisplacement, reversible, wearandtear, setReversible
              
        }

    }    
    
})
</script>
