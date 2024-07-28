public class ClienteCorreo
{
    public string ClienteId { get; set; }
    public CLIENTES Cliente { get; set; }
    public Guid CorreoId { get; set; }
    public CORREOS Correo { get; set; }
    public bool Read { get; set; }
}
