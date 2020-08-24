const $ = el => el.match(/\./) ? document.querySelectorAll(el) : document.querySelector(el);
const storage = (key, val) => val ? localStorage.setItem(key, val) : localStorage.getItem(key);

const historyList = $("#history-list");
const btnsDiv = $(".buttons")[0];
const btns = $(".btn");
const expDiv = $("#expression");
const altRes = $("#alt-result");
let altResActive = false;
let resActive = false;
let exp = "";


showHistory();

btns.forEach(btn => {
  btn.onclick = function() {
    
    const expVal = expDiv.textContent;
    const lastI = expVal[expVal.length-1];
    const val = this.textContent;
    const id = this.id;
    
    // To clear alt-res content
    if (altResActive) {
      altRes.textContent = "";
      altResActive = false;
    }
    // To clear result content
    if (resActive) {
      // Cancel If user add an arithmetic operator 
      if (!isNaN(val)) {
        expDiv.textContent = "";
        exp = "";
      } else {
        exp = expVal;
      }
      resActive = false;
    }

    // Return if first char. is arithmetic operator except -
    if (!expVal && isNaN(val) && val != "-") return;
    // Return if expression is incomplete
    if (isNaN(lastI) && id == "=") return;

    if (id == "=") return result();
    if (id == "del") return deletee();
    if (id == "c") return clear();

    // Avoid dual arithmetic operator
    if (isNaN(lastI) && isNaN(val)) {
      const nw = expVal.split("");
      nw.pop();
      nw.push(val);
      const newVal = nw.join("");
      expDiv.textContent = newVal;
      exp = newVal;
    } else {
      exp += val;
      expDiv.textContent += val;
    }
    
    viewCurrent(expDiv);
    
    // alt result
    result(true);

  };
});



function numf(x) {
  return Number((x).toFixed(1)).toLocaleString();
}

function result(alt=false) {
  let expAry = exp.split("");
  let expression = "";
  
  // Return if no arithmetic operator found
  if (expAry.every(c => !isNaN(c))) return;
  
  // Remove , = 1,000+1,000 to 1000+1000
  expAry = expAry.filter(v => v != ",");
  
  expAry.forEach(c => {
    if (c == "×") c = "*";
    if (c == "÷") c = "/";
    expression += c;
  });
 
  // alt result handler
  if (alt) {
    try {
      const result = eval(expression);
      altRes.textContent = numf(result);
      viewCurrent(altRes, false);
    } catch(e) {
      
    }
    return;
  }
  
  // result handler
  try {
    
    const result = numf(eval(expression));
    // Back to normal view
    expDiv.scrollTo(0,0);
    resActive = true;
    // Animation
    expDiv.classList.add("fade-in");
    altRes.classList.add("fade-out");
    
    expDiv.textContent = result;
      
    setTimeout(_ => {
      altRes.textContent = "";
      expDiv.classList.remove("fade-in");
      altRes.classList.remove("fade-out");
    }, 300);
    
    // Save to localStorage for history
    let history = storage("History");
    history = history ? JSON.parse(history) : [];
    
    history.push({expression:exp, result});
    
    storage("History", JSON.stringify(history));
    
    addHistory(exp, result);
    
    exp = "";
    
    viewCurrent(expDiv, false);
    
  } catch (e) {
    altRes.textContent = "Expression error";
    altResActive = true;
  }
  
}


function deletee() {
  // Remove last char.
  const nw = expDiv.textContent.split("");
  nw.pop();
  const newVal = nw.join("");
  if (!newVal) clear();
  expDiv.textContent = newVal;
  exp = newVal;
}


function clear() {
  expDiv.textContent = "";
  altRes.textContent = "";
  exp = "";
  // Back to default font size
  expDiv.style.fontSize = null;
}


function hideButtons() {
  
  btnsDiv.classList.add("slide");
 
}


function showButtons() {
  
  btnsDiv.classList.remove("slide");
  
}


function clearHistory() {
  localStorage.removeItem("History");
  historyList.innerHTML = "";
}


function showHistory() {
  const history = storage("History");
  if (!history) return;
  const ary = JSON.parse(history);
  ary.forEach(({ expression, result }) => {
    addHistory(expression, result);
  });
}


function addHistory(exp, res) {
  const li = document.createElement("li");
  li.className = "history-item";
  
  const span = document.createElement("span");
  span.textContent = exp;
  
  const p = document.createElement("p");
  p.textContent = res;
  
  li.appendChild(span);
  li.appendChild(p);
  
  historyList.prepend(li);
}


function changeMode(btn) {
  
  const body = document.body;
  
  if (!body.className) {
    btn.innerHTML = `<iconify-icon data-icon="uil:moon"></iconify-icon>`;
  } else {
    btn.innerHTML = `<iconify-icon data-icon="uil:sun"></iconify-icon>`;
  }
  
  body.classList.toggle("light-mode");
  
}


function viewCurrent(div, scroll=true) {
    // Check if the text is wider than its container,
    // if so then reduce font-size
    if (div.scrollWidth > div.clientWidth) {
        div.style.fontSize = "1.5em";
        if (scroll) div.scrollTo(div.scrollWidth, 0);
    } 

}


