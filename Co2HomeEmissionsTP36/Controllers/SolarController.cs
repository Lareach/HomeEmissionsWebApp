using Microsoft.AspNetCore.Mvc;

namespace Co2HomeEmissionsTP36.Controllers;

public class SolarController : Controller
{
    public SolarController()
    {

    }

    // GET: Solar/Index
    public IActionResult Index()
    {
        return View();
    }
}
