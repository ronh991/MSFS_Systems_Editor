<template>
    <div ref="el">
        <nodeHeader :title="itemname" nodeType="Area" :index="itemindex" sysID="3"/>
      <el-form
        label-width="auto"
      >
        
        <div ref="properties">
            <el-form-item label="Name" label-position="left">
                <el-input v-model="itemname" df-itemname  size="small"></el-input>
            </el-form-item>
            <el-form-item label="Volume" label-position="left">
                <el-input v-model="volume" df-volume size="small"></el-input>
            </el-form-item>
            <el-form-item label="Bleed" label-position="left">
                <el-input v-model="bleed" df-bleed size="small"></el-input>
            </el-form-item>
            <el-form-item label="Ambient" label-position="left">
                <el-input v-model="ambient" df-ambient size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="openingnames === '' || openingnames === undefined" label="Opening Ind" label-position="left">
                <el-input v-model="openingindicies" df-openingindicies size="small"></el-input>
            </el-form-item>
            <el-form-item label="Opening Nam" label-position="left">
                <el-input v-model="openingnames" df-openingnames size="small"></el-input>
            </el-form-item>
            <el-form-item v-if="packsList.length > 0" label="PID" label-position="left">
                <el-input v-model="packpid" df-packpid size="small"></el-input>
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
    setup() {
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const dataNode = ref({});
        const itemname = ref('');
        const itemindex = ref('');

        // Data items
        const volume = ref();
        const bleed = ref();
        const ambient = ref(0);
        const openingindicies = ref();
        const openingnames = ref('');
        const packpid = ref();

        const packsList = ref([]);

        const helper = new Helper;

        const getPacks = () => {
            const exportdata = df.export();
            const packs = Object.entries(exportdata.drawflow.Home.data).filter(([key,node]) => node.class === 'Pack');
            if (packs) {
                packsList.value = packs.map(([k,c]) => ({name: c.data.itemname === "" || c.data.itemname === undefined ? c.data.name : c.data.itemname, index: c.data.index, nodeid: c.id}));
            }
            setAllParameters();
        }

        const setAllParameters = () => {
            // need to test for deleted nodes - cause error
            if (Object.entries(df.export().drawflow.Home.data).filter(([key,node]) => key == nodeId.value).length > 0) {
                //helper.checkselected(dataNode.value.data.bleedcurve, curveList, bleedcurve, df, nodeId, {bleedcurve: bleedcurve.value, ...dataNode.value.data});
                const data = {
                    itemname: itemname.value || '',
                    volume: volume.value || '',
                    bleed: bleed.value || '',
                    ambient: ambient.value || '',
                    openingindicies: openingindicies.value || '',
                    openingnames: openingnames.value || '',
                    packpid: packpid.value || '',
                    ...dataNode.value.data };
                df.updateNodeDataFromId(nodeId.value, data);
           }
        }

        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)
            
            itemindex.value = dataNode.value.data.index;
            itemname.value = dataNode.value.data.itemname;   

            df.on('nodeDataChanged', getPacks);
            df.on('nodeCreated', getPacks);
            df.on('nodeRemoved', getPacks);
            
            volume.value = dataNode.value.data.volume;
            bleed.value = dataNode.value.data.bleed;
            ambient.value = dataNode.value.data.ambient;
            openingindicies.value = dataNode.value.data.openingindicies;
            openingnames.value = dataNode.value.data.openingnames;
            packpid.value = dataNode.value.data.packpid;

            getPacks();
       });
        
        return {
            el, itemname, itemindex, volume, bleed, ambient, openingindicies, openingnames, packpid, packsList,
              
        }

    }    
    
})
</script>
