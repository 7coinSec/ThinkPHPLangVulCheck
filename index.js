var clc = require("cli-color");
const inquirer = require('inquirer');
const lineReader = require('line-reader');
const fetch = require("node-fetch");
console.log(clc.green(`=========================================
______ _____       _        _____           
|____  / ____|    (_)      / ____|          
    / / |     ___  _ _ __ | (___   ___  ___ 
   / /| |    / _ \\| | '_ \\ \\___ \\ / _ \\/ __|
  / / | |___| (_) | | | | |____) |  __/ (__ 
 /_/   \\_____\\___/|_|_| |_|_____/ \\___|\\___|
         
 
  ThinkPHP Lang 漏洞自检工具 by 7CoinSec
=========================================                     
`))

inquirer
  .prompt([
    {
      type: 'list',
      name: 'selection',
      message: '选择你想要进行的操作?',
      choices: [
        '单网站自检',
        '批量自检',
      ],
    },
  ])
  .then((answers) => {
    if(answers.selection == "单网站自检"){
        inquirer.prompt([
            {
                type:"input",
                message:"请输入URL：",
                name:"url",
            },
        ]).then(answer=>{
           checkVul(answer.url); 
        });
        
    }else{
        inquirer.prompt([
            {
                type:"input",
                message:"请输入URL列表文件(eg:url.txt)",
                name:"file",
            },
        ]).then(answer=>{
            lineReader.eachLine(answer.file, function(line, last) {
                checkVul(line);
            })
        });
    }
  });
  async function checkVul(url,existCallback,notExistCallback){
  /*  if(url.toLowerCase().includes("gov") || url.toLowerCase().includes("edu")){
        console.log(clc.yellow(`[-] ${url} 暂不支持检测该域名`))
        return;
    }
  try{
    axios.get(`${url}/index.php?lang=../../../../../public/index`)
    .then(function (response) {
        console.log(clc.yellow(`[-] ${url} 不存在该漏洞`))
    })
    .catch(function (error) {
        if(!error.hasOwnProperty("response")){
            console.log(clc.yellow(`[-] ${url} 访问时发生了错误`))
            return;
        }
       if(error.response.status == 500){
        console.log(clc.green.bold(`[+] ${url} 存在该漏洞`))
       }
    });
  }catch(e){
    console.log(clc.yellow(`[-] ${url} 访问时发生了错误`))
  }*/
// demo01.js
  if(url.toLowerCase().includes("gov") || url.toLowerCase().includes("edu")){
    console.log(clc.yellow(`[-] ${url} 暂不支持检测该域名`))
    return;
  }
  try{
  var r1 = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
  var res = url.toLowerCase().match(r1);
  if(!res){
    console.log(clc.yellow(`[-] ${url} 请输入正确的URL!`))
    return;
  }
  const response_normal = await fetch(`${url}/index.php?lang=AAA`);
  const response = await fetch(`${url}/index.php?lang=../../../../../public/index`);

  if(response_normal.status == 200 && response != 200){
    console.log(clc.green.bold(`[+] ${url} 存在该漏洞`))
  }else{
    console.log(clc.yellow(`[-] ${url} 不存在该漏洞`))
  }
}catch(e){
  console.log(clc.yellow(`[-] ${url} 连接超时或者发生错误!`))
}

}