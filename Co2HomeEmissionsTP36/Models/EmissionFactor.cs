namespace Co2HomeEmissionsTP36.Models;

public class EmissionFactor
{
    public int FactorId { get; set; }
    
    public double? ScopeOneEmission { get; set; }
    
    public double? ScopeTwoEmission { get; set; }
    
    public double? ScopeThreeEmission { get; set; }
    
    public int? EnergyId { get; set; }
    public Energy? Energy { get; set; }
}
