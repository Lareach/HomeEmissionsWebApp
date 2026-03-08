using System.ComponentModel.DataAnnotations.Schema;

namespace Co2HomeEmissionsTP36.Models;

public class SavingsConcession
{
    public int Uid { get; set; }
    
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int SavingsId { get; set; }
    
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int ConcessionId { get; set; }
    
    public Savings? Savings { get; set; }
    public Concession? Concession { get; set; }
}
