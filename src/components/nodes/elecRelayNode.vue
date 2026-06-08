<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Relay" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Man Line" df-managedline label-position="left">
                <el-select
                v-model="managedline"
                clearable
                filterable
                size='small'
                placeholder="Select"
                style="width: 240px"
                @change="setmanagedLineOption"
                df-managedline
                value-key="atozid"
                >
                <el-option
                    v-for="item in lineList"
                    :key="item.index"
                    :label="item.name"
                    :value="item"
                />
                </el-select>
            </el-form-item>
            <el-form-item label="Res" label-position="left">
                <el-input v-model="resistance" df-resistance size="small"></el-input>
            </el-form-item>
            <el-form-item label="Tension Thr" label-position="left">
                <el-input v-model="tensionthreshold" df-tensionthreshold size="small"></el-input>
            </el-form-item>
            <el-form-item label="Disc Pwrd" label-position="left">
                <el-input v-model="disconnectedwhenpowered" df-disconnectedwhenpowered size="small"></el-input>
            </el-form-item>
        </div>
    </el-form>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, readonly, ref, nextTick, } from 'vue'
import nodeHeader from './nodeHeader.vue'
import Helper from '../helper';

export default defineComponent({
    components: {
        nodeHeader
    },
    props: [
        'lineList'
    ],
    setup(props) {
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const dataNode = ref({});
        const itemname = ref('');
        const itemindex = ref('');
        const lineList = ref([]);
        //let lineListProperties = [];

        // Data items
        const managedline = ref('');
        const resistance = ref();
        const tensionthreshold = ref();
        const disconnectedwhenpowered = ref();

        const helper = new Helper;

        const setmanagedLineOption = () => {
            nextTick( () => {
                setAllParameters(nodeId.value);
            });
        }

        const getlineList = (id) => {
            if (props.lineList !== undefined) {
                lineList.value = props.lineList.value;
            }
            setAllParameters(id);
        }

        const setAllParameters = (id) => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                helper.checkmultiselected(dataNode.value.data.managedline, lineList, managedline, df, nodeId, { managedline: managedline.value, ...dataNode.value.data }, dataNode);
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
                    managedline: managedline.value || '',
                    resistance: resistance.value || '',
                    tensionthreshold: tensionthreshold.value || '',
                    disconnectedwhenpowered: disconnectedwhenpowered.value || '',
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

            if (props.lineList !== undefined) {
                lineList.value = props.lineList.value;
            }

            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    getlineList(id);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getlineList(nodeId.value);
                });
            })
            df.on('connectionCreated', function(id) {nextTick( () => {
                    getlineList(id);
                });
            })
            df.on('connectionRemoved', function(id) {nextTick( () => {
                    getlineList(id);
                });
            })
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;
            
            managedline.value = dataNode.value.data.managedline;
            resistance.value = dataNode.value.data.resistance;
            tensionthreshold.value = dataNode.value.data.tensionthreshold;
            disconnectedwhenpowered.value = dataNode.value.data.disconnectedwhenpowered;
            
            getlineList(nodeId.value);
        });
        
        return {
            el, itemname, itemindex, managedline, resistance, tensionthreshold, disconnectedwhenpowered, lineList, setmanagedLineOption
              
        }

    }    
    
})
</script>
