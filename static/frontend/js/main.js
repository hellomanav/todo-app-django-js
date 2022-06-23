function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
var activeItem = null

buildList()
function buildList(){
    var wrapper = document.getElementById('list-wrapper')
    //wrapper.innerHTML = ''
    var url = 'http://127.0.0.1:8000/api/task-list/'
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        // console.log('Data:', data) 
        console.log('list is -----------')
        var list = data
        console.log(list)
        wrapper.innerHTML=''
        var items =''
        for (var i in list){
            var title = `<span class="title">${list[i].title}</span>`
            if (list[i].completed == true){
                title = `<strike class="title">${list[i].title}</strike>`
            }
            items+= `
                <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        ${title}
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit </button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                </div>
            `
        }
        wrapper.innerHTML += items
        for (let i in list){
            let editBtn = document.getElementsByClassName('edit')[i]
            let deleteBtn = document.getElementsByClassName('delete')[i]
            let title = document.getElementsByClassName('title')[i]

            // editBtn.addEventListener('click', editItem.bind({element:editBtn,item:item}))
            editBtn.addEventListener('click', function(event){
                    editItem(event,list[i],this)      
            })
            deleteBtn.addEventListener('click', function(event){
                deleteItem(event,list[i],this)      
            })
            title.addEventListener('click', function(){
                strikeUnstrike(list[i])
            })
        }
    })
}

// Creating/Updating a new task

var form = document.getElementById('form-wrapper')
form.addEventListener('submit', function(e){
    e.preventDefault()
    console.log('Form submitted')
    var url = 'http://127.0.0.1:8000/api/task-create/'
    if (activeItem != null){
        var url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
        activeItem = null
    }
    var title = document.getElementById('title').value
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':title})
    }
    ).then(function(response){
        buildList()
        document.getElementById('form').reset()
    })
})

// Edit button clicked

function editItem(event,item){
    // console.log('event is--------')
    // console.log(event)
    // console.log('this is--------')
    // console.log(this)
    console.log('item is--------')
    console.log(item)
    activeItem = item
    document.getElementById('title').value = activeItem.title
}

// Deleting a new task

function deleteItem(event,item){
    console.log('Delete clicked')
    fetch(`http://127.0.0.1:8000/api/task-delete/${item.id}/`, {
        method:'DELETE', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        }
    }).then((response) => {
        buildList()
    })
}

// Changing task statuss / update

function strikeUnstrike(item){
    console.log('Strike clicked')
    item.completed = !item.completed
    fetch(`http://127.0.0.1:8000/api/task-update/${item.id}/`, {
        method:'POST', 
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':item.title, 'completed':item.completed})
    }).then((response) => {
        buildList()
    })
}
