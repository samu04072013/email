using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("CLIENTES")]
public class CLIENTES
{
    [Key]
    [Column("CORREO")]
    public string Correo { get; set; }
    
    [Column("NOMBRE")]
    public string Nombre { get; set; }
    
    [Column("CONTRASENNA")]
    public string Contrasenna { get; set; }
    
    public ICollection<ClienteCorreo> ClienteCorreos { get; set; }
}
