const fs = require('fs')
module.exports = async function(text,flag='time'){
    fs.readFile('.env', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        if(flag=='time'){
          var result = data.replace(/INFOTIME=[0-9]{0,}/, 'INFOTIME='+text);
        }else if(flag=='prop'){
          var result = data.replace(/LASTPROPOSAL=[0-9]{0,}/, 'LASTPROPOSAL='+text);
        }
        
        fs.writeFile('.env', result, 'utf8', function (err) {
           if (err) return console.log(err);
        });
      });
      return `Set alert time to ${text} seconds` 
}
