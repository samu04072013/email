using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("CORREOS")]
public class CORREOS
{
    [Key]
    [Column("ID")]
    public Guid IdCorreo { get; set; }
    
    [Column("REMITENTE")]
    public string Remitente { get; set; }
    
    [Column("ASUNTO")]
    public string Asunto { get; set; }
    
    [Column("CUERPO")]
    public string Cuerpo { get; set; }
    
    public ICollection<ClienteCorreo> ClienteCorreos { get; set; }
}
