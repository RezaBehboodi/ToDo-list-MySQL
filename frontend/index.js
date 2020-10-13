document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});
document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "btn btn-primary d") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "btn btn-primary e") {
        handleEditRow(event.target.dataset.id);
    }
});

//DELETE TODO
function deleteRowById(id) {
    if (confirm('Are you sure to delete this record ?')) {
        fetch('http://localhost:5000/delete/' + id, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
    }
}

//CANCEL UPDATE
const cancelBtn = document.querySelector('#cancel-btn');
cancelBtn.onclick = function () {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = true;
}

//EDIT TODO
function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-todo').dataset.id = id;
}
const updateBtn = document.querySelector('#update-data-btn');
updateBtn.onclick = function () {
    const updateTodoInput = document.querySelector('#update-todo');
    const updateDateInput = document.querySelector('#update-date');
    const updateDescInput = document.querySelector('#update-description');
    const todo = updateTodoInput.value;
    const date = updateDateInput.value;
    const description = updateDescInput.value;
    if (todo != "" && date != "" && description != "") {
        fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: updateTodoInput.dataset.id,
                todo: todo,
                date: date,
                description: description
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            })
    } else { //confirm('Please fill all places!') 
        const updateSection = document.querySelector('#update-row');
        updateSection.hidden = false;
    }
}

//INSERT TODO
const addBtn = document.querySelector('#save-data');
addBtn.onclick = function () {
    const todoInput = document.querySelector('#todo-input');
    const todo = todoInput.value;
    const dateInput = document.querySelector('#date-input');
    const date = dateInput.value;
    const descriptionInput = document.querySelector('#description-input');
    const description = descriptionInput.value;
    if (todo != "" && date != "" && description != "") {
        fetch('http://localhost:5000/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                todo: todo,
                date: date,
                description: description
            })
        })
            .then(response => response.json())
            .then(data => insertRowIntoTable(data['data']));
    } else { confirm('Please fill all places!') }
}
function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');
    let tableHtml = "<tr>";
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class="btn btn-primary d" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="btn btn-primary e" data-id=${data.id}>Edit</td>`;
    tableHtml += "</tr>";
    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

//TABLE SHOW
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";

    data.forEach(function ({ id, todo, date, description }) {
        tableHtml += "<tr>";
        //tableHtml += `<td scope="row">${id}</td>`;
        tableHtml += `<td scope="row">${todo}</td>`;
        tableHtml += `<td scope="row">${date}</td>`;
        tableHtml += `<td scope="row" text-right">${description}</td>`;
        tableHtml += `<td scope="row"><button type="submit" class="btn btn-primary d" data-id=${id}>Delete</button>
        <button class="btn btn-primary e" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
}