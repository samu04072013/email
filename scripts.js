// scripts.js

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
      
    function handleLogin() {
        const username = document.getElementById("user").value;
        const password = document.getElementById("passwd").value;

        const storedPassword = localStorage.getItem(username);
        if (storedPassword === password) {
            alert("¡Inicio de sesión exitoso!");
            loginSection.style.display = "none";
            appSection.style.display = "flex";
            displayEmails("inbox");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    }

    function handleCreateAccount() {
        const username = document.getElementById("user").value;
        const password = document.getElementById("passwd").value;

        if (username) {
            if (!localStorage.getItem(username)){
                localStorage.setItem(username, password);
                alert("¡Cuenta creada exitosamente!");   
            }else{
                if(window.confirm("cuenta ya existe,¿desea cambiar la contraseña?")){
                    let passwd_old = window.prompt("ingresa la contraseña actual:","")
                    if (JSON.parse(localStorage.getItem(username)) == passwd_old){
                        passwd_new = window.prompt("ingresa la nueva contraseña:","");
                        change_passwd(passwd_new,passwd_old,username)
                    }else{
                        alert("contraseña actual incorrecta")
                    }
                }
            }

        } else {
            alert("Por favor, ingresa un usuario y una contraseña válidos");
        }
    }

    function change_passwd(passwd_new,passwd_old,email) {
        if (JSON.parse(localStorage.getItem(email)) == passwd_old){
            localStorage.setItem(email,passwd_new)
        }else{
            alert("contraseña actual es incorrecta")
        }
    }

    function displayEmails(type) {
        let emails = [];

        try {
            const storedEmails = localStorage.getItem("emails");
            if (storedEmails) {
                emails = JSON.parse(storedEmails);
            }
        } catch (error) {
            console.error("Error al parsear los datos del almacenamiento local:", error);
        }
        
        const username = document.getElementById(user)
        mainContent.innerHTML = "";

        let filteredEmails = [];

        if (type === "inbox") {

            for (let i = 0; i < emails.length; i++) {
                console.log(`i=${i}`)
                for (let e = 0; e < emails[i].recipients.length; e++) {
                    console.log(`e=${e}`)
                    if (emails[i].recipients[e] == username) {
                        filteredEmails = filteredEmails.push(emails[i]);
                        break; // Salir del bucle interno una vez que se encuentra el nombre de usuario
                    }
                }
            }
            console.log(`work=${emails}`)
        } else if (type === "sent") {
            work = []
            for (i in emails)
                {
                    if (i.sender == username)
                        {
                            work.push(i)
                        }
                }
                filteredEmails = emails.filter(email => email.sender in work);
        } else if (type === "unread") {
            work = []
            for (i in emails)
                {
                    if (i.recipients == username)
                        {
                            work.push(i)
                        }
                }
                filteredEmails = emails.filter(email => email.received && email.recipients in work && !email.read);
        }

        for(let email_i = 0; email_i < filteredEmails.length; email_i++){
                let email_l = filteredEmails[email_i]
                const emailItem = document.createElement("div");
                emailItem.className = "email-item";
                emailItem.innerHTML = `
                <div class="email-info">
                <span><strong>De:</strong> ${email_l.sender}</span>
                <span><strong>Para:</strong> ${email_l.recipients.join(", ")}</span>
                <span><strong>Título:</strong> ${email_l.title}</span>
                </div>
                ${email_l.read ? "" : '<div class="unread-dot"></div>'}
                `;
                emailItem.addEventListener("click", () => {
                    email_l.read = true;
                    localStorage.setItem("emails", JSON.stringify(emails));
                    displayEmails(type);
                });
                mainContent.appendChild(emailItem);

        }
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
});

