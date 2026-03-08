using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Co2HomeEmissionsTP36.Models;

public class SavingsCategory
{
    public int Uid { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int CategoryId { get; set; }
    
    [StringLength(50)]
    public string? CategoryName { get; set; }
}
