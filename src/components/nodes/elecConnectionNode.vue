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
            <el-form-item label="Name" label-position="left" v-show="false">
                <el-input v-model="hiddennode" df-hiddennode size="small"></el-input>
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
                    :key="item.nodeid"
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
import Helper from '../helper';
import { inject } from 'vue';

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
        const hiddennode = ref('hide');
        const linecomponent = ref([]);
        const lineComponentList = ref();
        
        // const linecompOptions = readonly([
        //     'Breaker',
        //     'Transformer',
        //     'Diode',
        // ]);

        const helper = new Helper;

        // Grab the global emitter instance
        const emitter = inject('emitter')
        
        const handleUpdate = () => {
            emitter.emit('updatenode');
        }

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
                    // if (typeof dataNode.value.data.linecomponent === "string" || (dataNode.value.data.linecomponent !== undefined && !helper.isObject(dataNode.value.data.linecomponent))) {
                    //     // on import of cfg - node is just by name - need to make object
                    //     // get node by name
                    //     getlineComponentList(-1);
                    //     let savename = dataNode.value.data.linecomponent;
                    //     //savename can be a list comma separated.
                    //     const linecompArray = savename.split(',');

                    //     dataNode.value.data.linecomponent = [];
                    //     linecomponent.value = [];
                    //     linecompOptions.forEach((element) => {
                    //         linecompArray.forEach((lc) => {
                    //         let linecomp = helper.getNodebyName(lc, df, element);
                    //             if (!helper.isObjectEmpty(linecomp)) {
                    //                 dataNode.value.data.linecomponent.push(linecomp);
                    //                 linecomponent.value.push(linecomp);
                    //             }
                    //         });
                    //     });
                    //} else {
                        helper.checkmultiselected(dataNode.value.data.linecomponent, lineComponentList, linecomponent, df, nodeId, { linecomponent: linecomponent.value, ...dataNode.value.data }, dataNode);
                    //}
                    const data = {
                        ...dataNode.value.data, 
                        itemname: itemname.value || '',
                        linecomponent: linecomponent.value || '',
                    };
                    df.updateNodeDataFromId(nodeId.value, data);
                    handleUpdate();
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
                    getlineComponentList(id);
                });
            })
            df.on('nodeRemoved', function(id) {nextTick( () => {
                    getlineComponentList(id);
                });
            })
            
            itemname.value = dataNode.value.data.itemname;
            itemindex.value = dataNode.value.data.index;

            linecomponent.value = dataNode.value.data.linecomponent;
            hiddennode.value = dataNode.value.data.hiddennode;
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
            el, itemname, itemindex, hiddennode, linecomponent, lineComponentList, setlineComponentOption
              
        }

    }    
    
})
</script>
