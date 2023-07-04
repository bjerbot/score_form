// //開場動畫製作
let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");
let animation = document.querySelector("section.animation-wrapper");

const time_line = gsap.timeline();

//parameter 1 控制的對象
//parameter 2 duration
//parameter 3 控制對象的原始狀態
//parameter 4 控制對象動畫結束後的狀態
//parameter 5 設定延遲或提早執行動畫
time_line.fromTo(hero, 1, {height:"0%"}, {height:"100%", ease:Power2.easeInOut})
        .fromTo(hero, 1.2, {width:"80%"}, {width:"100%", ease:Power2.easeInOut})
        .fromTo(slider, 1, {x:"-100%"}, {x:"0%"}, "-=1.2s" )
        .fromTo(animation, 0.3, {opacity:1}, {opacity:0});

setTimeout(() => {
    animation.style.pointerEvents = "none";
}, 2500);


//取消按下Enter 自動傳送表單的功能
window.addEventListener("keypress", (e) => {
    // console.log(e);
    if(e.key == "Enter"){
        e.preventDefault();
    }
})

//防止form內部的button預設的提交表單，所以取消所有button的預設動作
function preventButtonDefault(){
    let allButtons = document.querySelectorAll("button");
    allButtons.forEach(currentValue => {
        currentValue.addEventListener("click", e => {
            e.preventDefault();
        })
    });
}
preventButtonDefault();
  
//主功能-開始-----------------------------------------------------------------------------------
//GPA = (credites*score)+(credites*score)/credites+credites
//宣告計算GPA需要的變數
let gpaScore = document.querySelector("h1.gpa_score");
let allCredits = document.querySelectorAll("input.credits");
let allLetterGrade = document.querySelectorAll("select");


//新增 Select的功能，選取後讀取letter grade的數值，並放入array，還有選擇後更改底色
allLetterGrade.forEach((select, index) => {
    select.addEventListener("change", e => {
        changeColor(e.target);
        calculateGPA();
    });
})

//新增 innput.credit的功能，選取後讀取credit的數值，並放入array
allCredits.forEach((credit, index) => {
    credit.addEventListener("change", e => {
        calculateGPA();
    });
})

//新增 delete button的功能，點擊後刪除該表格，但第一個表格不可刪除
let allDleteButton = document.querySelectorAll("button.delete_form");
allDleteButton.forEach(deleteButton => {
    // 添加刪除動畫事件
    deleteButton.addEventListener("click", e => {
        if(e.target.parentElement.id != "not_delete"){
            e.target.parentElement.style.animation = "ScaleDown 0.8s ease";
        }
    });
    //添加刪除事件
    deleteButton.parentElement.addEventListener("animationend", e => {
        if(e.target.id != "not_delete"){
            e.target.remove();
            calculateGPA();
        }
    });
});

//計算gpa分數
let letterGradeMapping = ["", 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0];
function calculateGPA(){
    let formLength = document.querySelectorAll("form").length; 
    let allCredits = document.querySelectorAll("input.credits");
    let allLetterGrade = document.querySelectorAll("select");
    
    let letterGradeSum = 0.0;   //分子
    let creditSun = 0;          //分母
    let result;                 //結果=分子/分母
  
    
    for(let i = 0; i < formLength; i++){
        if(allCredits[i].value != "" && allLetterGrade[i].value != ""){
            // 計算credit
            creditSun += Number(allCredits[i].value);
            // 計算letterGrade
            letterGradeSum += Number(allCredits[i].value) *letterGradeMapping[allLetterGrade[i].selectedIndex];
        }
    }
    
    if(creditSun==0){
        result=0.0;
    }
    else {
        result = letterGradeSum/creditSun;
    }
    gpaScore.childNodes[0].data = result.toFixed(2).toString();
}

//依據參數的event object，更改相對應select的底色
function changeColor(e_target){
    switch(e_target.value){
        case "A":
        case "A-":
            e_target.style.backgroundColor ="rgb(90, 180, 90)";
            break;
        case "B+":
        case "B":
        case "B-":
            e_target.style.backgroundColor ="yellow";
            break;
        case "C+":
        case "C":
        case "C-":
            e_target.style.backgroundColor ="orange";
            break;
        case "D+":
        case "D":
        case "D-":
            e_target.style.backgroundColor ="red";
            break;
        case "F":
            e_target.style.backgroundColor ="grey";
            break;
        case "":
            e_target.style.backgroundColor ="white";
            break;
    }
  }

//主功能-結束-----------------------------------------------------------------------------------

//新增表格
let plusButton = document.querySelector("button.plus_form");
plusButton.addEventListener("click", e => {
    let cloneForm = document.querySelector("form").cloneNode(true);
    let divForm = document.querySelector("div.form");
    cloneForm.id="";
    for(let i = 0; i < cloneForm.length-1; i++){    
        cloneForm[i].value="";
    }
    cloneForm[3].style.backgroundColor = "white";
    //幫新增表格添加動畫
    cloneForm.style.animation ="ScaleUp 0.5s ease";
    divForm.appendChild(cloneForm);

    //幫新增表格的credit 和 Letter grade添加事件監聽
    let newCredit = cloneForm.children[2];
    newCredit.addEventListener("click", e => {
        calculateGPA();
    });
    let newLetterGrade = cloneForm.children[3];
    newLetterGrade.addEventListener("change", e => {
        console.log(e.target);
        changeColor(e.target);
        calculateGPA();
    });

    //幫新增表格的delete button添加事件監聽跟動畫;
    let newDeleteButton = cloneForm.children[4];
    preventButtonDefault();
    newDeleteButton.addEventListener("click", e => {
        e.target.parentElement.style.animation = "ScaleDown 0.5s ease";
        newDeleteButton.parentElement.addEventListener("animationend", e => {
            e.target.remove();
            calculateGPA();
        });
    });
});

//執行排序
let descending_btn = document.querySelector("button.sort-descending");
let ascending_btn = document.querySelector("button.sort-ascending");

descending_btn.addEventListener("click", e => {
    sortHandler("descending");
});
ascending_btn.addEventListener("click", e => {
    sortHandler("ascending");
});


function sortHandler(direction){
    let form = document.querySelectorAll("form");
    let objectArray = [];
    for(let i = 0; i < form.length; i++){
        
        let class_name = form[i].children[0].value;
        let class_number = form[i].children[1].value;
        let class_credit = form[i].children[2].value;
        let class_grade = 12-form[i].children[3].selectedIndex;

        let formObject = {
            class_name,
            class_number,
            class_credit,
            class_grade
        };
        objectArray.push(formObject);
    }
    objectArray = mergeSort(objectArray);
    if(direction == "descending"){
        objectArray = objectArray.reverse();
    }
    console.log(objectArray);
    console.log(form);

    for(let i = 0; i < form.length; i++){
        form[i].children[0].value = objectArray[i].class_name;
        form[i].children[1].value = objectArray[i].class_number;
        form[i].children[2].value = objectArray[i].class_credit;
        form[i].children[3].selectedIndex = (objectArray[i].class_grade-12)*-1;
        console.log(form[i].children[3].selectedIndex);
        changeColor(form[i].children[3]);
    }
}

function merge(a1, a2) {
    let result = [];
    let i = 0;
    let j = 0;
      
    while (i < a1.length && j < a2.length) {
      if (a1[i].class_grade > a2[j].class_grade) {
        console.log(a1[i].class_grade);
        console.log(a2[j].class_grade);
        result.push(a2[j]);
        j++;
      } else {
        result.push(a1[i]);
        i++;
      }
    }
  
    while (i < a1.length) {
      result.push(a1[i]);
      i++;
    }
    while (j < a2.length) {
      result.push(a2[j]);
      j++;
    }
  
    return result;
  }
  
  function mergeSort(arr) {
    if (arr.length == 0) {
      return;
    }
  
    if (arr.length == 1) {
      return arr;
    } else {
      let middle = Math.floor(arr.length / 2);
      let left = arr.slice(0, middle);
      let right = arr.slice(middle, arr.length);
      return merge(mergeSort(left), mergeSort(right));
    }
  }