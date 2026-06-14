export default class Helper {
	constructor() {
        //df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    }

    setitemname(itemname, dataNode) {
        if (itemname.value === null || itemname.value === undefined || itemname.value ==='') {
            //return dataNode.value.data.name;
            itemname.value = dataNode.value.data.name;  
        } //else {
            //dataNode.value.data.name = itemname.value;  
        //}
    }

    setparameter(dataNodevalue, paramvalue) {
        if (paramvalue !== undefined)
            dataNodevalue = paramvalue;
    }

    checkmultiselected(dataNodevaluedata, selectList, selectValues, df, nodeId, dataparamobj, dataNode) {
            // check all selected - compare and update names for config export
            if (selectValues.value !== undefined && !this.isObjectEmpty(selectValues.value) && selectValues.value !== "") {
                if (dataNodevaluedata !== undefined && dataNodevaluedata !== "") {
                    selectList.value.forEach((obj) => {
                        let counter = 0;
                        dataNodevaluedata.forEach(element => {
                            if (element.nodeid === obj.nodeid && element.name !== obj.name)
                            {
                                selectValues.value[counter].name = obj.name;
                            }
                            counter++;
                        });
                        //dataNode = selectValues;
                        //const data = { ...dataNode.value.data };
                        //df.updateNodeDataFromId(nodeId.value, dataparamobj);
                    });
                    // find any deleted 
                    dataNodevaluedata.forEach(element => {
                        let found = false;
                        selectList.value.forEach((obj) => {
                            if(element.nodeid === obj.nodeid) {
                                found = true;
                            }
                        });
                        if (!found) {
                            let listCounter = 0;
                            selectValues.value.forEach((obj) => {
                                if (obj.nodeid === element.nodeid) {
                                    selectValues.value.splice(listCounter, 1);
                                }
                                listCounter++;
                            })
                        }
                    });
                } else {
                    df.updateNodeDataFromId(nodeId.value, dataparamobj);
                }
            }
        }

        //not needed dataNodevaluedata is alway undefined - but should be for naming
    checkselected(dataNodevaluedata, selectList, selectValues, df, nodeId, dataparamobj) {
                // check all selected - compare and update names for config export
            // if(dataNodevaluedata === undefined && selectValues.value !== undefined) {
            //    dataNodevaluedata = { name: selectValues.name, index: 1, nodeid: 0 };
            // }
            if (selectValues.value !== undefined && !this.isObjectEmpty(selectValues.value) && selectValues.value !== "") {
                if (dataNodevaluedata !== undefined && dataNodevaluedata !== "") {
                    selectList.value.forEach((obj) => {
                        let counter = 0;
                        //dataNode.forEach(element => {
                            if (dataNodevaluedata.nodeid === obj.nodeid && dataNodevaluedata.name !== obj.name)
                            {
                                selectValues.value[counter].name = obj.name;
                            }
                        //    counter++;
                        //});
                        dataNodevaluedata = selectValues;
                        //const data = { oneway: oneWay.value, ...dataNode.value.data };
                        //const data = { paramstr,  ...dataNode.value.data };
                        //df.updateNodeDataFromId(nodeId.value, dataparamobj);
                    });
                    // find any deleted 
                    //dataNode.forEach(element => {
                        let found = false;
                        selectList.value.forEach((obj) => {
                            if(dataNodevaluedata.value.nodeid === obj.nodeid) {
                                found = true;
                            }
                        });
                        if (!found) {
                            //let listCounter = 0;
                            //selectValues.value.forEach((obj) => {
                                if (selectValues.nodeid === dataNodevaluedata.nodeid) {
                                    selectValues.value = '';
                                }
                                //listCounter++;
                            //})
                        }
                    //});
                } //else {
                    //selectValues.value = '';
                    //df.updateNodeDataFromId(nodeId.value, dataparamobj);
                //}
            }
        }

    checklinemultiselected(dataNodevaluedata, selectList, selectValues, df, dataparamobj, dataNode) {
                // check all selected - compare and update names for config export
            if (selectValues.value !== undefined && !this.isObjectEmpty(selectValues.value) && selectValues.value !== "") {
                if (dataNodevaluedata !== undefined && dataNodevaluedata !== "" &&  dataNodevaluedata !== null && selectList !== "") {
                    selectList.value.forEach((obj) => {
                        let counter = 0;
                        dataNodevaluedata.forEach(element => {
                            if (element.nodeid === obj.nodeid && element.name !== obj.name)
                            {
                                selectValues.value[counter].name = obj.name;
                            }
                            counter++;
                        });
                        //dataNode = selectValues;
                        //const data = { ...dataNode.value.data };
                        //df.updateNodeDataFromId(nodeId.value, dataparamobj);
                    });
                    // find any deleted 
                    dataNodevaluedata.forEach(element => {
                        let found = false;
                        selectList.value.forEach((obj) => {
                            if(element.nodeid === obj.nodeid) {
                                found = true;
                            }
                        });
                        if (!found) {
                            let listCounter = 0;
                            selectValues.value.forEach((obj) => {
                                if (obj.nodeid === element.nodeid) {
                                    selectValues.value.splice(listCounter, 1);
                                }
                                listCounter++;
                            })
                        }
                    });
                } else {
                    df.updateNodeDataFromId(nodeId.value, dataparamobj);
                }
            }
        }

        checkNodeidindfxxx(nodeId, df)
        {
            let found = false;
            Object.entries(df.drawflow.drawflow.Home.data).forEach(([ioKey, ioValue]) => {
                if (ioValue.id.toString() === nodeId) {
                    found = true;
                }
            });

            return found;
        }

        getNodebyName(nodeName, graph, classname)
        {
            let found = false;
            let nodeObj = {};
            //const nodes = Object.entries(exportdata.drawflow.Home.data).filter(([key,ioValue]) => ioValue.class === 'ConsumerCfg');
            if(classname !== undefined) {
                for (const [ioKey, ioValue] of Object.entries(graph.drawflow.Home.data)) {
                    if (ioValue.data.itemname === nodeName && ioValue.class === classname) {
                        //make a node object
                        found = true;
                        nodeObj = { name: ioValue.data.itemname, index: ioValue.data.index, nodeid: ioValue.id };
                        break;
                    };
                }
            } else {
                for (const [ioKey, ioValue] of Object.entries(graph.drawflow.Home.data)) {
                    if (ioValue.data.itemname === nodeName) {
                        //make a node object
                        found = true;
                        nodeObj = { name: ioValue.data.itemname, index: ioValue.data.index, nodeid: ioValue.id };
                        break;
                    };
                }
            }
             // Object.entries(df.drawflow.drawflow.Home.data).forEach(([ioKey, ioValue]) => {
            //     if (ioValue.data.itemname === nodeName) {
            //             //make a node object
            //             found = true;
            //             nodeObj = { name: nodeName, index: ioValue.data.index, nodeid: ioValue.id };
            //             return nodeObj;
            //     };
            //     if (found) {
            //         return nodeObj;
            //     }
            // });
            return nodeObj;
        }

        isObject(value) {
            return typeof value === 'object' && value !== null;
        }

        isObjectEmpty(obj) {
            return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
        }

        setDataNodeObj() {

        }

        setgraphData(graph, sourceName, destName)	{

            const PTUNames_inout = 
                {'MotorInput': 'input_1',
                'PumpInput': 'input_2',
                'MotorOutput': 'output_1',
                'MotorRelief': 'output_2',
                'PumpOutput': 'output_3',
                'MotorRelief': 'output_4'};
            
            const graphNodes = Object.values(graph.drawflow.Home.data);
            const sourceNode = graphNodes.find( n => n.data.itemname === (sourceName.includes('.') ? sourceName.split('.')[0] : sourceName));
            const destinationNode = graphNodes.find( n => n.data.itemname === (destName.includes('.') ? destName.split('.')[0] : destName));
            const gSource = graph.drawflow.Home.data[sourceNode.id];
            const gDest = graph.drawflow.Home.data[destinationNode.id];
       
            if (sourceNode.class !== "PTU" && destinationNode.class !== "PTU") {
                // for special PTU we must add 2 inputs and 4 outputs if none are already set			
                const sOutputKey = `output_${Object.keys(gSource.outputs).length + 1}`;
                const dInputKey = `input_${Object.keys(gDest.inputs).length + 1}`;

                gSource.outputs[sOutputKey] = {
                    "connections": [
                        {
                            "node": destinationNode.id,
                            "output": dInputKey,
                        }
                    ]
                };
                gDest.inputs[dInputKey] = {
                    "connections": [
                        {
                            "node": sourceNode.id,
                            "input": sOutputKey,
                        }
                    ]
                };
            } else {
                // look at source, if dot then source is PTU and rom an output
                // dest should be a simple node, you just add inputs to it
                // source with dot means from a PTU output

                // if dot then check PTU
                if (sourceName.includes('.'))	{
                    // PTU dot issue
                    sourceName = sourceName.split('.');
                    if (sourceNode.class === "PTU") {
                        // set input key and outputkey
                        // gsource has dot

                        // check if PTU has all inputs outputs set
                        if (Object.keys(gSource.outputs).length === 0) {
                            // add in empty outputs
                            gSource.outputs['input_1'] = {
                                "connections": []                          
                            }
                            gSource.outputs['input_2'] = {
                                "connections": []                         
                            }
                            gSource.outputs['input_3'] = {
                                "connections": []                         
                            }
                            gSource.outputs['input_4'] = {
                                "connections": []                          
                            }
                        }

                        const sOutputKey = PTUNames_inout[sourceName[1]];
                        const dInputKey = `input_${Object.keys(gDest.inputs).length + 1}`;
                        gSource.outputs[sOutputKey] = {
                            "connections": [
                                {
                                    "node": destinationNode.id,
                                    "output": dInputKey,
                                }
                            ]
                        };
                        gDest.inputs[dInputKey] = {
                            "connections": [
                                {
                                    "node": sourceNode.id,
                                    "input": sOutputKey,
                                }
                            ]
                        };
                    }
                } else if (destName.includes('.')) {
                    // PTU dot issue
                    destName = destName.split('.');
                    if (destinationNode.class === "PTU") {
                        // set input key and outputkey
                        // gsource has dot

                        // check if PTU has all inputs outputs set
                        if (Object.keys(gDest.inputs).length === 0) {
                            // add in empty outputs
                            gDest.inputs['input_1'] = {
                                "connections": []                          
                            }
                            gDest.inputs['input_2'] = {
                                "connections": []                         
                            }
                        }

                        const sOutputKey = `output_${Object.keys(gSource.outputs).length + 1}`;
                        const dInputKey = PTUNames_inout[destName[1]];
                        gSource.outputs[sOutputKey] = {
                            "connections": [
                                {
                                    "node": destinationNode.id,
                                    "output": dInputKey,
                                }
                            ]
                        };
                        gDest.inputs[dInputKey] = {
                            "connections": [
                                {
                                    "node": sourceNode.id,
                                    "input": sOutputKey,
                                }
                            ]
                        };
                    }
                }
            }
        }


        getNextKeyH(val) {
            // set to zero for any non data nodes
            //const keys = val.map(v => (v.data && v.data.index) || "0");
            const keys = val.map(v => (v.data.index) || 0);
            const sortedArr = [...keys].sort((a, b) => a - b);
            let lowest = 1;
            for (let i = 1; i < sortedArr.length +1; i++) {
            if (sortedArr[i] === lowest) {
                lowest++;
            } else if (sortedArr[i] > lowest) {
                return lowest;
            }
            }
            return lowest;
        }

}