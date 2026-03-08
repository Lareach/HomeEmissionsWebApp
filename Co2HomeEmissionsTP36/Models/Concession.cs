using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Co2HomeEmissionsTP36.Models;

public class Concession
{
    public int Uid { get; set; }
    
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int ConcessionId { get; set; }
    
    [StringLength(100)]
    public string? ConcessionName { get; set; }
}
