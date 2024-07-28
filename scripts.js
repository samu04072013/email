// scripts.js
async function LogIn(email, contrasenna) {
	try {
		const response = await fetch(`http://localhost:5011/Email/LogIn?correo=${email}&contrasenna=${contrasenna}`);
		return  await response.json();
	  } catch (error) {
		console.error('Error:', error);
	  }
}
async function VerClientes() {
    try {
      const response = await fetch('http://localhost:5011/Email/VerClientes');
      return  await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
	}
async function VerClientes(correo, contrasenna) {
try {
	const response = await fetch('http://localhost:5011/Email/LogIn');
	return  await response.json();
} catch (error) {
	console.error('Error:', error);
}
}

function CrearCliente(nombre, email, contraseña) {
return fetch('http://localhost:5011/Email/CrearCliente', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    nombre: nombre,
    correo: email,
    contrasenna: contraseña
    })
})
.then(response => response.json())
.then(data => data)
.catch(error => console.error('Error:', error));
}

function EnviarCorreo(asunto, mensaje, destinatario, remitente) {
    return fetch('http://localhost:5011/Email/EnviarCorreo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        remitente: remitente,
        destinatarios: destinatario,
        cuerpo: mensaje,
        asunto: asunto        
      })
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error('Error:', error));
  }

function verCorreos(correo) {
    return fetch(`http://localhost:5011/Email/VerCorreos?correo={correo}`, {
        method: 'POST',
        headers: {
          'Accept': 'text/plain'
        },
        body: '' // or omit this line since the body is empty
      })
        .then(response => response.text())
        .then(data => data)
        .catch(error => console.error('Error:', error))
    
}


document.addEventListener("DOMContentLoaded", function() {
    const loginSection = document.getElementById("loginSection");
    const appSection = document.getElementById("appSection");
    const mainContent = document.getElementById("mainContent");
    const loginButton = document.getElementById("loginButton");
    const createAccountButton = document.getElementById("createAccountButton");
    const inboxLink = document.getElementById("inboxLink");
    const sentLink = document.getElementById("sentLink");
    const unreadLink = document.getElementById("unreadLink");
    const composeButton = document.getElementById("composeButton");
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const menu = document.getElementById("menu");

    loginButton.addEventListener("click", handleLogin);
    createAccountButton.addEventListener("click", handleCreateAccount);
    inboxLink.addEventListener("click", () => displayEmails("inbox"));
    sentLink.addEventListener("click", () => displayEmails("sent"));
    unreadLink.addEventListener("click", () => displayEmails("unread"));
    composeButton.addEventListener("click", displayComposeEmail);
    menuToggle.addEventListener("click", toggleMenu);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          document.getElementById('loginButton').click();
        }
      });
      
    document.getElementById("menuToggle").addEventListener("click",open_and_close_menu);
    function handleLogin() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("passwd").value;
        LogIn(email, password).then((value) => {
            if(value){
                alert("¡Inicio de sesión exitoso!")
                displayEmails("inbox")
            }else{
                alert("¡Usuario o contraseña incorrectos!")
            }
        });
          
    }

    function handleCreateAccount() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("passwd").value;
        if (email){
            try{
            CrearCliente(window.prompt("Ingresa tu nombre: "), email, password)
            }catch(exeption){
                console.debug(exeption)
            }
        }


    }
    return 1


    /*function change_passwd(passwd_new,passwd_old,email) {
        if (JSON.parse(localStorage.getItem(email)) == passwd_old){
            localStorage.setItem(email,passwd_new)
        }else{
            alert("contraseña actual es incorrecta")
        }
    }*/

    function displayEmails(type) {
        
        const username = document.getElementById("email").value
        mainContent.innerHTML = "";

        let filteredEmails = [];

        if (type === "inbox") {

            verCorreos(document.getElementById("email").value).then((value) => {
                filteredEmails = JSON.parse(value);
                console.info(value);
                foreach_filteredEmails();
            })
        } else if (type === "sent") {
            for (let i = 0; i < emails.length; i++) {
                    if (emails[i].sender == username) {
                        filteredEmails.push(emails[i]);
                        break; // Salir del bucle interno una vez que se encuentra el nombre de usuario
                    }
                }
        } else if (type === "unread") {
            for (let i = 0; i < emails.length; i++) {
                for (let e = 0; e < emails[i].recipients.length; e++) {
                    if (emails[i].recipients[e] == username && !emails[i].read) {
                        filteredEmails.push(emails[i]);
                        break; // Salir del bucle interno una vez que se encuentra el nombre de usuario
                    }
                }
            }
        }
        console.info(filteredEmails);
        function foreach_filteredEmails() {

        filteredEmails.forEach(email_l => {
            console.debug(email_l);
                const emailItem = document.createElement("div");
                emailItem.className = "email-item";
                emailItem.innerHTML = `
                <div class="email-info">
                <span><strong>De:</strong> ${email_l.remitente}</span>
                <span><strong>Para:</strong> ${email_l.destinatarios.join(", ")}</span>
                <span><strong>Título:</strong> ${email_l.asunto}</span>
                </div>
                ${email_l.read ? "" : '<div class="unread-dot"></div>'}
                `;
                console.debug("hola")
                emailItem.addEventListener("click", () => {
                    email_l.read = true;
                    localStorage.setItem("emails", JSON.stringify(emails));
                    
                    const parentElement = document.getElementById("mainContent"); // Reemplaza "parentElementId" con el ID del elemento padre

                    // Eliminar todos los hijos del elemento padre
                    while (parentElement.firstChild) {
                        parentElement.removeChild(parentElement.firstChild);
                    }
                    displayMail(email_l)
                });
                mainContent.appendChild(emailItem);
                

        })
        }
    }



    function displayMail(email_l){
        const emailItem = document.createElement("div");
        emailItem.className = "mail";
        emailItem.innerHTML = `
        <div class="mail-info">
            <span><strong>De:</strong> ${email_l.sender}</span><br>
            <span><strong>Para:</strong> ${email_l.recipients.join(", ")}</span><br>
            <span> ${email_l.title}</span><br><br><br>
            <p>${email_l.content}</p>
        </div>
        `;
        mainContent.appendChild(emailItem)
    }

    function displayComposeEmail() {
        mainContent.innerHTML = `
            <div class="compose-email">
                <input type="text" id="composeTitle" placeholder="Título" class="sendEmailInput"/>
                <textarea id="composeContent" placeholder="Contenido" class="sendEmailInput"></textarea>
                <input type="text" id="composeRecipients" placeholder="Destinatarios (separados por comas)" class="sendEmailInput"/>
                <button type="button" id="sendEmailButton" class="sendEmailButton">Enviar</button>
            </div>
        `;
        document.getElementById("sendEmailButton").addEventListener("click", sendEmail);
    }

    function sendEmail() {
        const title = document.getElementById("composeTitle").value;
        const content = document.getElementById("composeContent").value;
        const recipients = document.getElementById("composeRecipients").value.split(",");

        if (title && content && recipients.length > 0) {
            const emails = JSON.parse(localStorage.getItem("emails")) || [];
            const username = document.getElementById("user").value;
            const newEmail = {
                sender: username,
                recipients: recipients.map(r => r.trim()),
                title,
                content,
                read: false,
                received: true,
                sent: true,
                timestamp: new Date().toLocaleString()
            };
            emails.push(newEmail);
            localStorage.setItem("emails", JSON.stringify(emails));
            alert("¡Correo enviado!");
            displayEmails("sent");
        } else {
            alert("Por favor, completa todos los campos");
        }
    }

    function toggleMenu() {
        sidebar.classList.toggle("collapsed");
        menu.classList.toggle("visible");
    }

    function open_and_close_menu() {
        let menuBoton = document.getElementById("menuToggle");
        let originalStyle = window.getComputedStyle(document.getElementById('composeButton'));
        let menu = document.getElementById("menu");
        let botonEnviar = document.getElementById("composeButton");
        const boton2 = document.getElementById('inboxLink');
        const boton3 = document.getElementById('unreadLink');
        const boton4 = document.getElementById('sentLink');
        const Enviar = document.getElementById("composeButton");
        if (menuBoton.lastChild.tagName === "I"){
            const texto = document.createElement('span');
            const texto2 = document.createElement('span');
            const texto3 = document.createElement('span');
            const texto4 = document.createElement('span');
            const texto5 = document.createElement("span")
            const boton = document.getElementById('menuToggle');
            const boton2 = document.getElementById('inboxLink');
            const boton3 = document.getElementById('unreadLink');
            const boton4 = document.getElementById('sentLink');
            texto.textContent = "Menu";
            texto2.textContent = "Recibidos";
            texto3.textContent = "No leídos";
            texto4.textContent = "Enviados";
            texto5.textContent = "Nuevo correo"
            boton.appendChild(texto);
            boton2.appendChild(texto2);
            boton3.appendChild(texto3);
            boton4.appendChild(texto4);
            Enviar.appendChild(texto5);
            const sidebar = document.getElementById("sidebar");
            sidebar.style.width = "250px";
            sidebar.style.height = "100%";
            botonEnviar.style.cssText = originalStyle.cssText;
        }else{
            menuBoton.lastChild.remove();
            boton2.lastChild.remove();
            boton3.lastChild.remove();
            boton4.lastChild.remove();
            Enviar.lastChild.remove();
            const sidebar = document.getElementById("sidebar");
            sidebar.style.width = "90px";
            sidebar.style.height = "100%";
            sidebar.style.margin = "0 auto";
            menu.style.margin = " 0 auto";
            menu.style.width = "50%";
            botonEnviar.style.margin = "0 auto";
            botonEnviar.style.width = "50%";
    }
}});
