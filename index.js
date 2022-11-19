const TelegramApi = require('node-telegram-bot-api')
require('dotenv').config()
const infop = require('./requests/infop')
const settime = require('./requests/settime')
//const prov = require('./requests/prov')
const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true})
const valoper = process.env.VALOPER
const chatId = process.env.CHATID
let lastprop = parseInt(process.env.LASTPROPOSAL)
let infotime = parseInt(process.env.INFOTIME)
bot.setMyCommands([
  {command: '/start', description: 'welcome message'},
  {command: '/info', description: 'Information about the validator'},
  {command: '/aprop', description: 'List of active proposals'},
  {command: '/allprop', description: 'List of all proposals'},
  {command: '/df', description: 'Hard disk information'},
  {command: '/peer', description: 'The number of peers'},
  {command: '/free', description: 'RAM Information'},
  {command: '/vsync', description: 'Information about node synchronization'},
  {command: '/settime', description: 'Frequency of sending messages for critical node errors'},
])
let valjson=false
let vsyncjson=false
async function prov(){
let valjson=false
let vsyncjson=false
  let valiki = await infop('infoval',valoper)
  if(valiki){
  valjson = JSON.parse(valiki)
  let vsync = await infop('vsync')
    vsyncjson = JSON.parse(vsync)
  let allprop = await infop('allprop')
  //console.log(allprop)
  let allproparray = allprop.split('\n')
  
  if(valjson.jailed){
    //сообщение, если нода попал в тюрьму
    bot.sendMessage(chatId, 'valoper jailed');
  }
  
  if(vsyncjson.SyncInfo.catching_up){
    // сообщение, если нода не синхронизирована
    bot.sendMessage(chatId, 'the node is not synchronized, check the synchronization information with the /vsync command');
  }
  allproparray.pop()
  let lprop = allproparray[allproparray.length-1].split(' ')
  let lpropn = parseInt(lprop[0])
  if(lpropn > lastprop){
    settime(lpropn,'prop')
    lastprop = lpropn
    //сообщение о новом пропозале
    bot.sendMessage(chatId, `New propozal came out ${lpropn}`);
  }
  let myip = await infop('myip')
  let stpos = myip.indexOf("tcp://")
  myip = myip.slice(stpos+6,myip.length-2)
  peers = await infop('peers',myip)
  peers = peers.split('"');
  peers_kol = parseInt(peers[3])
 
  if (peers_kol <= 2) {
    rest = await infop('rest')
    bot.sendMessage(chatId, `Выполнен рестарт, пиров было не больше 2`);
    await sleep(4000)
  }
  }else{

bot.sendMessage(chatId, `Validator not working`);
}
}

(function loop() {
  setTimeout(function () {
    prov()
    loop()
  }, infotime*1000);
}());

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text;
    
    let myip = await infop('myip')

    if(text === '/start'){
//      await bot.sendSticker(chatId, 'https://static.tildacdn.com/tild6135-3863-4935-a132-333137343234/neutron_img.svg')
      return bot.sendMessage(chatId, 'Welcome to Neutron node bot!')
    }
    
    if(text === '/info'){
      valiki = await infop('infoval',valoper)
      if(!valiki){
        valiki = 'Validator info not found'
      }
      return bot.sendMessage(chatId, `${valiki}`);
    }

    if(text === '/aprop'){
      aprop = await infop('aprop')
      if(!aprop){
        aprop = 'No active proposals found'
      }
      return bot.sendMessage(chatId, `${aprop}`);
    }

    if(text === '/allprop'){
let      allprop = await infop('allprop')
      if(!allprop){
        allprop = 'Proposals not found'
      }
      return bot.sendMessage(chatId, `${allprop}`);
    }

    if(text === '/peer'){
      let myip = await infop('myip')
      let stpos = myip.indexOf("tcp://")
      myip = myip.slice(stpos+6,myip.length-2)
      let peers = await infop('peers',myip)
      peers = peers.split('"');
      let peers_kol = parseInt(peers[3])
      
      return bot.sendMessage(chatId, `пиров ${peers_kol}`);
    }

    if(text === '/df'){      
      df = await infop('df')
      if(!df){
        df = 'no response received from the server'
      }
      return bot.sendMessage(chatId, 'Disc Information:\n--------------------------------------------------\n' + df);
    }

    if(text === '/vsync'){      
      vsync = await infop('vsync')
      if(!vsync){
        vsync = 'no response received from the server'
      }
      return bot.sendMessage(chatId, 'Synchronization Information:\n--------------------------------------------------\n' + vsync);
    }

    if(text === '/free'){      
      free = await infop('free')
      if(!free){
        free = 'no response received from the server'
      }
      return bot.sendMessage(chatId, 'RAM Information:\n--------------------------------------------------\n' + free);
    }

    if(/^\/settime\s/.test(text)){
      let tmp = msg.text.replace(/  +/g, ' ');
      tmp = tmp.split(' ');
      let res = await settime(tmp[1])
      if(res) infotime = tmp[1]
      return bot.sendMessage(chatId, `${res}`);
    }
    
    return bot.sendMessage(chatId, `Unknown command`)
  })
}
start()
