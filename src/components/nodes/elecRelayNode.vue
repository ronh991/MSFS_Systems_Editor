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
                setAllParameters();
            });
        }

        const getlineList = () => {
            if (props.lineList !== undefined) {
                lineList.value = props.lineList.value;
            }
            //const exportdata = df.value.export();
                // don't need to get inputs just line data
            // const df_inputs = df.drawflow.drawflow.Home.data;
            // let inputs = [];
            // Object.entries(df_inputs).forEach(([key,node]) => {
            // const inp = getConnections(node.inputs);
            // inp.forEach( i => {
            //     const src = df_inputs[i.node];
            //     const srcName = src.data.itemname || src.data.name ;
            //     const dest = df_inputs[key];
            //     const destName = dest.data.itemname || dest.data.name;
            //     const name = `${srcName}to${destName}`;
            //     //const lineProperties = getLineListProperties(name) || {};
            //     const line1 = {
            //     name:name,
            //     index: inputs.length +1,
            //     }
            //     inputs.push(line1);
            // });
            // });
            // if (inputs) {
            //     lineList.value = inputs;
            // }
            //setmanagedLineOption();
            setAllParameters();
        }

        // drawflow connections - MSFS lines end points
        // function getConnections(obj) {
        //     const connections = [];
        //     Object.entries(obj).forEach(([key, val]) => {
        //         if (val.connections && Array.isArray(val.connections)) {
        //             val.connections.forEach(connection => {
        //                 if (connection.node) {
        //                     connections.push({
        //                         ...connection,
        //                     });                            
        //                 } 
        //             });
        //         }
        //     });
        //     return connections;
        // }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                helper.checkmultiselected(dataNode.value.data.managedline, lineList, managedline, df, nodeId, { managedline: managedline.value, ...dataNode.value.data }, dataNode);
                const data = {
                    itemname: itemname.value || dataNode.value.data.name,
                    managedline: managedline.value || '',
                    resistance: resistance.value || '',
                    tensionthreshold: tensionthreshold.value || '',
                    disconnectedwhenpowered: disconnectedwhenpowered.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
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

            df.on('connectionCreated', getlineList);
            df.on('connectionRemoved', getlineList);
            df.on('nodeDataChanged', getlineList);
            df.on('nodeRemoved', getlineList);
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;
            
            managedline.value = dataNode.value.data.managedline;
            resistance.value = dataNode.value.data.resistance;
            tensionthreshold.value = dataNode.value.data.tensionthreshold;
            disconnectedwhenpowered.value = dataNode.value.data.disconnectedwhenpowered;
            
            getlineList();
        });
        
        return {
            el, itemname, itemindex, managedline, resistance, tensionthreshold, disconnectedwhenpowered, lineList, setmanagedLineOption
              
        }

    }    
    
})
</script>
