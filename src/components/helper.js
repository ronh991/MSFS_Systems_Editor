export default class Helper {
	constructor() {
        //df = getCurrentInstance().appContext.config.globalProperties.$df.value;
    }

    getlistNodes(sysID) {
  // list the available nodes and the input and output count
            const listNodes = ([ [
                {
                    name: 'Tank',
                    item: 'FTank',
                    input:1,
                    output:1,
                },
                {
                    name: 'Pump',
                    item: 'FPump',
                    input:1,
                    output:1,
                },
                {
                    name: 'Junction',
                    item: 'FJunction',
                    input:1,
                    output:1,
                },
                {
                    name: 'FuelValve',
                    item: 'FValve',
                    input:1,
                    output:1,
                }, 
                {
                    name: 'Engine',
                    item: 'FEngine',
                    input:1,
                    output:0,
                },
                {
                    name: 'APU',
                    item: 'FAPU',
                    input:1,
                    output:0,
                },        
                {
                    name: 'Curve',
                    item: 'Curve',
                    input:0,
                    output:0,
                },
                {
                    name: 'Trigger',
                    item: 'FTrigger',
                    input:0,
                    output:0,
                },
                {
                    name: 'FuelBurner',
                    item: 'FBurner',
                    input:1,
                    output:0,
                }, 
                {
                    name: 'Burner',
                    item: 'BBurner',
                    input:1,
                    output:0,
                }, 
                {
                    name: 'BurnerValve',
                    item: 'BValve',
                    input:1,
                    output:1,
                }, 
                                
            ],
        
            [
                {
                    name: 'Circuit',
                    item: 'Circuit',
                    input:1,
                    output:1,
                },
                {
                    name: 'Battery',
                    item: 'Battery',
                    input:1,
                    output:1,
                },
                {
                    name: 'External Power',
                    item: 'ExternalPower',
                    input:0,
                    output:1,
                },
                {
                    name: 'Generator',
                    item: 'Generator',
                    input:0,
                    output:1,
                },
                {
                    name: 'Bus',
                    item: 'Bus',
                    input:1,
                    output:1,
                },
                {
                    name: 'Relay',
                    item: 'Relay',
                    input:0,
                    output:0,
                },
                {
                    name: 'SupplierCfg',
                    item: 'SupplierCfg',
                    input:0,
                    output:0,
                },
                {
                    name: 'ConsumerCfg',
                    item: 'ConsumerCfg',
                    input:0,
                    output:0,
                },
                {
                    name: 'Curve',
                    item: 'Curve',
                    input:0,
                    output:0,
                },
                {
                    name: 'Connection',
                    item: 'Connection',
                    input:0,
                    output:0,
                },
                {
                    name: 'Breaker',
                    item: 'Breaker',
                    input:0,
                    output:0,
                },
                {
                    name: 'Transformer',
                    item: 'Transformer',
                    input:0,
                    output:0,
                },
                {
                    name: 'Diode',
                    item: 'Diode',
                    input:0,
                    output:0,
                },
            
            ],
        
            [
                {
                    name: 'Reservoir',
                    item: 'Reservoir',
                    input:0,
                    output:1,
                },
                {
                    name: 'Pump',
                    item: 'HPump',
                    input:1,
                    output:1,
                },
                {
                    name: 'PTU',
                    item: 'PTU',
                    input:2,
                    output:4,
                },
                {
                    name: 'Actuator',
                    item: 'Actuator',
                    input:1,
                    output:0,
                },
                {
                    name: 'Junction',
                    item: 'HJunction',
                    input:1,
                    output:1,
                },
                {
                    name: 'Trigger',
                    item: 'HTrigger',
                    input:0,
                    output:0,
                },
                {
                    name: 'Accumulator',
                    item: 'Accumulator',
                    input:0,
                    output:0,
                },
                {
                    name: 'Valve',
                    item: 'HValve',
                    input:0,
                    output:0,
                },
                {
                    name: 'Combiner',
                    item: 'HCombiner',
                    input:1,
                    output:1,
                },
                {
                    name: 'Separator',
                    item: 'HSeparator',
                    input:1,
                    output:1,
                },
            
            ],
        
            [
            {
                    name: 'APU',
                    item: 'PAPU',
                    input:1,
                    output:1,
                },
            {
                    name: 'Engine',
                    item: 'PEngine',
                    input:1,
                    output:1,
                },
            {
                    name: 'RamAir',
                    item: 'RamAir',
                    input:1,
                    output:1,
                },
            {
                    name: 'Pack',
                    item: 'Pack',
                    input:1,
                    output:1,
                },
            {
                    name: 'MixerUnit',
                    item: 'MixerUnit',
                    input:1,
                    output:1,
                },
            {
                    name: 'Area',
                    item: 'Area',
                    input:1,
                    output:1,
                },
            {
                    name: 'Outlet',
                    item: 'Outlet',
                    input:0,
                    output:0,
                },
            {
                    name: 'Junction',
                    item: 'PJunction',
                    input:1,
                    output:1,
                },
            {
                    name: 'Valve',
                    item: 'PValve',
                    input:1,
                    output:1,
                },
            {
                    name: 'Fan',
                    item: 'Fan',
                    input:0,
                    output:0,
                },
            {
                    name: 'Parameters',
                    item: 'Parameters',
                    input:0,
                    output:0,
                },
            {
                    name: 'Curve',
                    item: 'Curve',
                    input:0,
                    output:0,
                },
            
            ],
        
            [
                {
                    name: 'Tank',
                    item: 'LTank',
                    input:0,
                    output:1,
                },
                {
                    name: 'Door',
                    item: 'Door',
                    input:0,
                    output:0,
                },
                {
                    name: 'Scoop',
                    item: 'Scoop',
                    input:0,
                    output:0,
                },
                {
                    name: 'Curve',
                    item: 'Curve',
                    input:0,
                    output:0,
                },
            
            ],

            [
                {
                    name: 'Burner',
                    item: 'BBurner',
                    input:1,
                    output:0,
                }, 
                {
                    name: 'Valve',
                    item: 'BValve',
                    input:1,
                    output:1,
                }, 

            ]
        ])
        return listNodes[sysID];
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
            //if (graph !== undefined) {
                if(classname !== undefined) {
                    for (const [ioKey, ioValue] of Object.entries(graph)) {
                        if (ioValue.data.itemname === nodeName && ioValue.class === classname) {
                            //make a node object
                            found = true;
                            nodeObj = { name: ioValue.data.itemname, index: ioValue.data.index, nodeid: ioValue.id };
                            break;
                        };
                    }
                } else {
                    for (const [ioKey, ioValue] of Object.entries(graph)) {
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
            //}
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
                const sOutputKey = `output_${Object.keys(gSource.outputs).length}`;
                const dInputKey = `input_${Object.keys(gDest.inputs).length}`;

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
                
                const sOutputKeyNext = `output_${Object.keys(gSource.outputs).length + 1}`;
                const dInputKeyNext = `input_${Object.keys(gDest.inputs).length + 1}`;

                if(sourceNode.class !== 'HCombiner') {
                    gSource.outputs[sOutputKeyNext] = {
                        "connections": []
                    };
                }
                if(destinationNode.class !== 'HSeparator') {
                    gDest.inputs[dInputKeyNext] = {
                        "connections": []
                    };
                }
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

                        const sOutputKey = PTUNames_inout[sourceName[1]];
                        const dInputKey = `input_${Object.keys(gDest.inputs).length}`;
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
                        const dInputKeyNext = `input_${Object.keys(gDest.inputs).length + 1}`;
                        gDest.inputs[dInputKeyNext] = {
                            "connections": []
                        };
                    }
                } else if (destName.includes('.')) {
                    // PTU dot issue
                    destName = destName.split('.');
                    if (destinationNode.class === "PTU") {
                        // set input key and outputkey
                        // gsource has dot

                        const sOutputKey = `output_${Object.keys(gSource.outputs).length}`;
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
                        const sOutputKeyNext = `output_${Object.keys(gSource.outputs).length + 1}`;
                        gSource.outputs[sOutputKeyNext] = {
                            "connections": []
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

        // check line name has no _To_, to _to_ - set to To
        linenameCheck(line) {
            let linenameCheck = line['itemname'].split('_To_');
            if (linenameCheck.length > 1) {
                return linenameCheck[0] + 'To' + linenameCheck[1];
            }
            // matches to many names
            // linenameCheck = line['itemname'].split('to');
            // if (linenameCheck.length > 1) {
            //     return linenameCheck[0] + 'To' + linenameCheck[1];
            // }
            linenameCheck = line['itemname'].split('_to_');
            if (linenameCheck.length > 1) {
                return linenameCheck[0] + 'To' + linenameCheck[1];
            }
            return line['itemname'];
        }

}