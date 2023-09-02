const inputSlider=document.querySelector("[data-lengthSlider]");
const dataLengthNum=document.querySelector("[data-lengthNum]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const upperCaseCheck=document.querySelector("#upperCase");
const lowerCaseCheck=document.querySelector("#lowerCase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_-+={[]}|\:;",<.>?/';
let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();

setIndicator('#ccc')

function handleSlider(){
    inputSlider.value=passwordLength;
    dataLengthNum.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;

    inputSlider.style.backgroundSize=((passwordLength - min)*100/(max-min))+"100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRndNum(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123))
}

function generateUpperrCase(){
    return String.fromCharCode(getRandomInteger(65,91))
}

function generateSymbol(){
    const rndNum=getRandomInteger(0,symbols.length);
    return symbols[rndNum];  
}




function calcStrength(){
     let hasUpper=false;
     let hasLower=false;
     let hasNum=false;
     let hasSymbol=false;

     if(upperCaseCheck.checked) hasUpper=true;
     if(lowerCaseCheck.checked) hasLower=true;
     if(numberCheck.checked) hasNum=true;
     if(symbolCheck.checked) hasSymbol=true;

     if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>=8){
        setIndicator('#0f0')
     }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSymbol) &&
        passwordLength>=6
     ){
        setIndicator('#ff0')
     }else{
        setIndicator('#f00')
     }
     
}



async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied"
    }
    catch(e){
        copyMsg.innerText="Failed"
    }
    copyMsg.classList.add("active")
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 1000);
}

function shufflePassword(array){
    //fisher yeates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1))
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>{str+=el});
    return str;
}



function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;

    } );

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

} 

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})

inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    password=""; 

    let funcArr=[];

    if(upperCaseCheck.checked)
       funcArr.push(generateUpperrCase)
    if(lowerCaseCheck.checked)
       funcArr.push(generateLowerCase)
    if(numberCheck.checked)
       funcArr.push(generateRndNum)
    if(symbolCheck.checked)
       funcArr.push(generateSymbol)


    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randIndex]() 
    }

    password=shufflePassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength();

})
