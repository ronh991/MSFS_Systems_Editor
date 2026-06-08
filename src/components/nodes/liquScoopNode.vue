<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Scoop" :index="itemindex" sysID="4"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Fixed Rate" label-position="left">
                <el-input v-model="fixedrate" df-fixedrate size="small"></el-input>
            </el-form-item>

            <el-form-item label="Curve Rate" label-position="left" size="small">
                <el-select
                  v-model="curverate"
                  placeholder="Select"
                  style="width: 100%"
                  clearable
                  @change="setCurveRateOption"
                  value-key="nodeid"
                  df-curverate
                >
                  <el-option
                    v-for="item in curveList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
            </el-form-item>
            <el-form-item label="Contact Point" label-position="left">
                <el-input v-model="contactpoint" df-contactpoint size="small"></el-input>
            </el-form-item>
       </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick,} from 'vue'
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
        const fixedrate = ref(0);
        const curverate = ref();
        const contactpoint = ref(0);
        const curveList = ref([]);

        const helper = new Helper;

        const setCurveRateOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const setAllParameters = (id) => {
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                helper.checkselected(dataNode.value.data.curverate, curveList, curverate, df, nodeId, {curverate: curverate.value, ...dataNode.value.data});
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    fixedrate: fixedrate.value || '',
                    contactpoint: contactpoint.value || '',
                    curverate: curverate.value || '',
                };
                df.updateNodeDataFromId(nodeId.value, data);
                }
            }
        }

        const getCurves = (id) => {
            const exportdata = df.export();
            const curves = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Curve');
            if (curves) {
                curveList.value = curves.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters(id);
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)

            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            df.on('nodeCreated', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getCurves(id);
                });
            })
             
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;

            fixedrate.value = dataNode.value.data.fixedrate;
            curverate.value = dataNode.value.data.curverate;
            contactpoint.value = dataNode.value.data.contactpoint;

            getCurves(nodeId.value);
        });
        
        return {
            el, itemindex, itemname, fixedrate, curverate, contactpoint, curveList, setCurveRateOption, 
        }

    }    
    
})
</script>
