
      window.el = s => s.substring(0,1) == "." ? document.querySelectorAll(s) : document.querySelector(s);
      window.getData = _ => localStorage.getItem("todoListData");
      window.setData = d => localStorage.setItem("todoListData", d);
      window.clearData = _ => { 
        localStorage.removeItem("todoListData"); 
        noContent("clear"); 
      }
    
      const todoInput = el("#todoInput");
      const inputPlaceHolder = todoInput.placeholder;
      const todoBtn = el("#todoBtn");
      const todoForm = el("#todoForm");
      const todoListContainer = el(".todoListContainer")[0];
      const todoList = el("#todoList");
      
      const doneTodoList = el("#doneTodoList");
      const doneTodoBtn = el("#doneTodoBtn");
      
      const placeHolder = [
        "???", 
        "???!?", 
        "Why keep pressing?", 
        "You must enter your todo",
        "well",
        "Here we go again",
        ":{",
        "really ?"
      ];
      let submitCounter = -1;

      todoForm.addEventListener("submit", e => {
        e.preventDefault();
        const newTodo = todoInput.value;
        
        if (newTodo.length < 1) {
          submitCounter++;
          if (submitCounter == placeHolder.length) submitCounter = 0;
          todoInput.placeholder = placeHolder[submitCounter];
          setTimeout(_ => todoInput.placeholder = inputPlaceHolder, 1500);
          return;
        }
        addTodo(newTodo);
        todoInput.value = "";
      });
      
      doneTodoBtn.addEventListener("click",_ => {
        const opacity = doneTodoBtn.style.opacity;
        if (opacity == "1") {
          doneTodoBtn.style.opacity = "0";
        }
      });
      
      displayTodoList();
      
      function listeners() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          listenForMobile();
        } else {
          listenForMobile();
          listenForComputer();
        }
        el(".todoItem").forEach(v => {
          v.addEventListener("mouseover", e => {
            const div = v.children[0];
            if (div.localName != "div") return;
            const hoverDiv = div.children[0];
            hoverDiv.style = "opacity:1;height:20px";
          });
          v.addEventListener("mouseout", e => {
            const div = v.children[0];
            if (div.localName != "div") return;
            const hoverDiv = div.children[0];
            hoverDiv.style = "opacity:0;height:0px";
          });
        });
      }
      
      function displayTodoList() {
        let data = getData();
        let doneTodoCounter = 0;
        if (!data) { noContent(); noContent("done"); return; }
        data = JSON.parse(data);
        data.forEach(v => {
          const { id, todo } = v;
          if (v.status == "done") {
            doneTodoCounter++;
            addTodo(todo, id, "done", false);
          } else {
            addTodo(todo, id, "none", false);
          }
        });
        if (data.every(todo => todo.status == "done")) noContent();
        if (!data.some(todo => todo.status == "done")) noContent("done");
      }
      
      function noContent(type) {
        if (type == "done") {
          if (el("#doneTodo404")) return;
          const p = document.createElement("p");
          p.id = "doneTodo404";
          p.textContent = "No done todo's yet.";
          doneTodoList.append(p);
        } else if (type == "clear") {
          const p = document.createElement("p");
          p.textContent = "Data cleared !";
          todoList.append(p);
        } else {
          if (el("#todo404")) return;
          const p = document.createElement("p");
          p.id = "todo404";
          p.textContent = "No todo list found, add now !";
          todoList.append(p);
        }
      }

      
      function addTodo(todo, id, status, save = true) {
        let data = getData() || [];
        let newData, newId;

        if (save) {
          if (typeof data == "object") {
            data.push({id:"todo1",todo:todo});
            newData = data;
          } else {
            data = JSON.parse(data);
            const ids = data.map(v => +v.id.substring(4));
            if (ids.some(id => isNaN(id))) {
              for (i = 0; i <= data.length; i++) {
                data[i].id = `todo${i}`;
                return addTodo(todo, id, status, save);
              }
            }
            let latestId = Math.max(...ids);
            newId = `todo${++latestId}`;
            data.push({id:newId,todo:todo});
            newData = data;
          }
          newData = JSON.stringify(newData);
          setData(newData);
        }
        
        if (status == "done") {
          const p = document.createElement("p");
          p.textContent = todo;
          
          const i = document.createElement("iconify-icon");
          i.setAttribute("data-icon", "uil:check");
          i.className = "doneTodoIcon";
          
          const div = document.createElement("div");
          div.appendChild(p);
          div.appendChild(i);
          
          const li = document.createElement("li");
          li.className = "doneTodoItem";
          li.appendChild(div);
          
          const p404 = el("#doneTodo404");
          if (p404) p404.remove();
          
          return doneTodoList.prepend(li);
        }
        

        const p = document.createElement("p");
        p.textContent = todo;
        
        const div2 = document.createElement("div");
        div2.className = "todoItemHover";
        div2.style = "opacity:0;height:0px;";
        
        const span = document.createElement("span");
        span.innerHTML = `<iconify-icon data-icon="uil:angle-left"></iconify-icon> <small>Done</small>`;
          
        const span2 = document.createElement("span");
        span2.innerHTML = `<small>Delete</small> <iconify-icon data-icon="uil:angle-right"></iconify-icon>`;
        
        div2.appendChild(span);
        div2.appendChild(span2);
        
        const div = document.createElement("div");
        
        div.appendChild(div2);
        div.appendChild(p);
        
        const li = document.createElement("li");
        li.className = "todoItem fadeIn";
        li.id = id == null ? newId : id;
        li.appendChild(div);
        
        const p404 = el("#todo404");
        if (p404) p404.remove();
        
        todoList.prepend(li);
        todoListContainer.scrollTop = 0;
        listeners();
        
        // TEMPLATE
        /*
          <li class="todoItem" id="todo1">
            <div>
              <div class="todoItemHover">
                <span><i class="dripicons-chevron-left"></i> Done</span>
                <span>Trash <i class="dripicons-chevron-right"></i></span>
              </div>
              <p>Do homework at 6 pm</p>
            </div>
          </li>
        */
      }
      
      
      function listenForMobile() {
        let doneOnTouchEnd, deleteOnTouchEnd;
        
        el(".todoItem").forEach((v,i) => {
          v.addEventListener("touchmove", e => {
            const touches = e.touches[0];
            const x = Math.round(touches.clientX);
            const div = v.children[0];
            const center = el(".container")[0].offsetWidth / 2;
            
            if (div.localName != "div") return;
            
            div.style.left = (x-(div.offsetWidth/2))+"px";
            
            if (x > center + (div.offsetWidth/2.5)) {
              // To delete
              div.style.background = "rgb(255,0,0,0.3)";
              deleteOnTouchEnd = true;
            } else if (x+(div.offsetWidth/2.5) < center) {
              // To done
              div.style.background = "rgb(0,255,0,0.3)";
              doneOnTouchEnd = true;
            } else {
              doneOnTouchEnd = false;
              deleteOnTouchEnd = false;
              backToDefault(div);
            }
            
          });
          v.addEventListener("touchend", e => {
            e.preventDefault();
            const div = v.children[0];
            const li = v;
            if (doneOnTouchEnd) doneTodoItem(li);
            if (deleteOnTouchEnd) deleteTodoItem(li);
            backToDefault(div,true);
          });
        });
        
          function backToDefault(div, left) {
            div.style.background = "rgb(255,255,255,0.1)";
            if (left) div.style.left = "0px";
          }
          function deleteTodoItem(li) {
            const data = JSON.parse(getData());
            const todoId = li.id;
            const ul = li.parentNode;
            data.forEach((todo, i) => {
              if (todo.id == todoId) {
                data.splice(i, 1);
                const newData = JSON.stringify(data);
                setData(newData);
                
                const p = document.createElement("p");
                p.textContent = "Todo deleted !";
                p.style.color = "red";
                
                const newLi = document.createElement("li");
                newLi.className = "fadeIn";
                newLi.appendChild(p);
                
                ul.replaceChild(newLi, li);
                
                setTimeout(_ => {
                  newLi.remove();
                  if (data.every(todo => todo.status == "done")) noContent();
                }, 2500);
                
              }
            });
            deleteOnTouchEnd = false;
          }
          function doneTodoItem(li) {
            const data = JSON.parse(getData());
            const todoId = li.id;
            const ul = li.parentNode;
            let todo;
            try {
              todo = data.find(todo => todo.id == todoId);
              todo.status = "done";
            } catch(e) {
              location.reload();
            }
            const newData = JSON.stringify(data);
            setData(newData);
            
            const p = document.createElement("p");
            p.textContent = "Todo completed !";
            p.style.color = "lime";
            
            const newLi = document.createElement("li");
            newLi.className = "fadeIn";
            newLi.appendChild(p);
            
            ul.replaceChild(newLi, li);
            
            setTimeout(_ => {
              newLi.remove();
              if (data.every(todo => todo.status == "done")) noContent();
            }, 2500);
            
            addTodo(todo.todo, todo.id, "done", false);
            doneOnTouchEnd = false;
          }
      }
      
     
      function listenForComputer() {
        let pos1, pos2;
       
        el(".todoItem").forEach((v, i) => {
          v.addEventListener("mousedown", dragStart);
          function dragStart(e) {
            e.preventDefault();
            pos2 = e.clientX;
            v.addEventListener("mouseup",_ => {
              v.removeEventListener("mouseup");
              v.removeEventListener("mousemove");
            });
            v.addEventListener("mousemove", dragging);
          }
          function dragging(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos3 = e.clientX;
            v.style.left = `${v.offsetLeft-pos1}px`;
          }
        });
      
      }



      function toggleDoneTodos() {
        const div = el(".doneTodoContainer")[0];
        if (div.classList.contains("show")) {
          div.classList.remove("show");
          div.classList.add("slideUp");
          setTimeout(_ => {
            div.classList.remove("slideUp");
            div.style.top = "-500px";
          }, 700);
          doneTodoBtn.style.opacity = "1";
          return;
        }
        div.classList.add("slideDown", "show");
        setTimeout(_ => {
          div.classList.remove("slideDown");
          div.style.top = "50px";
        }, 700);
        doneTodoBtn.style.opacity = "0";
        const overlay = document.createElement("div");
        overlay.id = "doneTodoOverlay";
        overlay.style = "background:#000;opacity:0.3;z-index:990;position:absolute;width:100%;height:100%;top:50%;left:50%;transform:translate(-50%,-50%);";
        document.body.appendChild(overlay);
        overlay.onclick = _ => {
          toggleDoneTodos();
          overlay.remove();
        }
      }

      
