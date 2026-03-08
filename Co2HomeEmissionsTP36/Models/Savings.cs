using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Co2HomeEmissionsTP36.Models;

public class Savings
{
    public int Uid { get; set; }
    
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int SavingsId { get; set; }
    
    [StringLength(100)]
    public string? Title { get; set; }
    
    [StringLength(255)]
    public string? Description { get; set; }
    
    [StringLength(50)]
    public string? Method { get; set; }
    
    [StringLength(50)]
    public string? Duration { get; set; }
    
    [StringLength(1000)]
    public string? EligibilityRequirements { get; set; }
    
    [StringLength(255)]
    public string? CtaUrl { get; set; }
    
    public int? CategoryId { get; set; }
    public SavingsCategory? Category { get; set; }
}
