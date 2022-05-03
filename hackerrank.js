const puppeteer=require('puppeteer');
const mail='rohonah902@ovout.com';
const pass='babitaje';
let  browserInstance=puppeteer.launch({ headless: false, defaultViewport: null,args: ['--start-fullscreen'] });
const fs=require('fs');
const code=require('./code.js')
// console.log(browserInstance);
let page;
browserInstance.then(function(browser){
    console.log(' Browser is opened');
    let pagePromise=browser.newPage();
    return pagePromise;
}).then(function(pageInstance){
    console.log('new page is opened');
    page=pageInstance;
    let urlPromise=page.goto('https://www.hackerrank.com/');
    return urlPromise;
}).then(function(){
    console.log('hackerank page is opened');
    return waitAndClick('ul.menu a')
    //  we cant click directly any button or selector because there is some delayso we wait for selector or button using waitforSelector
}).then(function(){
    let waitPromise=page.waitForSelector('.fl-module-content.fl-node-content a');
    return waitPromise;
}).then(function(){
    // page.evaluate helps to apply dom selection
    let domClickPromise=page.evaluate(function(){
        let btns=document.querySelectorAll('.fl-module-content.fl-node-content a');
        btns[3].click();
    });
    return domClickPromise;
}).then(function(){
    let waitPromise=page.waitForSelector('#input-1');
    return waitPromise;
})
.then(function(){
    let mailpromise=page.type('#input-1',mail,{delay:100});
    return mailpromise;
}).then(function(){
    let passTypePromise=page.type(' #input-2',pass,{delay:100});
    return passTypePromise;
}).then(function(){
    let clickPromse = page.click('button[data-analytics="LoginPassword"]');
    return clickPromse;
}).then(function(){
    console.log('login successfull');
    return waitAndClick('[data-automation="algorithms"]');
})
.then(function(){
    return page.waitForSelector(".filter-group");
}).then(function(){
    let domSelectPromise = page.evaluate(function(){
        let allDivs = document.querySelectorAll(".filter-group");
        let div = allDivs[3];
        let clickSelector = div.querySelector(".ui-checklist-list-item input");
        clickSelector.click({delay:100});
        return;
    })
    return domSelectPromise;
}).then(function(){
    console.log("warmup Selected");
    return page.waitForSelector('.challenges-list .js-track-click.challenge-list-item');
}).then(function(){
    let arrPromise=page.evaluate(function(){ 
        let aTags=document.querySelectorAll('.challenges-list .js-track-click.challenge-list-item');
        let arr=[];
        for(let i=0;i<aTags.length;i+=1){
            let link=aTags[i].href;
            // console.log(link)
            arr.push(link);
        }
        return arr;
    })
    return arrPromise
}).then(function(questionsArr){
    // console.log(questionsArr);
    let questionPromise=questionSolver(questionsArr[0],code.answers[0]);
    for(let i=1;i<questionsArr.length;i+=1){
        questionPromise=questionPromise.then(function(){
            let nextquestionPromise=questionSolver(questionsArr[i],code.answers[i]);
            return nextquestionPromise;
        })
    }
    return questionPromise;
}).then(function(){
    console.log('All the warm up question have been submitted!!!');
})

function waitAndClick(selector){
    return new Promise(function(resolve,reject){
        let waitPromise=page.waitForSelector(selector);
        waitPromise.then(function(){
            let clickPromise=page.click(selector);
            return clickPromise;
        }).then(function(){
            resolve();
        })
    })
}
function questionSolver(question,answer){
    return new Promise(function(resolve,reject){
        let linkPromise=page.goto(question);
        linkPromise.then(function(){
            return waitAndClick('.checkBoxWrapper input');
        }).then(function(){
            return waitAndClick('.ui-tooltip-wrapper textarea');
        }).then(function(){
            let typePromise=page.type('.ui-tooltip-wrapper textarea',answer);
            return typePromise;
        }).then(function(){
            let holdControl=page.keyboard.down('Control');
            return holdControl;
        }).then(function(){
            let pressA=page.keyboard.press('A');
            return pressA;
        }).then(function(){
            pressX=page.keyboard.press('X');
            return pressX;
        }).then(function(){
            let upControl=page.keyboard.up('Control');
            return upControl;
        }).then(function(){
            return waitAndClick('.monaco-editor.no-user-select.vs');
        }).then(function(){
            let holdControl=page.keyboard.down('Control');
            return holdControl;
        }).then(function(){
            let pressA=page.keyboard.press('A');
            return pressA;
        }).then(function(){
            let pressV=page.keyboard.press('V');
            return pressV;
        }).then(function(){
            let upControl=page.keyboard.up('Control');
            return upControl;
        }).then(function(){
            return waitAndClick('.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled');
        }).then(function(){
            console.log('questions submitted successfully');
            resolve();
        })
    })
}