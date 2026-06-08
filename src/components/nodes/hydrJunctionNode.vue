<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Junction" :index="itemindex" sysID="1"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
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
        const connections = ref([]);

        // Data items
        const wearandtear = ref('');

        const helper = new Helper;

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        const getConnections = () => {
            // if (!df.data) return { connections: [] };
            const selfNode = df.getNodeFromId(nodeId.value);
            const selfName = selfNode.data.itemname || selfNode.data.name;
            const io = {...selfNode.inputs, ...selfNode.outputs};
            const connections = [];
            let inputCount = 0;
            let inputsUsed = 0;
            let outputCount = 0;
            let outputsUsed = 0;            
            Object.entries(io).forEach(([ioKey, ioValue]) => {
                if (ioValue.connections && Array.isArray(ioValue.connections)) {
                    if (ioKey.indexOf('input') != -1) {
                        inputCount += 1;
                    } else {
                        outputCount += 1;
                    }
                    ioValue.connections.forEach(connection => {
                        if (connection.node) {
                            const isInput = ioKey.indexOf('input') != -1;
                            const ioNode = df.getNodeFromId(connection.node);
                            const nodeName = ioNode.data.itemname || ioNode.data.name;
                            connections.push({
                                name: isInput ? `${nodeName}To${selfName}` : `${selfName}To${nodeName}`,
                                ...connection,
                            });
                            if (isInput) {
                                inputsUsed += 1;
                            } else {
                                outputsUsed += 1;
                            }                                           
                        } 
                    });
                }
            });
            const obj = {
                connections,
                inputCount,
                inputsUsed,
                outputCount,
                outputsUsed,
            }
            // console.error(obj);
            return obj;
        }

        df.on('connectionCreated', ({ output_id, input_id, output_class, input_class }) => {
            if (output_id === nodeId.value || input_id === nodeId.value) {
                const selfNode = df.getNodeFromId(nodeId.value);
                const selfCon = getConnections();
                connections.value = selfCon.connections;
                if (selfCon.inputCount === selfCon.inputsUsed || selfCon.inputCount === 0) {
                    df.addNodeInput(nodeId.value);
                }
                if (selfCon.outputCount === selfCon.outputsUsed || selfCon.outputCount === 0) {
                    df.addNodeOutput(nodeId.value);
                }
            }
        })
        df.on('connectionRemoved', ({ output_id, input_id, output_class, input_class }) => {
            if (output_id === nodeId.value || input_id === nodeId.value) {
                const selfNode = df.getNodeFromId(nodeId.value);
                const selfCon = getConnections();
                connections.value = selfCon.connections;
                if (output_id === nodeId.value && selfCon.outputCount > 1) {
                    df.removeNodeOutput(output_id, output_class);
                } else if(selfCon.inputCount > 1) {
                    df.removeNodeInput(input_id, input_class);
                }
            }
        })

        const setAllParameters = (id) => {
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                if (id === nodeId.value) {
                const data = {
                    ...dataNode.value.data, 
                    itemname: itemname.value || '',
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
            connections.value = getConnections().connections;

            df.on('nodeDataChanged', function(id) {nextTick( () => {
                    setAllParameters(id);
                });
            })
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;

            // Data
            wearandtear.value = dataNode.value.data.wearandtear;

            setAllParameters(nodeId.value);
            
       });
        
        return {
            el, itemname, itemindex, connections, wearandtear, 
              
        }

    }    
    
})
</script>
