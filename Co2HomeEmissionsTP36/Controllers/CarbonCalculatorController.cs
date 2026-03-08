using Microsoft.AspNetCore.Mvc;

namespace Co2HomeEmissionsTP36.Controllers;

public class CarbonCalculatorController : Controller
{
    public CarbonCalculatorController()
    {

    }

    // GET: CarbonCalculator/Index
    public IActionResult Index()
    {
        return View();
    }
}
