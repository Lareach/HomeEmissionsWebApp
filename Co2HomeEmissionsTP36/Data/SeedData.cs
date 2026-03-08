using Microsoft.EntityFrameworkCore;
using Co2HomeEmissionsTP36.Models;

namespace Co2HomeEmissionsTP36.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());
        
        if(!context.energy.Any())
        {
            context.energy.AddRange(
                new Energy
                {
                    EnergyName = "Electricity",
                    EnergyContentFactor = null
                },
                new Energy
                {
                    EnergyName = "Natural Gas",
                    EnergyContentFactor = 0.0393
                },
                new Energy
                {
                    EnergyName = "LPG",
                    EnergyContentFactor = 25.7
                },
                new Energy
                {
                    EnergyName = "Firewood",
                    EnergyContentFactor = 16.2
                },
                new Energy
                {
                    EnergyName = "Solar",
                    EnergyContentFactor = null
                }
            );
            context.SaveChanges();
        }
        
        if(!context.emissionFactor.Any())
        {
            context.emissionFactor.AddRange(
                new EmissionFactor
                {
                    ScopeOneEmission = null,
                    ScopeTwoEmission = 0.85,
                    ScopeThreeEmission = 0.07,
                    EnergyId = 1
                },
                new EmissionFactor
                {
                    ScopeOneEmission = 51.53,
                    ScopeTwoEmission = null,
                    ScopeThreeEmission = null,
                    EnergyId = 2
                },
                new EmissionFactor
                {
                    ScopeOneEmission = 60.6,
                    ScopeTwoEmission = null,
                    ScopeThreeEmission = 20.2,
                    EnergyId = 3
                },
                new EmissionFactor
                {
                    ScopeOneEmission = 1.2,
                    ScopeTwoEmission = null,
                    ScopeThreeEmission = null,
                    EnergyId = 4
                }
            );
            context.SaveChanges();
        }
    }
}
