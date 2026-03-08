using Co2HomeEmissionsTP36.Models;
using Microsoft.EntityFrameworkCore;

namespace Co2HomeEmissionsTP36.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    public DbSet<SavingsCategory> category { get; set; }
    public DbSet<Concession> concession { get; set; }
    public DbSet<Savings> savings { get; set; }
    
    public DbSet<SavingsConcession>? savingsConcession { get; }
    
    public DbSet<Energy> energy { get; set; }
    
    public DbSet<EmissionFactor> emissionFactor { get; set; }
    
    public DbSet<EnergyConsumption> energyConsumption { get; set; }
    
    // Define database schema
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SavingsCategory>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<Concession>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<Savings>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<SavingsConcession>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<SavingsCategory>()
            .HasKey(c => c.CategoryId);

        modelBuilder.Entity<Concession>()
            .HasKey(c => c.ConcessionId);
        
        modelBuilder.Entity<Savings>()
            .HasKey(s => s.SavingsId);
        
        modelBuilder.Entity<SavingsConcession>()
            .HasKey(sc => new { sc.SavingsId, sc.ConcessionId });
        
        modelBuilder.Entity<Savings>()
            .HasOne(s => s.Category)
            .WithMany()
            .HasForeignKey(s => s.CategoryId);

        modelBuilder.Entity<SavingsConcession>()
            .HasOne(sc => sc.Savings)
            .WithMany()
            .HasForeignKey(sc => sc.SavingsId);

        modelBuilder.Entity<SavingsConcession>()
            .HasOne(sc => sc.Concession)
            .WithMany()
            .HasForeignKey(sc => sc.ConcessionId);
        
        modelBuilder.Entity<Energy>()
            .HasKey(c => c.EnergyId);

        modelBuilder.Entity<EmissionFactor>()
            .HasKey(c => c.FactorId);
        
        modelBuilder.Entity<EnergyConsumption>()
            .HasKey(s => s.ConsumptionId);
        
        modelBuilder.Entity<EmissionFactor>()
            .HasOne(sc => sc.Energy)
            .WithMany()
            .HasForeignKey(sc => sc.EnergyId);

        modelBuilder.Entity<EnergyConsumption>()
            .HasOne(sc => sc.Energy)
            .WithMany()
            .HasForeignKey(sc => sc.EnergyId);
    }
}
