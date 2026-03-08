using Co2HomeEmissionsTP36.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Co2HomeEmissionsTP36.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;

		public HomeController(ILogger<HomeController> logger)
		{
			_logger = logger;
		}

		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Privacy()
		{
			return View();
		}
		
		public IActionResult Graph()
		{
			return View();
		}

        public IActionResult ClimateAction()
        {
            return View();
        }
		public IActionResult GovernmentalSupport()
		{
			return View();
		}
        public IActionResult InteractiveHouse()
        {
            return View();
        }

        public IActionResult Reference()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
