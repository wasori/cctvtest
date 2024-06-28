var fs = require('fs');
var execSync = require('child_process').execSync;
const getConfLocation = () => {
    let chosenLocation
    try{
        chosenLocation = __dirname + `/../plugins/${targetedPlugin}/`
        fs.statSync(chosenLocation)
    }catch(err){
        chosenLocation = __dirname + `/`
    }
    return chosenLocation
}
const mergeDeep = function(...objects) {
  const isObject = obj => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}
var anError = function(message,dontShowExample){
    console.log(message)
    if(!dontShowExample){
        console.log('Example of usage :')
        console.log('node tools/modifyConfigurationForPlugin.js tensorflow key=1234asdfg port=8080')
    }
}
var testValueForObject = function(jsonString){
    var newValue = jsonString + ''
    try{
        newValue = JSON.parse(jsonString)
    }catch(err){

    }
    if(typeof newValue === 'object'){
        return true
    }
    return false
}
process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception occured!');
    console.error(err.stack);
});
var targetedPlugin = process.argv[2]
if(!targetedPlugin || targetedPlugin === '' || targetedPlugin.indexOf('=') > -1){
    return anError('Specify a plugin folder name as the first argument.')
}
var pluginLocation = getConfLocation()
fs.stat(pluginLocation,function(err){
    if(!err){
        var configLocation = `${pluginLocation}conf.json`
        try{
            var config = JSON.parse(fs.readFileSync(configLocation))
        }catch(err){
            try{
                var config = JSON.parse(fs.readFileSync(`${pluginLocation}conf.sample.json`,'utf8'))
                fs.writeFileSync(`${pluginLocation}conf.json`,JSON.stringify(config,null,3),'utf8')
            }catch(err){
                var config = {}
            }
        }
        var processArgv = process.argv.splice(3,process.argv.length)
        var arguments = {};
        if(processArgv.length === 0){
            return anError('No changes made. Add arguments to add or modify.')
        }
        processArgv.forEach(function(val) {
            var theSplit = val.split('=');
            var index = (theSplit[0] || '').trim();
            var value = theSplit[1];
            if(index.indexOf('addToConfig') > -1 || index == 'addToConfig'){
                try{
                    value = JSON.parse(value)
                    config = mergeDeep(config,value)
                }catch(err){
                    anError('Not a valid Data set. "addToConfig" value must be a JSON string. You may need to wrap it in singles quotes.')
                }
            }else{
                if(value==='DELETE'){
                    delete(config[index])
                }else{
                    if(testValueForObject(value)){
                        config[index] = JSON.parse(value);
                    }else{
                        if(index === 'key'){
                            const modifyMainFileLocation = `${__dirname}/modifyConfiguration.js`
                            fs.stat(modifyMainFileLocation,(err) => {
                                if(!err){
                                    console.log(`Updating main conf.json with new key.`)
                                    execSync(`node ${modifyMainFileLocation} addToConfig='{"pluginKeys":{"${config.plug}":"${value + ''}"}}'`,function(err){
                                        console.log(err)
                                    })
                                }else{
                                    console.log(`Didn't find main conf.json. You may need to update it manually.`)
                                    console.log(`Docker users using the official Ninja-Docker install method don't need to complete any other configuration.`)
                                }
                            })
                            config[index] = value + ''
                        }else{
                            config[index] = value
                        }
                    }
                }
            }
            console.log(index + ': ' + value);
        });

        fs.writeFile(configLocation,JSON.stringify(config,null,3),function(){
            console.log('Changes Complete. Here is what it is now.')
            console.log(JSON.stringify(config,null,2))
        })
    }else{
        anError(`Plugin "${targetedPlugin}" not found.`)
    }
})
