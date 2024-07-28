using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class EmailController:ControllerBase{
    private PruebasContext pruebasContext;
    public EmailController(PruebasContext pruebas_context){
        pruebasContext = pruebas_context;

    }
    
    [HttpGet("VerClientes")]
    public List<Dictionary<string, string>> Obtener(){
        List<Dictionary<string, string>> lista = new List<Dictionary<string, string>>();
        foreach (CLIENTES item in pruebasContext.CLIENTES.ToList())
        {
            lista.Add(new Dictionary<string, string> { { item.Nombre, item.Correo } });
        }
        return lista;
    }

    [HttpPost("CrearCliente")]
    public void Insertar(ClientesDTOs clientes){
        try{
        CLIENTES cliente = new CLIENTES();
        cliente.Nombre = clientes.Nombre;
        cliente.Correo = clientes.Correo;
        cliente.Contrasenna = clientes.Contrasenna;
        pruebasContext.CLIENTES.Add(cliente);
        pruebasContext.SaveChanges();
        }catch(DbUpdateException ex){
            // Handle the exception
            Console.WriteLine("Error saving changes: " + ex.Message);
            // Roll back changes
            pruebasContext.ChangeTracker.Entries().ToList().ForEach(x => x.Reload());
        }

    }

    [HttpPost("EnviarCorreo")]
    public void EnviarCorreo(CorreosDTOs correo){
        CORREOS correos = new CORREOS();
        correos.IdCorreo = Guid.NewGuid();
        correos.Remitente = correo.Remitente;
        //correos.CLIENTES = new List<CLIENTES>();
        foreach(var Destinatario in correo.Destinatarios){
            CLIENTES cliente = pruebasContext.CLIENTES.First(x => x.Correo == Destinatario);
            ClienteCorreo ClienteCorreo = new ClienteCorreo();
            ClienteCorreo.Correo = correos;
            ClienteCorreo.Cliente = cliente;

            pruebasContext.ClienteCorreo.Add(ClienteCorreo);
            //correos.CLIENTES.Add(cliente);
        }
        correos.Asunto = correo.Asunto;
        correos.Cuerpo = correo.Cuerpo;
        pruebasContext.CORREOS.Add(correos);
        pruebasContext.SaveChanges();
    }

    [HttpPost("VerCorreos")]
    public List<CorreosDTOs> VerCorreos(string correo){
	    List<CORREOS> correos = new List<CORREOS>();
        CLIENTES cliente = new CLIENTES();
        cliente.Nombre = "";
        cliente.Correo = correo;
        cliente.Contrasenna = "";
        var q = from c in pruebasContext.CLIENTES
                join cc in pruebasContext.ClienteCorreo on c.Correo equals cc.ClienteId
                where c.Correo == correo
                select  cc.Correo ;
        List<CorreosDTOs> correosDTOs = new List<CorreosDTOs>();
        foreach(var item in q){
            correosDTOs.Add(new CorreosDTOs{
                Remitente = item.Remitente,
                Destinatarios = pruebasContext.ClienteCorreo.Where(x => x.Correo == item).Select(x => x.Cliente.Correo).ToList(),
                Asunto = item.Asunto,
                Cuerpo = item.Cuerpo
            });
        }

       return correosDTOs;
    }
    [HttpPost("EditarUsuario")]
    public void EditarUsuario(string correo, bool passwd, string value){
        CLIENTES cliente = pruebasContext.CLIENTES.First( x => x.Correo == correo );
        if ( cliente != null){
            if (passwd){
                cliente.Contrasenna = value;
            }else{
                cliente.Nombre = value;
            }
            pruebasContext.CLIENTES.Update(cliente);
            pruebasContext.SaveChanges();
        }
    }

    [HttpGet("LogIn")]
    public bool LogIn(string correo, string contrasenna){
        bool result = false;
        foreach (CLIENTES item in pruebasContext.CLIENTES)
        {
            if(item.Correo == correo && item.Contrasenna == contrasenna){
                result = true;
            }
        }
        return result;
    }

}