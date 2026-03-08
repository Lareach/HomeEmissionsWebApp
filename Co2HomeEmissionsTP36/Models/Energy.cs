using System.ComponentModel.DataAnnotations;

namespace Co2HomeEmissionsTP36.Models;

public class Energy
{
    public int EnergyId { get; set; }
    
    [StringLength(20)]
    public string? EnergyName { get; set; }
    
    public double? EnergyContentFactor { get; set; }
}
