using System.ComponentModel.DataAnnotations;

namespace Co2HomeEmissionsTP36.Models;

public class EnergyConsumption
{
    public int ConsumptionId { get; set; }
    
    [StringLength(20)]
    public string? Year { get; set; }
    
    public int? HouseholdNum { get; set; }
    
    public double? EmissionAmount { get; set; }
    
    public int? EnergyId { get; set; }
    public Energy? Energy { get; set; }
}
