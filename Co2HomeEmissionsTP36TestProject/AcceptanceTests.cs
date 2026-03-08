using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace Co2HomeEmissionsTP36TestProject;

[Trait("Category", "Acceptance")]
public class AcceptanceTests : IDisposable
{
    private readonly ChromeDriver _driver;
    public AcceptanceTests() => _driver = new ChromeDriver();
    
    public void Dispose() 
    {
        _driver.Quit();
        _driver.Dispose(); 
    }
    
    [Fact]
    public void ViewHomePage() 
    {
        // Update the URL to your own local server
        _driver.Navigate().GoToUrl("http://localhost:5150/");

        var text = _driver.FindElement(By.CssSelector(".website-text h1")).Text;
        
        Assert.Contains("We’re thinking globally, acting locally", text);
    }
}
