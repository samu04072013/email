using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class PruebasContext : DbContext
{
    public PruebasContext(DbContextOptions<PruebasContext> options) : base(options)
    {

    }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClienteCorreo>()
            .HasKey(cc => new { cc.ClienteId, cc.CorreoId });

        modelBuilder.Entity<ClienteCorreo>()
            .HasOne(cc => cc.Cliente)
            .WithMany(c => c.ClienteCorreos)
            .HasForeignKey(cc => cc.ClienteId);

        modelBuilder.Entity<ClienteCorreo>()
            .HasOne(cc => cc.Correo)
            .WithMany(c => c.ClienteCorreos)
            .HasForeignKey(cc => cc.CorreoId);
    }

    public virtual DbSet<CLIENTES> CLIENTES { get; set; }
    public virtual DbSet<CORREOS> CORREOS { get; set; }
    public virtual DbSet<ClienteCorreo> ClienteCorreo { get; set; }
}
