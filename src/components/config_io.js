export default class Config {
	constructor() {
    }

  // WRITE CFG data to cfg file format

  // returns a configuration-formatted string of the properties with non-empty values
  writeNodeConfig(properties) {
    let out = '';
    Object.keys(properties).map( p => {
      if (properties[p] != '') {
        out += ` #${p}:${properties[p]}`;
      }
    });
    return out;    
  }

  // convertLines is a helper method to generate the config strings
  // called from nodeEdit
  convertLines(lines, sysID) {
    let output = '';
	let hydrLineCounter = 1;
    lines.forEach(line => {
		// need without source destination ??
		if (line.showinList) {
			let lineStr = `Line.${line.index} = Name:${line.name} `;   
			if (sysID === 2) {
				lineStr = `Line.${hydrLineCounter} = Name:${line.name} `;
				hydrLineCounter++;
			}   
			switch (sysID) {
				case 0:
					lineStr += ` #Source:${line.source} #Destination:${line.destination} `;      
					lineStr += this.writeNodeConfig({
						'FuelFlowAt1PSI': line.data.fuelflow || '',
						'Volume': line.data.volume || '',
						'GravityBasedFuelFlow': line.data.gravityflow || '',
					});
					break;
				case 1:
					if (line.data.lineconnection !== undefined && line.data.lineconnection !== '') {
						lineStr += this.writeNodeConfig({
							'Connection': line.data.lineconnection + '(' + line.source +',' + line.destination + ')' || '',
						});
					}
					if (line.data.connectioncomponentlist !== undefined && line.data.connectioncomponentlist !== '') {
						let linecomponentList = line.data.connectioncomponentlist.map(obj => obj.name)
						lineStr += this.writeNodeConfig({
							'Connection': line.source +',' + line.destination || '',
							'Components': linecomponentList || '',
						});
					} else {
						lineStr += this.writeNodeConfig({
							'Connection': line.source +',' + line.destination || '',
						});
					}

					break;
				case 2:
					if (line.showinList) {
						if (line.data.lineinputs !== undefined && line.data.lineinputs !== '') {
							lineStr += this.writeNodeConfig({
								'Inputs': line.data.lineinputs || '',
							});
							// // fix not needing 'Inputs'
							// if (PTU) {
							// 	lineStr += this.writeNodeConfig({
							// 		'Inputs': PTUName + '.PumpOutput' || '',
							// 	});
							// }
						}
						if (line.data.lineoutputs !== undefined && line.data.lineoutputs !== '') {
							lineStr += this.writeNodeConfig({
								'Outputs': line.data.lineoutputs || '',
							});
							// // fix not needing 'Outputs' build the total line of values
							// if (PTU) {
							// 	lineStr += this.writeNodeConfig({
							// 		'Outputs': PTUName + '.PumpInput' || '',
							// 		'Outputs': PTUName + '.MotorInput' || '',
							// 	});
							// }
						}
						if (line.data.hydraccumulatorcomponentlist !== undefined && line.data.hydraccumulatorcomponentlist !== '') {
							let lineaccumulatorcomponentList = line.data.hydraccumulatorcomponentlist.map(obj => obj.name)
							lineStr += this.writeNodeConfig({
								'Accumulator': lineaccumulatorcomponentList || '',
							});
						}
						if (line.data.hydrvalvecomponentlist !== undefined && line.data.hydrvalvecomponentlist !== '') {
							let hydrvalvecomponentList = line.data.hydrvalvecomponentlist.map(obj => obj.name)
							lineStr += this.writeNodeConfig({
								'Valves': hydrvalvecomponentList || '',
							});
						}
						// if (Valves) {
						// 	lineStr += this.writeNodeConfig({
						// 		'Valves': ValveName || '',
						// 	});
						// }
						lineStr += this.writeNodeConfig({
							'NonReturn': line.data.hydrlinenonreturn || '',
							'WearAndTearCollision': line.data.hydrlinewearandtear || '',
						});
					}
					break;
				case 3:
					lineStr += ` #Source:${line.source} #Destination:${line.destination} `;      
					lineStr += this.writeNodeConfig({
						'MaxFlow': line.data.pneumaxflow || '',
						'Volume': line.data.pneuvolume || '',
					});
					if (line.data.pneufan !== undefined) {
						//let linefanname = line.data.pneufan.name;
						lineStr += this.writeNodeConfig({
							'Fan': line.data.pneufan.name || '',
						});
					}
					if (line.data.pneuvalvecomponentlist !== undefined && line.data.pneuvalvecomponentlist !== '') {
						let linevalvecomponentList = line.data.pneuvalvecomponentlist.map(obj => obj.name)
						lineStr += this.writeNodeConfig({
							'Valves': linevalvecomponentList || '',
						});
					}

					break;
				case 4:
					// no lines in liquid
					break;
			}
			output += lineStr + '\n';
		}
	});
    return output;
  }


  // convertNodes transforms the node graph to MSFS configuration strings
  // arg lines must come from configState
  // called from node Edit
  
  nullSelectionList(nodedata) {
	let selectList = '';
	if (nodedata !== undefined && nodedata !== "") {
		selectList = nodedata.map(obj => obj.name)
		return selectList;
	}
	return '';
  }

  convertNodes(nodes, lines, sysID, systemType) {
	// must match sortorder
  	const classname2paramnames = [
		{
			FTank: 'Tank',
			FEngine: 'Engine',
			FValve: 'Valve',
			FJunction: 'Junction',
			Burner: 'Burner',
			BValve: 'Valve',
			FTrigger: 'Trigger',
			FAPU: 'APU',
			Curve: 'Curve',
			FPump: 'Pump',
		},
		{
			Circuit: 'Circuit',
			Battery: 'Battery',
			ExternalPower: 'ExternalPower',
			Generator: 'Generator',
			Bus: 'Bus',
			Breaker: 'Breaker',
			Transformer: 'Transformer',
			Diode: 'Diode',
			Connection: 'Connection',
			Relay: 'Relay',
			Curve: 'Curve',
			ConsumerCfg: 'ConsumerCfg',
			SupplierCfg: 'SupplierCfg',
		},
		{
			Reservoir: 'Reservoir',
			HPump: 'Pump',
			PTU: 'PTU',
			HJunction: 'Junction',
			HValve: 'Valve',
			Actuator: 'Actuator',
			HTrigger: 'Trigger',
			Accumulator: 'Accumulator',
			HCombiner: 'Combiner',
			HSeparator: 'Separator'
		},
		{
			PAPU: 'APU',
			PEngine: 'Engine',
			RamAir: 'RamAir',
			Pack: 'Pack',
			MixerUnit: 'MixerUnit',
			Area: 'Area',
			Outlet: 'Outlet',
			PJunction: 'Junction',
			PValve: 'Valve',
			Fan: 'Fan',
			Curve: 'Curve',
		},
		{
			Curve: 'Curve',
			LTank: 'Tank',
			Door: 'Door',
			Scoop: 'Scoop',
		},
	]

	let output = '['+systemType[sysID].label.toUpperCase()+']'+'\n'+systemType[sysID].version+'\n';
	let valvecounter = 1; // some systems have 2 different vale types
    nodes.sort((a, b) => a.class.localeCompare(b.class)).forEach(node => {
      const inputLines = lines.filter(line => line.destination === (node.data.itemname || node.data.name)).map( line => line.name);
      const outputLines = lines.filter(line => line.source === (node.data.itemname || node.data.name)).map( line => line.name);
      //let nodeStr = `${node.class}.${node.data.index} = Name:${node.data.itemname || node.data.name} `;
	  let nodestrkey = '';
	  if (classname2paramnames[sysID][node.class].includes("Valve")) {
		nodestrkey = `${classname2paramnames[sysID][node.class]}.` + valvecounter.toString();
		valvecounter++;
	  } else{
		nodestrkey = `${classname2paramnames[sysID][node.class]}.${node.data.index}`;
	  }
      let nodeStr = nodestrkey + ` = Name:${node.data.itemname || node.data.name} `;
      if(node.data.itemtitle) {
        nodeStr += `#Title:${node.data.itemtitle || ''} `;
      }
      switch (node.class) {
      	case 'FEngine': 
      		nodeStr += `#Index:${node.data.engineindex || node.data.index} `;
      		break;
        case 'FTank':
          nodeStr += this.writeNodeConfig({
            'Capacity': node.data.capacity || '',
            'UnusableCapacity': node.data.unusablecapacity || '',
            'Position': node.data.position || '0,0,0',
            'InputOnlyLines': inputLines.join(','),
            'OutputOnlyLines': outputLines.join(','),
            'DropTimer': node.data.droptimer || '',
            'Priority': node.data.priority || '',
			'PressureCurve': node.data.curve || '',
          });
          break;
        case 'FPump':
          nodeStr += this.writeNodeConfig({
            'Pressure': node.data.pressure || '',
            'PressureCurve': node.data.curve || '',
            'TankFuelRequired': node.data.tankfuelrequired || '',
            'DestinationLine': outputLines[0],
            'Type': node.data.pumptype || '',
            'Index': node.data.droptimer || '',
            'AutoCondition': node.data.autocondition || '',
            'PressureDecreaseRate': node.data.pressuredecrease || '',
          });
          break;
        case 'FJunction':
          const optionList = node.data.optionlist;
          const optionStr = optionList && optionList.filter(opt => opt.length).map(options => `#Option:${options.join(',')}`).join(' ');
          const oneWayListNames = node.data.onewaylist || inputLines.concat(outputLines);
          // filter to only list the one-way lines
          const inputOnly = inputLines.filter(n => oneWayListNames.includes(n));
          const outputOnly = outputLines.filter(n => oneWayListNames.includes(n));
          nodeStr += optionStr || ''; 
          nodeStr += this.writeNodeConfig({
            'InputOnlyLines': inputOnly.join(','),
            'OutputOnlyLines': outputOnly.join(','),
          });
          break;
        case 'FValve':
          nodeStr += node.data.oneway ? `#DestinationLine:${outputLines.join(',')} ` : '';
          nodeStr += this.writeNodeConfig({
            'OpeningTime': node.data.openingtime || '',
            'Circuit': node.data.circuitindex || '',
          });          
          break;
        case 'FAPU':
          nodeStr += `#FuelBurnRate:${node.data.fuelburn || ''}`;
          break;  
        case 'Curve':
          // this overwrites the nodeStr removing #Name and #Title
          nodeStr = `${node.class}.${node.data.index} = ${node.data.params}`;
          break; 
        case 'FTrigger':
          nodeStr += this.writeNodeConfig({
            'Target': node.data.target || '',
            'Threshold': node.data.threshold || '',
            'Index': node.data.targetindex || '',
            'DelayTrue': node.data.delaytrue || '',
            'DelayFalse': node.data.delayfalse || '',
            'Condition': node.data.condition || '',
            'EffectTrue': node.data.effecttrue || '',
            'EffectFalse': node.data.effectfalse || '',
            'iParam': node.data.iparam || '',
          });
          break;
		case 'Burner':
			nodeStr += `#Index:${node.data.engineindex || node.data.index} `;
			break;
        case 'BValve':
          break;
		case 'Circuit':
			if (node.data.consumerCfg !== '' && node.data.consumerCfg !== undefined) {
				nodeStr += this.writeNodeConfig({
					'ConsumerCfg': node.data.consumerCfg.name || '',
					'Type': node.data.circuittype || '',
				});
			}
			else {
				nodeStr += this.writeNodeConfig({
					'Type': node.data.circuittype || '',
					'CType': node.data.cType || '',
					'Amperage': node.data.amperage || '',
					'Voltage': node.data.voltage || '',
					'Wattage': node.data.wattage || '',
					'Resistance': node.data.resistance || '',
					'ResistanceMin': node.data.resistancemin || '',
					'ResistanceMax': node.data.resistancemax || '',
				});
			}
			if (node.data.cType === "Battery") {
				nodeStr += this.writeNodeConfig({
					'ChargeCRate': node.data.chargecrate || '',
					'Capacity': node.data.capacity || '',
				});
			}
			nodeStr += this.writeNodeConfig({
				'WearAndTearCollision': node.data.wearandtear || '',
			});
			break;
		case 'Battery':
			if (node.data.consumerCfg !== '' && node.data.consumerCfg !== undefined) {
				nodeStr += this.writeNodeConfig({
					'ConsumerCfg': node.data.consumerCfg.name || '',
				});
			}
			else {
				nodeStr += this.writeNodeConfig({
					'CType': 'Battery',
					'Amperage': node.data.amperage || '',
					'Voltage': node.data.voltage || '',
					'Wattage': node.data.wattage || '',
					'Resistance': node.data.resistance || '',
					'ResistanceMin': node.data.resistancemin || '',
					'ResistanceMax': node.data.resistancemax || '',
					'ChargeCRate': node.data.chargecrate || '',
					'Capacity': node.data.capacity || '',
				});
			}
			if (node.data.supplierCfg !== '' && node.data.consumerCfg !== undefined) {
				nodeStr += this.writeNodeConfig({
					'SupplierCfg': node.data.supplierCfg.name || '',
				});
			}
			else {
				nodeStr += this.writeNodeConfig({
					'SType': 'Battery',
					'BatteryType': node.data.batterytype || '',
				});
			}
			nodeStr += this.writeNodeConfig({
				'WearAndTearCollision': node.data.wearandtear || '',
			});
			break;
		case 'ExternalPower':
			if (node.data.supplierCfg !== '' && node.data.supplierCfg !== undefined) {
				nodeStr += this.writeNodeConfig({
					'SupplierCfg': node.data.supplierCfg.name || '',
				});
			} else {
				nodeStr += this.writeNodeConfig({
					'SType': node.data.sType || '',
				});
				if (node.data.sType ==='AC') {
					nodeStr += this.writeNodeConfig({
						'Vrms': node.data.vrms || '',
						'Phase': node.data.phase || '',
						'PowerRating': node.data.powerating || '',
						'PowerFactor': node.data.powerfactor || '',
						'Frequency': node.data.frequency || '',
						'GovernedRPM': node.data.governedrpm || '',
						'GovernedRPMRatio': node.data.governedrpmratio || '',
						'ReferenceFrequency': node.data.referencefrequency || '',
						'ReferenceRPM': node.data.referencerpm || '',
						'NumberOfPoles': node.data.numberofpoles || '',
						'TensionDropRPM': node.data.tensiondroprpm || '',
					});
				} else if (node.data.sType ==='DC') {
					nodeStr += this.writeNodeConfig({
						'Voltage': node.data.voltage || '',
					});
				} else if (node.data.sType ==='Battery') {
					nodeStr += this.writeNodeConfig({
						'BatteryType': node.data.batterytype || '',
					});
				}
			}
			break;
        case 'Bus':
          	break;
		case 'Generator':
			if (node.data.supplierCfg !== '' && node.data.supplierCfg !== undefined) {
				nodeStr += this.writeNodeConfig({
					'SupplierCfg': node.data.supplierCfg.name || '',
				});
			} else {
				nodeStr += this.writeNodeConfig({
					'SType': node.data.sType || '',
				});
				if (node.data.sType ==='AC') {
					nodeStr += this.writeNodeConfig({
						'Vrms': node.data.vrms || '',
						'Phase': node.data.phase || '',
						'PowerRating': node.data.powerating || '',
						'PowerFactor': node.data.powerfactor || '',
						'Frequency': node.data.frequency || '',
						'GovernedRPM': node.data.governedrpm || '',
						'GovernedRPMRatio': node.data.governedrpmratio || '',
						'ReferenceFrequency': node.data.referencefrequency || '',
						'ReferenceRPM': node.data.referencerpm || '',
						'NumberOfPoles': node.data.numberofpoles || '',
						'TensionDropRPM': node.data.tensiondroprpm || '',
					});
				} else if (node.data.sType ==='DC') {
					nodeStr += this.writeNodeConfig({
						'Voltage': node.data.voltage || '',
					});
				} else if (node.data.sType ==='Battery') {
					nodeStr += this.writeNodeConfig({
						'BatteryType': node.data.batterytype || '',
					});
				}
			}
			nodeStr += this.writeNodeConfig({
				'WearAndTearCollision': node.data.wearandtear || '',
			});
			break;
		case 'Breaker':
			nodeStr += this.writeNodeConfig({
				'RatedCurrent': node.data.ratedcurrent || '',
				'TripCurveType': node.data.tripcurvetype || '',
			})
			break;
		case 'Transformer':
			nodeStr += this.writeNodeConfig({
				'TargetVoltage': node.data.targetvoltage || '',
			})
			break;
		case 'Diode':
			nodeStr += this.writeNodeConfig({
				'ForwardVoltage': node.data.forwardvoltage || '',
				'ReverseVoltage': node.data.reversevoltage || '',
			})
			break;
		case 'Relay':
			//let managedlineList = node.data.managedline.map(obj => obj.name)
			nodeStr += this.writeNodeConfig({
				'ManagedLine': node.data.managedline.name || '',
				'Resistance': node.data.resistance || '',
				'TensionThreshold': node.data.tensionthreshold || '',
				'DisconnectWhenPowered': node.data.disconnectedwhenpowered || '',
			})
			break;
		case 'Connection':
			let linecomponentList = '';
			if (node.data.linecomponent !== undefined && node.data.linecomponent !== '') {
				linecomponentList = node.data.linecomponent.map(obj => obj.name);
			}
			nodeStr += this.writeNodeConfig({
				'Components': linecomponentList || '',
			})
			break;
		case 'Reservoir':
			nodeStr += this.writeNodeConfig({
				'MaxCapacity': node.data.maxcapacity || '',
				'WearAndTearCollision': node.data.wearandtear || '',
			})
			break;
		case 'HPump':
				nodeStr += this.writeNodeConfig({
					'Type': node.data.pumptype || '',
					'NormalPressure': node.data.normalpressure || '',
					'NominalDisplacement': node.data.nominaldisplacement || '',
					'LiquidCapacity': node.data.liquidcapacity || '',
				})
				if (node.data.pumptype ==='EngineDriven') {
					nodeStr += this.writeNodeConfig({
						'EngineIndex': node.data.engineindex || '',
					})
				}
				if (node.data.pumptype ==='Electric' && node.data.circuitname !== '') {
					nodeStr += this.writeNodeConfig({
						'CircuitName': node.data.circuitname || '',
						'ModeType': node.data.modetype || '',
					})
				}
				if (node.data.pumptype ==='Electric' && node.data.circuitname === '') {
					nodeStr += this.writeNodeConfig({
						'CircuitIndex': node.data.circuitindex || '',
						'ModeType': node.data.modetype || '',
					})
				}
				if (node.data.pumptype ==='Electric' && node.data.modetype ==='Auto') {
					nodeStr += this.writeNodeConfig({
						'PressureThresholdPct': node.data.pressurethresholdpct || '',
					})
				}
				nodeStr += this.writeNodeConfig({
					'WearAndTearCollision': node.data.wearandtear || '',
				})
			break;
		case 'PTU':
			nodeStr += this.writeNodeConfig({
				'NormalPressure': node.data.normalpresure || '',
				'NominalDisplacement': node.data.nominaldisplacement || '',
				'WearAndTearCollision': node.data.wearandtear || '',
 			})
			if (node.data.reversible === true) {
				nodeStr += this.writeNodeConfig({
					'Reversible': (node.data.reversible ? 'Yes' : 'No') || '',
				});
			}
			break;
		case 'HJunction':
			nodeStr += this.writeNodeConfig({
				'WearAndTearCollision': node.data.wearandtear || '',
 			})
			break;
		case 'HValve':
			nodeStr += this.writeNodeConfig({
				'Type': node.data.valvetype || '',
 			})
			if (node.data.valvetype === 'PressureRelief' || node.data.valvetype === 'PressureReducer' || node.data.valvetype === 'Priority') {
				nodeStr += this.writeNodeConfig({
					'PressureThreshold': node.data.pressurethreshold || '',
				})
			}
			if (node.data.valvetype === 'Shutoff') {
				nodeStr += this.writeNodeConfig({
					'RestPosition': node.data.restposition || '',
				})
			}
			if (node.data.circuitname !== '') {
				nodeStr += this.writeNodeConfig({
					'CircuitName': node.data.circuitname || '',
				})
			}
			if (node.data.circuitname === '') {
				nodeStr += this.writeNodeConfig({
					'CircuitIndex': node.data.circuitindex || '',
				})
			}
			nodeStr += this.writeNodeConfig({
				'WearAndTearCollision': node.data.wearandtear || '',
 			})
			break;
        case 'HTrigger':
          nodeStr += this.writeNodeConfig({
            'Condition': node.data.condition || '',
            'Effects': node.data.effects || '',
          });
        case 'Accumulator':
          nodeStr += this.writeNodeConfig({
            'NormalPressure': node.data.normalpressure || '',
            'InitialPressure': node.data.initialpressure || '',
            'Capacity': node.data.capacity || '',
			'WearAndTearCollision': node.data.wearandtear || '',
          });
		  break;
        case 'Actuator':
          nodeStr += this.writeNodeConfig({
            'FluidVolume': node.data.fluidvolume || '',
            'LiquidCapacity': node.data.liquidcapacity || '',
            'LiquidConsumption': node.data.liquidconsumption || '',
            'MinimalPressure': node.data.minimalpressure || '',
            'Type': node.data.actuatortype || '',
            'Redundancy': node.data.redundancy || '',
            'AssistancePct': node.data.assistancepct || '',
			'WearAndTearCollision': node.data.wearandtear || '',
          });
		  if (node.data.mastercylinder === true) {
			nodeStr += this.writeNodeConfig({
            	'MasterCylinder': node.data.mastercylinder || false,
			});
		  }
		  break;
		case 'HCombiner':
			nodeStr = '';
			break;
		case 'HSeparator':
			nodeStr = '';
			break;
        case 'LTank':
          nodeStr += this.writeNodeConfig({
            'Position': node.data.position || '',
            'Capacity': node.data.capacity || '',
			'Doors': node.data.doors || '',
			'Scoops': node.data.scoops || '',
          });
          break;
        case 'Door':
          nodeStr += this.writeNodeConfig({
            'FixedRate': node.data.fixedrate || '',
            'DropSpeed': node.data.dropspeed || '',
            'Actuator': node.data.actuator || '',
			'OpenTime': node.data.opentime || '',
			'CommandGroup': node.data.commandgroup || '',
          });
		  if (node.data.circuitname !== '') {
			nodeStr += this.writeNodeConfig({
				'CircuitName': node.data.circuitname || '',
			});

		  } else {
			nodeStr += this.writeNodeConfig({
				'Circuit': node.data.circuitindex || '',
			});
		  }

		  let doorcurveList = (node.data.curverate !== undefined ? node.data.curverate.name: '');
		  if (doorcurveList !== '') {
			nodeStr += this.writeNodeConfig({
					'CurveRate': doorcurveList || '',
			});
		  }
          break;
        case 'Scoop':
          nodeStr += this.writeNodeConfig({
            'FixedRate': node.data.fixedrate || '',
			'ContactPoint': node.data.contactpoint || '',
          });

		  let scoopcurveList = (node.data.curverate !== undefined ? node.data.curverate.name: '');
		  if (scoopcurveList !== '') {
			nodeStr += this.writeNodeConfig({
					'CurveRate': scoopcurveList || '',
			});
		  }
          break;
        case 'PAPU':
          nodeStr += this.writeNodeConfig({
            'OutputFlow': node.data.outflow || '',
			'Volume': node.data.volume || '',
          });

		  let papucurveList = (node.data.bleedcurve !== undefined ? node.data.bleedcurve.name: '');
		  if (papucurveList !== '') {
			nodeStr += this.writeNodeConfig({
					'BleedTemperatureCurve': papucurveList || '',
			});
		  }
          break;
        case 'PEngine':
          nodeStr += this.writeNodeConfig({
            'Index': node.data.engineindex || '',
            'OutputFlow': node.data.outflow || '',
			'Volume': node.data.volume || '',
          });

		  let penginecurveList = (node.data.bleedcurve !== undefined ? node.data.bleedcurve.name: '');
		  if (penginecurveList !== '') {
			nodeStr += this.writeNodeConfig({
					'BleedTemperatureCurve': penginecurveList || '',
			});
		  }
          break;
        case 'RamAir':
          nodeStr += this.writeNodeConfig({
            'Surface': node.data.surface || '',
			'Volume': node.data.volume || '',
          });
          break;
		case 'Pack':
          nodeStr += this.writeNodeConfig({
            'Circuit': node.data.circuit || '',
            'TypicalFlow': node.data.typicalflow || '',
			'Volume': node.data.volume || '',
            'MinTemperatureOutput': node.data.mintempout || '',
            'MaxTemperatureOutput': node.data.maxtempout || '',
            'DefaultTemperatureOutput': node.data.deftempout || '',
            'PackFlowLow': node.data.packflowlow || '',
            'PackFlowNorm': node.data.packflownorm || '',
            'PackFlowHigh': node.data.packflowhigh || '',
          });

		  if(node.data.managedareas.length > 0) {
			let packareaList = this.nullSelectionList(node.data.managedareas) || '';
			nodeStr += this.writeNodeConfig({
					'ManagedArea': packareaList,
			});
		  }
		  break;
        case 'MixerUnit':
          nodeStr += this.writeNodeConfig({
			'Volume': node.data.volume || '',
          });
          break;
        case 'Area':
          nodeStr += this.writeNodeConfig({
			'Volume': node.data.volume || '',
            'Bleed': node.data.bleed || '',
            'AmbientBleedStaticFlow': node.data.ambient || '',
            'OpeningNames': node.data.openingnames || '',
            'PID': node.data.packpid || '',
          });
			if (node.data.openingnames === '') {
				nodeStr += this.writeNodeConfig({
				'OpeningIndices': node.data.openingindicies || '',
 		         });
			}
          break;
        case 'Outlet':
          nodeStr += this.writeNodeConfig({
			'Type': node.data.outlettype || '',
			'ConsumptionVolume': node.data.consumptionvolume || '',
			'ConsumptionPressure': node.data.consumptionpressure || '',
			'ConsumptionTemperature': node.data.consumptiontemperature || '',
			'Index': node.data.starterindex || '',
			'Volume': node.data.volume || '',
          });
          break;
        case 'Fan':
          nodeStr += this.writeNodeConfig({
			'Circuit': node.data.circuit || '',
			'SpeedUpTime': node.data.speeduptime || '',
			'StaticPressure': node.data.staticpressure || '',
			'MaxFlow': node.data.maxflow || '',
          });
          break;
        case 'PValve':
          nodeStr += this.writeNodeConfig({
			'Circuit': node.data.circuit || '',
			'OpeningTime': node.data.openingtime || '',
			'Type': node.data.valvetype || '',
			'PID': node.data.valvepid || '',
          });
    
		  if(node.data.managedareas.length > 0) {
			let packareaList = this.nullSelectionList(node.data.managedareas) || '';
			nodeStr += this.writeNodeConfig({
					'ManagedArea': packareaList,
			});
		  }
      break;
      }
      output += `${nodeStr} \n`;
    });

    return output;
  }

  convertBurnerNodes(nodes, lines, sysID, systemType) {
 	const classname2paramnames = [
		{
			Burner: 'Burner',
			BValve: 'Valve',
		},
	]
	// burner found in fuel system setup make a burner_system section at end of fuel system for use in systems.cfg
	let output = '['+systemType[5].label.toUpperCase()+']'+'\n';
	nodes.sort((a, b) => a.class.localeCompare(b.class)).forEach(node => {
		//const inputLines = lines.filter(line => line.destination === (node.data.itemname || node.data.name)).map( line => line.name);
		//const outputLines = lines.filter(line => line.source === (node.data.itemname || node.data.name)).map( line => line.name);
		//let nodeStr = `${node.class}.${node.data.index} = Name:${node.data.itemname || node.data.name} `;
		// only do burner and Bvalve
		if (node.class === 'Burner' || node.class === 'BValve'){
			let nodeStr = `${classname2paramnames[sysID][node.class]}.${node.data.index} = Name:${node.data.itemname || node.data.name} `;
			switch (node.class) {
				case 'Burner':
					break;
				case 'BValve':
				nodeStr += this.writeNodeConfig({
					'Burner': node.data.burner || '',
					'MaxFlowRate': node.data.maxflowrate || '',
					'Power': node.data.power || '',
				});
				break;
			}
			output += `${nodeStr} \n`;
		}
	});

    return output;

  }

  // IMPORT CFG
  
  // importConfig takes a string argument that contains the [FUEL_SYSTEM] section of
  // a MSFS flight_model.cfg file or other SYSTEM section in systems.cfg
  // 
  importConfig(configStr, sysID, systemType) {
  	const nodeList = [];
  	const lineList = [];
  	const linesincfg = configStr.replaceAll('\\n','\n').split('\n');
	var sysID_df = 0;
	var found_sysID = false;
  	linesincfg.forEach( line => {
		if (!found_sysID) {
			found_sysID = true;
//			var sysText = line.match(/\[.]/).toUpperCase();
			var sysText = line.match(/\[.+]/);
			switch(sysText[0].toUpperCase()) {
				case '[FUEL_SYSTEM]':
					sysID_df=0;
					break;
				case '[ELECTRICAL]':
					sysID_df=1;
					break;
				case '[HYDRAULIC_SYSTEM_EX1]':
					sysID_df=2;
					break;
				case '[PNEUMATIC_SYSTEM_EX1]':
					sysID_df=3;
					break;
				case '[LIQUID DROPPING SYSTEM]':
					sysID_df=4;
					break;
				case '[BURNER_SYSTEM]':
					sysID_df=0;
					break;
			};
			if (sysID_df !== sysID) {
				throw new Error(`The System Selected does not match import data: ${systemType[sysID_df].label} and ${systemType[sysID].label}`);
			}
		}
		const nodeParts = line.match(/([^\.]+)\.([^\s]+)[\s=]+(.+)$/);

		if (nodeParts && nodeParts.length === 4) {
			if (nodeParts[1] === 'Line') {
				const parsedLine = this.parseLine(nodeParts, sysID);
		  		if (Object.keys(parsedLine).length) {
					lineList.push(parsedLine);
		  		}				
			} else {
		  		const parsedNode = this.parseNode(nodeParts, sysID);
		  		if (Object.keys(parsedNode).length) {
					nodeList.push(parsedNode);
		  		}
		  	}
		}
  	});
    // could sort the nodeList here so the resulting graph has a more logical flow from tank to engine
    // create a sorting array with the desired order (bar) and use foo.sort((a, b) => bar.indexOf(a.name) - bar.indexOf(b.name));
    const sortOrder = [
		[
		'Curve',
		'Trigger',
		'Tank',
		'APU',
		'Valve',
		'Junction',
		'Pump',
		'Engine',
		],
		[
		'Circuit',
		'Battery',
		'ExternalPower',
		'Generator',
		'Bus',
		'Breaker',
		'Transformer',
		'Diode',
		'Relay',
		'Connection',
		],
		[
		'Reservior',
		'HPump',
		'Accumulator',
		'Actuator',
		'PTU',
		'HJunction',
		'HTrigger',
		'HValve',
		'HCombiner',
		'HSeparator',
		]
	];
    const sortedNodeList = nodeList.sort((a, b) => sortOrder[sysID].indexOf(a.name) - sortOrder[sysID].indexOf(b.name));

  	const graph = this.processNodes(sortedNodeList, lineList, sysID);
  	// return lineStrings;
  	return graph;
  }

  parseNode(nodeParts, sysID) {
	const nodeTypeStr = nodeParts[1];  	
	const nodeIndex = nodeParts[2];
	const nodeParams = nodeParts[3].split('#');
  	const node = {};
	node.data = { index: nodeIndex, name: `${nodeTypeStr}.${nodeIndex}` };
	node.name = nodeTypeStr;
	const nodeProperties = this.getNodeProperties(nodeTypeStr, sysID);
	if (nodeProperties) {
		const propKeys = Object.keys(nodeProperties);
  		nodeParams.forEach( (p) => {
  			const param = p.match(/([^:]+):(.+)/);
  			const propKey = propKeys.indexOf(param[1].trim());
        const propName = propKeys[propKey]
  			if (propName) {
  				if (node.data[nodeProperties[propName]]) {
  					// append to existing property with ':' delimiter (Option can have multiple entries)
  					node.data[nodeProperties[propName]] += `:${param[2].trim()}`;
  				} else {
  					node.data[nodeProperties[propName]] = param[2].trim();
  				}
  			}
  			// special handling for curve node
  			if (!propKeys.length) {
		        const paramOnly = p.replace(/[^0-9.,-:]+/g, '').trim();
  				node.data.params = paramOnly;
  			}
		});
  	}
  	return node;
  }

  parseLine(lineParts, sysID) {
  	const lineParams = lineParts[3].split('#');
  	const line = {};
  	const lineProperties = this.getNodeProperties('Line', sysID);
  	const propKeys = Object.keys(lineProperties);
	lineParams.forEach( (p) => {
		const param = p.split(':');
		const propKey = propKeys.indexOf(param[0].trim());
		const propName = propKeys[propKey]
		if (propName) {
			line[lineProperties[propName]] = param[1].trim();
		}
	});
	return line;
  }

  // after parsing nodes and lines, assemble into drawflow JSON
  processNodes(nodes, lines, sysID) {
  	// each node will be placed with this offset from the previous
  	const offset_x = 260;
  	const offset_y = 50;

  	const graph = {
  		'drawflow': {
  			'Home': {
  				'data': {},
  			}
  		}
  	};

    // only create nodes that are allowed per system
    const allowedNodes = [[
			'Curve',
			'Trigger',
			'Tank',
			'APU',
			'Valve',
			'Junction',
			'Pump',
			'Engine',
		],
		[

		]
	];
	// get system id first
	// sysID = 
  	// add node to the drawflow node graph
	// html has to match the registered editor node name
  	for (const [i, node] of nodes.entries()) {
      if (allowedNodes[sysID].includes(node.name)) {
    		graph.drawflow.Home.data[i] = {
    			"id": i,
    			"name": node.name,
    			"data": node.data,
         		"class": node.name, /* naming things here */
            	"html": node.name,
            	"typenode": "vue",
            	"inputs": {},
            	"outputs": {},
            	"pos_x": i * offset_x,
            	"pos_y": i * offset_y,
    		}
      }
	}
	// loop through the lines and set the input/outputs on the nodes
	lines.forEach( line => {
		if (line.source) {
			const graphNodes = Object.values(graph.drawflow.Home.data);
			const sourceNode = graphNodes.find( n => n.data.itemname === line.source);
			const destinationNode = graphNodes.find( n => n.data.itemname === line.destination);
			const gSource = graph.drawflow.Home.data[sourceNode.id];
			const gDest = graph.drawflow.Home.data[destinationNode.id];			
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
		}
	});

	// adjust some of the data properties
  	// convert array types
	const splitToArr = (str, delim = ',') => {
		return str.split(delim).map(i => i.trim());
	};
		for (const [i, node] of nodes.entries()) {
			if (node.data.optionlist) {
				const options = node.data.optionlist.split(':');
				const final = [];
				options.forEach( o => {
					final.push(o.split(','))
				})
				node.data.optionlist = final;
			}
		if (node.data.inputonlylines) {
		node.data.inputonlylines = splitToArr(node.data.inputonlylines);
		}
		if (node.data.outputonlylines) {
		node.data.outputonlylines = splitToArr(node.data.outputonlylines);
		}    
			if (node.data.oneway) {
				node.data.oneway = true;
			}
		}
		return graph;
	}

	/*
  	The returned object has the keys matching the MSFS config param 
  	and the value matches the drawflow node data property
	*/
	getNodeProperties(nodeTypeStr, sysID) {
		switch (nodeTypeStr) {
			case 'Curve':
				return {}
			case 'FEngine':
				return {
					'Name': 'itemname',
					'Index': 'engineindex',
				}
			case 'FTank':
				return {
					'Name': 'itemname',
					'Title': 'itemtitle',
					'Capacity': 'capacity',
					'UnusableCapacity': 'unusuablecapacity',
					'Position': 'position',
					'DropTimer': 'droptimer',
					'Priority': 'priority',
					'OutputOnlyLines': 'outputonlylines',
				}
			case 'FPump':
				return {
					'Name': 'itemname',
					'Title': 'itemtitle',
					'Pressure': 'pressure',
					'PressureCurve': 'curve',
					'TankFuelRequired': 'tankfuelrequired',
					'Type': 'pumptype',
					'Index': 'droptimer',
					'AutoCondition': 'autocondition',
					'PressureDecreaseRate': 'pressuredecrease',
					'DestinationLine': 'oneway',
				}
			case 'FJunction':
				return {
					'Name': 'itemname',
					'Title': 'itemtitle',
					'Option': 'optionlist',
					'InputOnlyLines': 'inputonlylines',
					'OutputOnlyLines': 'outputonlylines',
				}
			case 'FValve':
				return {
					'Name': 'itemname',
					'Title': 'itemtitle',
					'DestinationLine': 'oneway',
					'OpeningTime': 'openingtime',
					'Circuit': 'circuitindex',
				}
			case 'FAPU':
				return {
					'Name': 'itemname',
					'Title': 'itemtitle',
					'FuelBurnRate': 'fuelburn',
				}
			case 'Line':
				return {
					'Name': 'itemname',
					'Source': 'source',
					'Destination': 'destination',
					'FuelFlowAt1PSI': 'fuelflow',
					'Volume': 'volume',
					'GravityBasedFuelFlow': 'gravityflow',
				}
			case 'FTrigger':
				return {
					'Name': 'itemname',
					'Title': 'itemtitle',
					'Target': 'target',
					'Threshold': 'threshold',
					'Index': 'targetindex',
					'DelayTrue': 'delaytrue',
					'DelayFalse': 'delayfalse',
					'Condition': 'condition',
					'EffectTrue': 'effecttrue',
					'EffectFalse': 'effectfalse',
					'iParam': 'iparam',
				}
			case 'Burner':
				return {
					'Name': 'itemname',
					'PilotLightFlowRate': 'pilotlightflowrate',
				}
			case 'BValve':
				return {
					'Name': 'itemname',
					'Burner': 'burner',
					'MaxFlowRate': 'maxflowrate',
					'Power': 'power',
				}
			case 'Circuit':
				return {
					'Name': 'itemname',
				}
			case 'Battery':
				return {
					'Name': 'itemname',
				}
			case 'ExternalPower':
				return {
					'Name': 'itemname',
				}
			case 'Generator':
				return {
					'Name': 'itemname',
				}
			case 'Bus':
				return {
					'Name': 'itemname',
				}
			case 'Relay':
				return {
					'Name': 'itemname',
				}
			case 'Breaker':
				return {
					'Name': 'itemname',
				}
			case 'Transformer':
				return {
					'Name': 'itemname',
				}
			case 'Diode':
				return {
					'Name': 'itemname',
				}
			case 'Connection':
				return {
					'Name': 'itemname',
				}
			case 'ConsumerCfg':
				return {
					'Name': 'itemname',
				}
			case 'SupplierCfg':
				return {
					'Name': 'itemname',
				}
			case 'Reservoir':
				return {
					'Name': 'itemname',
				}
			case 'HPump':
				return {
					'Name': 'itemname',
				}
			case 'PTU':
				return {
					'Name': 'itemname',
				}
			case 'HJunction':
				return {
					'Name': 'itemname',
				}
			case 'Actuator':
				return {
					'Name': 'itemname',
				}
			case 'Accumulator':
				return {
					'Name': 'itemname',
				}
			case 'HTrigger':
				return {
					'Name': 'itemname',
				}
			case 'HValve':
				return {
					'Name': 'itemname',
				}
			case 'PAPU':
				return {
					'Name': 'itemname',
				}
			case 'PEngine':
				return {
					'Name': 'itemname',
				}
			case 'RamAir':
				return {
					'Name': 'itemname',
				}
			case 'MixerUnit':
				return {
					'Name': 'itemname',
				}
			case 'Area':
				return {
					'Name': 'itemname',
				}
			case 'Pack':
				return {
					'Name': 'itemname',
				}
			case 'Outlet':
				return {
					'Name': 'itemname',
				}
			case 'PValve':
				return {
					'Name': 'itemname',
				}
			case 'Fan':
				return {
					'Name': 'itemname',
				}
			case 'PJunction':
				return {
					'Name': 'itemname',
				}
		}
	}
}
