

const Discord = require('discord.js'), 
      client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }}), 
      ytdlDiscord = require("discord-ytdl-core");

client.on('ready', async() => {
  client.user.setStatus("dnd");
  client.user.setActivity(" deneme ")
  play()  
})


const setting = {
  channelID: "784193683636879441", // Ses Kanalının ID Giriniz.
  modID: "846363391345164308", // Moderatör RolID Giriniz.
  videoURL: "https://www.youtube.com/watch?v=jOr10momCgQ" // Youtube Video Link.
}

client.on('voiceStateUpdate', async function(oldState, newState){
  if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
  if(newState.channelID == setting.channelID){
    if(client.channels.cache.get(setting.channelID).members.some(member => member.roles.cache.has(setting.modID)) == true) client.channels.cache.get(setting.channelID).leave()
  } else if(oldState.channelID == setting.channelID){
    if(client.channels.cache.get(setting.channelID).members.some(member => member.roles.cache.has(setting.modID)) == false)  play()
  }
})


async function play(){ 
  let url = await ytdlDiscord(setting.videoURL, {
            filter: "audioonly",
            opusEncoded: true,
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    });
  let streamType = setting.videoURL.includes("youtube.com") ? "opus" : "ogg/opus"; 
  client.channels.cache.get(setting.channelID).join().then(async connection => { 
    if(client.channels.cache.get(setting.channelID).members.some(member => member.roles.cache.has(setting.modID)) == false) { 
      connection.play(url, {type: streamType}).on("finish", () => { 
        play(url); 
      }); 
    } else play(url); 
  }); 
}  
client.login()  
