const exec = require('child_process').exec;
module.exports = async function(chto, txdata =''){
    this.execCommand = function () {
        return new Promise((resolve) => {
        //console.log(chto)  
        switch (chto) {
          case 'infoval':
            tmp = "neutrond q staking validators -o json --limit=1000 \| jq \'\.validators[] \| select(\.operator_address==\"" + txdata + "\" )' \| jq -r ";
            break;
          case 'myip':
              tmp = "cat /root/.neutrond/config/client\.toml \| grep node";
              break;
          case 'aprop':
            tmp = "neutrond query gov proposals -o json --limit=1000 \| jq \'\.proposals[] \| select(\.status==\"PROPOSAL_STATUS_DEPOSIT_PERIOD\")' \| jq -r";
            break;
          case 'peers':
            tmp = `curl -s http://${txdata}/net_info | grep n_peers`;
            break;
          case 'rest':
              tmp = "systemctl restart neutrond";
              break;
          case 'allprop':
              tmp = "neutrond query gov proposals -o json --limit=1000 \| jq \'\.proposals[] \' \| jq -r \'\.proposal_id + \" \" + \.status\'";
              break;
          case 'df':
            tmp = "df -h"
            break;
          case 'free':
            tmp = "cat /proc/meminfo | grep MemTotal -C 2"
            break;
          case 'vsync':
            tmp = "neutrond status 2>&1 | jq"
            break;

          default:
            tmp = false
        }
          
          if(tmp){
            exec(tmp, (error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  resolve(stderr);
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
		    resolve(false)
		    return false;
                }
                resolve(stdout);
              });
          }else{
            var stdout = false
            resolve(stdout);
          }
        });
      };
    
    var lp = await this.execCommand()
    //console.log(lp)
    return lp
}
