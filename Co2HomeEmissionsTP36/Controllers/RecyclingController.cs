using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Co2HomeEmissionsTP36.Controllers;

public class RecyclingController : Controller
{
    private readonly string _apiServer = "https://8zb2oanzdl.azurewebsites.net/";

    public RecyclingController()
    {

    }

    // GET: Recycling/
    public IActionResult Index()
    {
        return View();
    }

    // GET: Recycling/Classify
    public IActionResult Classify()
    {
        return View();
    }

    // GET: Recycling/Dictionary
    public IActionResult Dictionary()
    {
        return View();
    }

    // POST: Recycling/Classify
    [HttpPost]
    public async Task<IActionResult> Classify(IFormFile imageFile)
    {
        if(imageFile.Length > 0)
        {
            if(!IsImageTypeSupported(imageFile.ContentType))
            {
                ModelState.AddModelError("imageFile", "The selected file is not a supported image type.");
                return View();
            }

            // Read the image file into a byte array
            byte[] imageData;
            using(var stream = new MemoryStream())
            {
                await imageFile.CopyToAsync(stream);
                imageData = stream.ToArray();
            }

            // Convert to base 64 string
            var data = new
            {
                image = Convert.ToBase64String(imageData),
            };

            // Send image to Python server for prediction result
            var response = await new HttpClient().PostAsync(_apiServer, 
                new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json"));

            // Check if the request was not successful
            if(!response.IsSuccessStatusCode)
            {
                HttpStatusCode statusCode = response.StatusCode;
                Console.WriteLine($"HTTP request failed with status code: {(int)statusCode} - {statusCode}");
                return View("Error");
            }

            // Read the JSON data from the response
            var result = await response.Content.ReadAsStringAsync();
            var values = JsonSerializer.Deserialize<Dictionary<string, double>>(result);

            ViewBag.ImageData = Convert.ToBase64String(imageData);

            // Pass the JSON data to the view
            return View("Classify", values);
        }

        // If no file was selected, return to the same page
        return RedirectToAction(nameof(Classify));
    }

    private static bool IsImageTypeSupported(string contentType)
    {
        string[] supportedImageTypes = ["image/jpg", "image/jpeg", "image/png"];

        foreach (string supportedType in supportedImageTypes)
        {
            if (contentType.Equals(supportedType, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }
        return false;
    }
}
