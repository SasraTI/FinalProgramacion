// Inicialización y manejo de usuarios
let users = JSON.parse(localStorage.getItem('users')) || {
    admin: 'admin123' // Usuario administrador predeterminado
};

// Mostrar secciones de registro y login
function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('crudSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
}

function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('crudSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('adminHeader').style.display = 'none';
}

function showCRUD() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('crudSection').style.display = 'block';
    document.getElementById('usersSection').style.display = 'none';
}


function showUsers() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('crudSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'block';
    loadUsers();
}

function showHome() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('crudSection').style.display = 'block';
    document.getElementById('usersSection').style.display = 'none';

    // Verifica si el usuario es admin para mostrar el encabezado de administración
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser === 'admin') {
        showAdminheader();
    }
}

function showAdminheader() {
    document.getElementById('adminHeader').style.display = 'block';
}

// Registrar un nuevo usuario
function register() {
    const newUser = document.getElementById('registerUser').value;
    const newPassword = document.getElementById('registerPassword').value;

    if (newUser === '' || newPassword === '') {
        alert('Por favor, llena todos los campos.');
        return;
    }

    if (users[newUser]) {
        alert('El usuario ya existe.');
        return;
    }

    users[newUser] = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    showLogin();
}

// Cerrar sesión
function logout() {
    showLogin();
    localStorage.removeItem('currentUser');
}

// Validar formulario de datos
function ValidateForm() {
    let email = document.getElementById('inputEmail').value;
    let name = document.getElementById('inputName').value;
    let phone = document.getElementById('inputPhone').value;

    if (email === "") {
        alert("El correo electrónico es obligatorio");
        return false;
    } else if (!email.includes('@')) {
        alert("El correo es inválido");
        return false;
    }
    if (name === "") {
        alert("Tu nombre completo es obligatorio");
        return false;
    }
    if (phone === "") {
        alert("Tu número de teléfono es obligatorio");
        return false;
    }

    return true;
}

function saveData(email, name, phone, createdBy) {
    let listPeople = JSON.parse(localStorage.getItem('listPeople')) || [];
    listPeople.push({ email, name, phone, createdBy });
    localStorage.setItem('listPeople', JSON.stringify(listPeople));
}

// Añadir datos
function AddData() {
    if (ValidateForm() === true) {
        let email = document.getElementById('inputEmail').value;
        let name = document.getElementById('inputName').value;
        let phone = document.getElementById('inputPhone').value;
        let username = localStorage.getItem('currentUser'); // Obtener el usuario actual

        saveData(email, name, phone, username);
        ReadData(username === 'admin', username); // Mostrar datos para admin o usuario actual
        document.getElementById('inputEmail').value = "";
        document.getElementById('inputName').value = "";
        document.getElementById('inputPhone').value = "";
    }
}

// Leer datos
function ReadData(isAdmin = false, username = '') {
    let listPeople = JSON.parse(localStorage.getItem('listPeople')) || [];
    
    // Si el usuario no es admin, filtramos los datos por el usuario actual
    if (!isAdmin) {
        listPeople = listPeople.filter(person => person.createdBy === username);
    }

    let html = "";
    listPeople.forEach(function (element, index) {
        html += "<tr>";
        html += "<td>" + element.email + "</td>";
        html += "<td>" + element.name + "</td>";
        html += "<td>" + element.phone + "</td>";
        html += `<td><button onclick="editData(${index}, '${username}')" class="btn btn-warning">Editar</button> 
                 <button onclick="deleteData(${index}, '${username}')" class="btn btn-danger">Eliminar</button></td>`;
        html += "</tr>";
    });

    document.querySelector('#tableData tbody').innerHTML = html;
}

// Modificación de la función login para asegurar que ReadData se llame correctamente
function login() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username] === password) {
        showCRUD();
        if (username === 'admin') {
            showAdminheader();
            ReadData(true, username); // Leer datos de todos los usuarios para el admin
        } else {
            ReadData(false, username); // Leer datos solo del usuario actual
        }
        localStorage.setItem('currentUser', username);
        document.getElementById('currentUser').innerText = `Bienvenido, ${username}`;
        
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

// Editar datos
function EditData(index) {
    let data = JSON.parse(localStorage.getItem('data'));
    let entry = data[index];

    document.getElementById('inputEmail').value = entry.email;
    document.getElementById('inputName').value = entry.name;
    document.getElementById('inputPhone').value = entry.phone;

    document.getElementById('btnAdd').style.display = 'none';
    let updateButton = document.getElementById('btnUpdate');
    updateButton.style.display = 'inline';
    updateButton.onclick = function() {
        UpdateData(index);
    };
}

// Actualizar datos
function UpdateData(index) {
    if (ValidateForm() === true) {
        let data = JSON.parse(localStorage.getItem('data'));

        data[index].email = document.getElementById('inputEmail').value;
        data[index].name = document.getElementById('inputName').value;
        data[index].phone = document.getElementById('inputPhone').value;

        localStorage.setItem('data', JSON.stringify(data));
        ReadData(true);

        document.getElementById('inputEmail').value = '';
        document.getElementById('inputName').value = '';
        document.getElementById('inputPhone').value = '';

        document.getElementById('btnAdd').style.display = 'inline';
        document.getElementById('btnUpdate').style.display = 'none';
    }
}

// Eliminar datos
function DeleteData(index) {
    let data = JSON.parse(localStorage.getItem('data'));
    data.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(data));
    ReadData(true);
}

function loadUsers() {
    let tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';

    for (let user in users) {
        if (user !== 'admin') { // Excluir el usuario administrador
            let row = tableBody.insertRow();
            let userCell = row.insertCell(0);
            let actionsCell = row.insertCell(1);

            userCell.textContent = user;
            actionsCell.innerHTML = `<button onclick="deleteUser('${user}')" class="btn btn-warning">Eliminar</button>`;
        }
    }
}

// Agregar un nuevo usuario
function addUsuario() {
    const newUser = document.getElementById('addUser').value;
    console.log(newUser);
    const newPassword = document.getElementById('addUserPassword').value;
    console.log(newPassword);

    if (newUser === '' || newPassword === '') {
        alert('Por favor, llena todos los campos.');
        return;
    }

    if (users[newUser]) {
        alert('El usuario ya existe.');
        return;
    }

    users[newUser] = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuario agregado exitosamente.');
    loadUsers();
}

// Eliminar un usuario
function deleteUser(username) {
    if (confirm(`¿Seguro que deseas eliminar el usuario ${username}?`)) {
        delete users[username];
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
}

// Iniciar mostrando la sección de login
showLogin();
